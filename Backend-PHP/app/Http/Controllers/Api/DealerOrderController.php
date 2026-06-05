<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DealerOrder;
use App\Models\DealerDispatch;
use App\Models\Payment;
use App\Models\Counter;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class DealerOrderController extends Controller
{
    // GET /api/dealer-orders
    public function index(Request $request, Response $response): Response
    {
        $orders = DealerOrder::with('dispatches', 'payments')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'poNo' => $order->po_no,
                    'dealerName' => $order->dealer_name,
                    'dealerPhone' => $order->dealer_phone,
                    'place' => $order->place,
                    'village' => $order->village,
                    'totalOrderedWeight' => $order->total_ordered_weight,
                    'fulfilledWeight' => $order->fulfilled_weight,
                    'remainingWeight' => $order->remaining_weight,
                    'orderDate' => $order->order_date ? $order->order_date->format('Y-m-d') : null,
                    'expectedDelivery' => $order->expected_delivery ? $order->expected_delivery->format('Y-m-d') : null,
                    'status' => $order->status,
                    'note' => $order->note,
                    'payments' => $order->payments,
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
            'dealer_phone' => $data['dealerPhone'] ?? '',
            'place' => $data['place'] ?? '',
            'village' => $data['village'] ?? '',
            'total_ordered_weight' => $data['totalOrderedWeight'] ?? 0,
            'order_date' => $data['orderDate'] ?? date('Y-m-d'),
            'expected_delivery' => $data['expectedDelivery'] ?? null,
            'status' => $data['status'] ?? 'pending',
            'note' => $data['note'] ?? '',
        ]);

        return $this->json($response, [
            'id' => $order->id,
            'poNo' => $order->po_no,
            'dealerName' => $order->dealer_name,
            'dealerPhone' => $order->dealer_phone,
            'place' => $order->place,
            'village' => $order->village,
            'totalOrderedWeight' => $order->total_ordered_weight,
            'fulfilledWeight' => 0,
            'remainingWeight' => $order->total_ordered_weight,
            'orderDate' => $order->order_date ? $order->order_date->format('Y-m-d') : null,
            'expectedDelivery' => $order->expected_delivery ? $order->expected_delivery->format('Y-m-d') : null,
            'status' => $order->status,
            'note' => $order->note,
        ], 201);
    }

    // GET /api/dealer-orders/{id}
    public function show(Request $request, Response $response, array $args): Response
    {
        $id = $args['id'];
        $order = DealerOrder::with('dispatches', 'payments')->find($id);

        if (!$order) {
            return $this->error($response, 'Dealer order not found', 404);
        }

        return $this->json($response, [
            'id' => $order->id,
            'poNo' => $order->po_no,
            'dealerName' => $order->dealer_name,
            'dealerPhone' => $order->dealer_phone,
            'place' => $order->place,
            'village' => $order->village,
            'totalOrderedWeight' => $order->total_ordered_weight,
            'fulfilledWeight' => $order->fulfilled_weight,
            'remainingWeight' => $order->remaining_weight,
            'orderDate' => $order->order_date ? $order->order_date->format('Y-m-d') : null,
            'expectedDelivery' => $order->expected_delivery ? $order->expected_delivery->format('Y-m-d') : null,
            'status' => $order->status,
            'note' => $order->note,
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
                    'compWeight' => $d->comp_weight,
                    'compRate' => $d->comp_rate,
                    'compDamageCut' => $d->comp_damage_cut,
                    'compMoistureCut' => $d->comp_moisture_cut,
                    'compOtherCut' => $d->comp_other_cut,
                    'passedAmt' => $d->passed_amt,
                    'lossAmt' => $d->loss_amt,
                    'compNote' => $d->comp_note,
                ];
            }),
            'payments' => $order->payments->map(function ($p) {
                return [
                    'id' => $p->id,
                    'amount' => $p->amount,
                    'date' => $p->date,
                    'mode' => $p->mode,
                    'refNo' => $p->ref_no,
                    'note' => $p->note,
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
        $inputWeight = (float) ($data['weight'] ?? 0);
        $totalInward = \App\Models\Record::where('crop', 'मका')->sum('quantity') / 10.0;
        $totalAlreadyDispatched = \App\Models\DealerDispatch::sum('weight');
        $physicalStock = max(0.0, $totalInward - $totalAlreadyDispatched);
        $remaining = $order->remaining_weight;
        $maxAllowed = min($remaining, $physicalStock);

        if ($inputWeight > $maxAllowed + 0.0001) {
            return $this->error($response, "Cannot dispatch more than the allowed limit (remaining order weight or available stock) of " . number_format($maxAllowed, 2) . " Tons", 400);
        }

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

    // DELETE /api/dealer-orders/{id}
    public function destroy(Request $request, Response $response, array $args): Response
    {
        $id = $args['id'];
        $order = DealerOrder::find($id);

        if (!$order) {
            return $this->error($response, 'Dealer order not found', 404);
        }

        $order->delete();
        return $this->json($response, ['success' => true]);
    }

    // PUT /api/dealer-orders/{orderId}/dispatch/{dispatchId}
    public function updateDispatch(Request $request, Response $response, array $args): Response
    {
        $orderId = $args['orderId'];
        $dispatchId = $args['dispatchId'];

        $order = DealerOrder::find($orderId);
        if (!$order) {
            return $this->error($response, 'Dealer order not found', 404);
        }

        $dispatch = DealerDispatch::where('id', $dispatchId)
            ->where('dealer_order_id', $orderId)
            ->first();

        if (!$dispatch) {
            return $this->error($response, 'Dispatch not found', 404);
        }

        $data = $request->getParsedBody();

        $dispatch->update([
            'comp_weight' => isset($data['compWeight']) ? (float) $data['compWeight'] : $dispatch->comp_weight,
            'comp_rate' => isset($data['compRate']) ? (float) $data['compRate'] : $dispatch->comp_rate,
            'comp_damage_cut' => isset($data['compDamageCut']) ? (float) $data['compDamageCut'] : $dispatch->comp_damage_cut,
            'comp_moisture_cut' => isset($data['compMoistureCut']) ? (float) $data['compMoistureCut'] : $dispatch->comp_moisture_cut,
            'comp_other_cut' => isset($data['compOtherCut']) ? (float) $data['compOtherCut'] : $dispatch->comp_other_cut,
            'passed_amt' => isset($data['passedAmt']) ? (float) $data['passedAmt'] : $dispatch->passed_amt,
            'loss_amt' => isset($data['lossAmt']) ? (float) $data['lossAmt'] : $dispatch->loss_amt,
            'comp_note' => $data['compNote'] ?? $dispatch->comp_note,
        ]);

        return $this->json($response, [
            'id' => $dispatch->id,
            'compWeight' => $dispatch->comp_weight,
            'compRate' => $dispatch->comp_rate,
            'compDamageCut' => $dispatch->comp_damage_cut,
            'compMoistureCut' => $dispatch->comp_moisture_cut,
            'compOtherCut' => $dispatch->comp_other_cut,
            'passedAmt' => $dispatch->passed_amt,
            'lossAmt' => $dispatch->loss_amt,
            'compNote' => $dispatch->comp_note,
        ]);
    }

    // POST /api/dealer-orders/{id}/payment
    public function storePayment(Request $request, Response $response, array $args): Response
    {
        $id = $args['id'];
        $order = DealerOrder::find($id);

        if (!$order) {
            return $this->error($response, 'Dealer order not found', 404);
        }

        $data = $request->getParsedBody();

        $payment = Payment::create([
            'dealer_order_id' => $order->id,
            'amount' => (float) ($data['amount'] ?? 0),
            'date' => $data['date'] ?? date('Y-m-d'),
            'mode' => $data['mode'] ?? 'Bank Transfer',
            'ref_no' => $data['refNo'] ?? '',
            'note' => $data['note'] ?? '',
        ]);

        return $this->json($response, [
            'id' => $payment->id,
            'amount' => $payment->amount,
            'date' => $payment->date,
            'mode' => $payment->mode,
            'refNo' => $payment->ref_no,
            'note' => $payment->note,
        ], 201);
    }

    // DELETE /api/dealer-orders/{orderId}/payment/{paymentId}
    public function destroyPayment(Request $request, Response $response, array $args): Response
    {
        $orderId = $args['orderId'];
        $paymentId = $args['paymentId'];

        $order = DealerOrder::find($orderId);
        if (!$order) {
            return $this->error($response, 'Dealer order not found', 404);
        }

        $payment = Payment::where('id', $paymentId)
            ->where('dealer_order_id', $orderId)
            ->first();

        if (!$payment) {
            return $this->error($response, 'Payment not found', 404);
        }

        $payment->delete();

        return $this->json($response, ['success' => true]);
    }
}
