<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DealerOrder;
use App\Models\DealerDispatch;
use App\Models\Counter;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class DealerOrderController extends Controller
{
    // GET /api/dealer-orders
    public function index(Request $request, Response $response): Response
    {
        $orders = DealerOrder::with('dispatches')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'poNo' => $order->po_no,
                    'dealerName' => $order->dealer_name,
                    'place' => $order->place,
                    'village' => $order->village,
                    'totalOrderedWeight' => $order->total_ordered_weight,
                    'fulfilledWeight' => $order->fulfilled_weight,
                    'remainingWeight' => $order->remaining_weight,
                    'status' => $order->status,
                    'createdAt' => $order->created_at,
                    'updatedAt' => $order->updated_at,
                ];
            });

        return $this->json($response, $orders);
    }

    // POST /api/dealer-orders
    public function store(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        $order = DealerOrder::create([
            'po_no' => $data['poNo'] ?? '',
            'dealer_name' => $data['dealerName'] ?? '',
            'place' => $data['place'] ?? '',
            'village' => $data['village'] ?? '',
            'total_ordered_weight' => $data['totalOrderedWeight'] ?? 0,
            'status' => 'pending',
        ]);

        return $this->json($response, [
            'id' => $order->id,
            'poNo' => $order->po_no,
            'dealerName' => $order->dealer_name,
            'place' => $order->place,
            'village' => $order->village,
            'totalOrderedWeight' => $order->total_ordered_weight,
            'fulfilledWeight' => 0,
            'remainingWeight' => $order->total_ordered_weight,
            'status' => $order->status,
        ], 201);
    }

    // GET /api/dealer-orders/{id}
    public function show(Request $request, Response $response, array $args): Response
    {
        $id = $args['id'];
        $order = DealerOrder::with('dispatches')->find($id);

        if (!$order) {
            return $this->error($response, 'Dealer order not found', 404);
        }

        return $this->json($response, [
            'id' => $order->id,
            'poNo' => $order->po_no,
            'dealerName' => $order->dealer_name,
            'place' => $order->place,
            'village' => $order->village,
            'totalOrderedWeight' => $order->total_ordered_weight,
            'fulfilledWeight' => $order->fulfilled_weight,
            'remainingWeight' => $order->remaining_weight,
            'status' => $order->status,
            'dispatches' => $order->dispatches->map(function ($d) {
                return [
                    'id' => $d->id,
                    'billNo' => $d->bill_no,
                    'date' => $d->date,
                    'deliveryPlace' => $d->delivery_place,
                    'brokerName' => $d->broker_name,
                    'transportAgent' => $d->transport_agent,
                    'truckNo' => $d->truck_no,
                    'ownerName' => $d->owner_name,
                    'driverName' => $d->driver_name,
                    'driverLicense' => $d->driver_license,
                    'driverVillage' => $d->driver_village,
                    'driverMobile' => $d->driver_mobile,
                    'cropType' => $d->crop_type,
                    'bagsCount' => $d->bags_count,
                    'weight' => $d->weight,
                    'rate' => $d->rate,
                    'amount' => $d->amount,
                    'moisture' => $d->moisture,
                    'freightRate' => $d->freight_rate,
                    'totalFreight' => $d->total_freight,
                    'paidFreight' => $d->paid_freight,
                    'due_freight' => $d->due_freight,
                    'note' => $d->note,
                ];
            }),
        ]);
    }

    // POST /api/dealer-orders/{id}/dispatch
    public function storeDispatch(Request $request, Response $response, array $args): Response
    {
        $id = $args['id'];
        $order = DealerOrder::find($id);

        if (!$order) {
            return $this->error($response, 'Dealer order not found', 404);
        }

        $data = $request->getParsedBody();

        // Auto-increment bill number if not provided, using Counter
        $billNo = $data['billNo'] ?? null;
        if (!$billNo) {
            $billNo = Counter::getNextBillNo();
        }

        // Check unique billNo for dispatches to prevent collision
        $existingDispatch = DealerDispatch::where('bill_no', $billNo)->first();
        if ($existingDispatch) {
            // Pick next unique one
            $billNo = Counter::getNextBillNo();
        }

        $dispatch = DealerDispatch::create([
            'dealer_order_id' => $order->id,
            'bill_no' => $billNo,
            'date' => $data['date'] ?? date('Y-m-d'),
            'delivery_place' => $data['deliveryPlace'] ?? '',
            'broker_name' => $data['brokerName'] ?? '',
            'transport_agent' => $data['transportAgent'] ?? '',
            'truck_no' => $data['truckNo'] ?? '',
            'owner_name' => $data['ownerName'] ?? '',
            'driver_name' => $data['driverName'] ?? '',
            'driver_license' => $data['driverLicense'] ?? '',
            'driver_village' => $data['driverVillage'] ?? '',
            'driver_mobile' => $data['driverMobile'] ?? '',
            'crop_type' => $data['cropType'] ?? '',
            'bags_count' => isset($data['bagsCount']) ? (int) $data['bagsCount'] : null,
            'weight' => (float) ($data['weight'] ?? 0),
            'rate' => (float) ($data['rate'] ?? 0),
            'amount' => (float) ($data['amount'] ?? 0),
            'moisture' => isset($data['moisture']) ? (float) $data['moisture'] : null,
            'freight_rate' => isset($data['freightRate']) ? (float) $data['freightRate'] : null,
            'total_freight' => isset($data['totalFreight']) ? (float) $data['totalFreight'] : null,
            'paid_freight' => isset($data['paidFreight']) ? (float) $data['paidFreight'] : null,
            'due_freight' => isset($data['dueFreight']) ? (float) $data['dueFreight'] : null,
            'note' => $data['note'] ?? '',
        ]);

        // Update order status based on weights
        $fulfilled = $order->fulfilled_weight;
        if ($fulfilled >= $order->total_ordered_weight) {
            $order->status = 'fulfilled';
        } elseif ($fulfilled > 0) {
            $order->status = 'partially_fulfilled';
        } else {
            $order->status = 'pending';
        }
        $order->save();

        return $this->json($response, [
            'id' => $dispatch->id,
            'billNo' => $dispatch->bill_no,
            'date' => $dispatch->date,
            'truckNo' => $dispatch->truck_no,
            'weight' => $dispatch->weight,
            'orderStatus' => $order->status,
            'fulfilledWeight' => $fulfilled,
            'remainingWeight' => $order->remaining_weight,
        ], 201);
    }

    // DELETE /api/dealer-dispatches/{id}
    public function destroyDispatch(Request $request, Response $response, array $args): Response
    {
        $id = $args['id'];
        $dispatch = DealerDispatch::find($id);

        if (!$dispatch) {
            return $this->error($response, 'Dispatch not found', 404);
        }

        $order = DealerOrder::find($dispatch->dealer_order_id);
        $dispatch->delete();

        if ($order) {
            $fulfilled = $order->fulfilled_weight;
            if ($fulfilled >= $order->total_ordered_weight) {
                $order->status = 'fulfilled';
            } elseif ($fulfilled > 0) {
                $order->status = 'partially_fulfilled';
            } else {
                $order->status = 'pending';
            }
            $order->save();
        }

        return $this->json($response, ['success' => true]);
    }
}
