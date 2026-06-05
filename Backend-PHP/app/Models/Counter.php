<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Counter extends Model
{
    protected $table = 'counters';

    protected $fillable = [
        'name',
        'seq',
    ];

    public static function getNextBillNo(): int
    {
        return DB::transaction(function () {
            $counter = self::where('name', 'billNo')->lockForUpdate()->first();

            if (!$counter) {
                $counter = self::create(['name' => 'billNo', 'seq' => 1]);
                return 1;
            }

            $counter->increment('seq');
            return $counter->fresh()->seq;
        });
    }
}
