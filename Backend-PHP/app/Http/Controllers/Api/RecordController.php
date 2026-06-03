<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Counter;
use App\Models\Payment;
use App\Models\Record;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class RecordController extends Controller
{
    // GET /api/records
    public function index(Request $request, Response $response): Response
    {
        $records = Record::with('payments')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($record) {
                return [
                    '_id' => $record->id,
                    'billNo' => $record->bill_no,
                    'date' => $record->date,
                    'farmerName' => $record->farmer_name,
                    'mobile' => $record->mobile,
                    'crop' => $record->crop,
                    'quantity' => $record->quantity,
                    'rate' => $record->rate,
                    'totalAmount' => $record->total_amount,
                    'paidAmount' => $record->paid_amount,
                    'payments' => $record->payments->map(function ($p) {
                        return [
                            '_id' => $p->id,
                            'amount' => $p->amount,
                            'date' => $p->date instanceof \Carbon\Carbon ? $p->date->toDateString() : $p->date,
                            'remaining' => $p->remaining,
                        ];
                    }),
                    'createdAt' => $record->created_at,
                    'updatedAt' => $record->updated_at,
                ];
            });

        return $this->json($response, $records);
    }

    // POST /api/add-record
    public function store(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        $billNo = Counter::getNextBillNo();

        $record = Record::create([
            'bill_no' => $billNo,
            'date' => $data['date'] ?? date('Y-m-d'),
            'farmer_name' => $data['farmerName'] ?? '',
            'mobile' => $data['mobile'] ?? '',
            'crop' => $data['crop'] ?? '',
            'quantity' => $data['quantity'] ?? 0,
            'rate' => $data['rate'] ?? 0,
            'total_amount' => $data['totalAmount'] ?? 0,
            'paid_amount' => $data['paidAmount'] ?? 0,
        ]);

        if (($data['paidAmount'] ?? 0) > 0) {
            $payment = new Payment([
                'amount' => $data['paidAmount'],
                'date' => $data['date'] ?? date('Y-m-d'),
                'remaining' => ($data['totalAmount'] ?? 0) - ($data['paidAmount'] ?? 0),
            ]);
            $record->payments()->save($payment);
        }

        $record->load('payments');

        return $this->json($response, [
            '_id' => $record->id,
            'billNo' => $record->bill_no,
            'date' => $record->date,
            'farmerName' => $record->farmer_name,
            'mobile' => $record->mobile,
            'crop' => $record->crop,
            'quantity' => $record->quantity,
            'rate' => $record->rate,
            'totalAmount' => $record->total_amount,
            'paidAmount' => $record->paid_amount,
            'payments' => $record->payments->map(function ($p) {
                return [
                    '_id' => $p->id,
                    'amount' => $p->amount,
                    'date' => $p->date instanceof \Carbon\Carbon ? $p->date->toDateString() : $p->date,
                    'remaining' => $p->remaining,
                ];
            }),
        ], 201);
    }

    // PUT /api/update-record/{id}
    public function update(Request $request, Response $response, array $args): Response
    {
        $id = $args['id'];
        $data = $request->getParsedBody();

        $record = Record::find($id);
        if (!$record) {
            return $this->error($response, 'Record not found', 404);
        }

        if (isset($data['date'])) {
            $record->date = $data['date'];
        }
        if (isset($data['farmerName'])) {
            $record->farmer_name = $data['farmerName'];
        }
        if (isset($data['mobile'])) {
            $record->mobile = $data['mobile'];
        }
        if (isset($data['crop'])) {
            $record->crop = $data['crop'];
        }
        if (isset($data['quantity'])) {
            $record->quantity = (float) $data['quantity'];
        }
        if (isset($data['rate'])) {
            $record->rate = (float) $data['rate'];
        }
        if (isset($data['totalAmount'])) {
            $record->total_amount = (float) $data['totalAmount'];
        }

        if (isset($data['remainingPayment']) && (float) $data['remainingPayment'] > 0) {
            $addedPayment = (float) $data['remainingPayment'];
            $record->paid_amount += $addedPayment;
            $balanceAfterThisPayment = $record->total_amount - $record->paid_amount;
            $today = date('Y-m-d');

            $payment = new Payment([
                'amount' => $addedPayment,
                'date' => $today,
                'remaining' => $balanceAfterThisPayment,
            ]);
            $record->payments()->save($payment);
        }

        $record->save();
        $record->load('payments');

        return $this->json($response, [
            '_id' => $record->id,
            'billNo' => $record->bill_no,
            'date' => $record->date,
            'farmerName' => $record->farmer_name,
            'mobile' => $record->mobile,
            'crop' => $record->crop,
            'quantity' => $record->quantity,
            'rate' => $record->rate,
            'totalAmount' => $record->total_amount,
            'paidAmount' => $record->paid_amount,
            'payments' => $record->payments->map(function ($p) {
                return [
                    '_id' => $p->id,
                    'amount' => $p->amount,
                    'date' => $p->date instanceof \Carbon\Carbon ? $p->date->toDateString() : $p->date,
                    'remaining' => $p->remaining,
                ];
            }),
        ]);
    }
}
