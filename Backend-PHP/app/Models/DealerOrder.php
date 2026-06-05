<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DealerOrder extends Model
{
    protected $table = 'dealer_orders';

    protected $fillable = [
        'po_no',
        'dealer_name',
        'dealer_phone',
        'place',
        'village',
        'total_ordered_weight',
        'order_date',
        'expected_delivery',
        'status',
        'note',
    ];

    protected $casts = [
        'total_ordered_weight' => 'float',
        'order_date' => 'date',
        'expected_delivery' => 'date',
    ];

    public function dispatches()
    {
        return $this->hasMany(DealerDispatch::class, 'dealer_order_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'dealer_order_id');
    }

    public function getFulfilledWeightAttribute(): float
    {
        return round($this->dispatches()->sum('weight'), 2);
    }

    public function getRemainingWeightAttribute(): float
    {
        return round(max(0, $this->total_ordered_weight - $this->fulfilled_weight), 2);
    }
}
