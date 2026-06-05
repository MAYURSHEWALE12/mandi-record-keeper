<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';

    protected $fillable = [
        'record_id',
        'dealer_order_id',
        'amount',
        'date',
        'remaining',
        'mode',
        'ref_no',
        'note',
    ];

    protected $casts = [
        'amount' => 'float',
        'remaining' => 'float',
    ];

    public function record()
    {
        return $this->belongsTo(Record::class, 'record_id');
    }

    public function dealerOrder()
    {
        return $this->belongsTo(DealerOrder::class, 'dealer_order_id');
    }
}
