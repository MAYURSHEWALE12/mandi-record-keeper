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
        'comp_weight',
        'comp_rate',
        'comp_damage_cut',
        'comp_moisture_cut',
        'comp_other_cut',
        'passed_amt',
        'loss_amt',
        'comp_note',
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
        'comp_weight' => 'float',
        'comp_rate' => 'float',
        'comp_damage_cut' => 'float',
        'comp_moisture_cut' => 'float',
        'comp_other_cut' => 'float',
        'passed_amt' => 'float',
        'loss_amt' => 'float',
    ];

    public function order()
    {
        return $this->belongsTo(DealerOrder::class, 'dealer_order_id');
    }
}
