<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Counter extends Model
{
    protected $table = 'counters';

    protected $fillable = [
        'name',
        'seq',
    ];

    public static function getNextBillNo(): int
    {
        $counter = self::where('name', 'billNo')->first();

        if (!$counter) {
            $counter = self::create(['name' => 'billNo', 'seq' => 1]);
            return 1;
        }

        $counter->increment('seq');
        return $counter->seq;
    }
}
