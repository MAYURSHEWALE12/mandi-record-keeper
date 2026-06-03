<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';

    protected $fillable = [
        'record_id',
        'amount',
        'date',
        'remaining',
    ];

    protected $casts = [
        'amount' => 'float',
        'remaining' => 'float',
    ];

    public function record()
    {
        return $this->belongsTo(Record::class, 'record_id');
    }
}
