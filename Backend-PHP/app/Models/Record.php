<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    protected $table = 'records';

    protected $fillable = [
        'bill_no',
        'date',
        'farmer_name',
        'mobile',
        'crop',
        'quantity',
        'rate',
        'total_amount',
        'paid_amount',
    ];

    protected $casts = [
        'quantity' => 'float',
        'rate' => 'float',
        'total_amount' => 'float',
        'paid_amount' => 'float',
    ];

    public function payments()
    {
        return $this->hasMany(Payment::class, 'record_id');
    }

    public function getDueAmountAttribute(): float
    {
        return round($this->total_amount - $this->paid_amount, 2);
    }

    public function scopeDue($query)
    {
        return $query->whereColumn('paid_amount', '<', 'total_amount');
    }

    public function scopePaid($query)
    {
        return $query->whereColumn('paid_amount', '=', 'total_amount');
    }

    public function scopeByFarmer($query, $name)
    {
        return $query->where('farmer_name', 'LIKE', "%{$name}%");
    }

    public function scopeByDateRange($query, $from, $to)
    {
        if ($from) {
            $query->where('date', '>=', $from);
        }
        if ($to) {
            $query->where('date', '<=', $to);
        }
        return $query;
    }
}
