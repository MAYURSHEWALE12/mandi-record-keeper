<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DealerDispatch extends Model
{
    protected $table = 'dealer_dispatches';

    protected $fillable = [
        'dealer_order_id',
        'bill_no',
        'date',
        'delivery_place',
        'broker_name',
        'transport_agent',
        'truck_no',
        'owner_name',
        'driver_name',
        'driver_license',
        'driver_village',
        'driver_mobile',
        'crop_type',
        'bags_count',
        'weight',
        'rate',
        'amount',
        'moisture',
        'freight_rate',
        'total_freight',
        'paid_freight',
        'due_freight',
        'note',
    ];

    protected $casts = [
        'bags_count' => 'integer',
        'weight' => 'float',
        'rate' => 'float',
        'amount' => 'float',
        'moisture' => 'float',
        'freight_rate' => 'float',
        'total_freight' => 'float',
        'paid_freight' => 'float',
        'due_freight' => 'float',
    ];

    public function order()
    {
        return $this->belongsTo(DealerOrder::class, 'dealer_order_id');
    }
}
