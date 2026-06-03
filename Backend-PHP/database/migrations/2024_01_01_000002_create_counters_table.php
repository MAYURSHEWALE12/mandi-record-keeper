<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

return function () {
    if (!Capsule::schema()->hasTable('counters')) {
        Capsule::schema()->create('counters', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 50)->unique();
            $table->bigInteger('seq')->default(0);
            $table->timestamps();
        });

        Capsule::table('counters')->insert([
            'name' => 'billNo',
            'seq' => 0,
        ]);
    }
};
