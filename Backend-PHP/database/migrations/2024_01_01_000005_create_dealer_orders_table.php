<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

return function () {
    if (!Capsule::schema()->hasTable('dealer_orders')) {
        Capsule::schema()->create('dealer_orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('po_no', 255)->nullable();
            $table->string('dealer_name', 255);
            $table->string('place', 255)->nullable();
            $table->string('village', 255)->nullable();
            $table->decimal('total_ordered_weight', 10, 2);
            $table->string('status', 50)->default('pending'); // pending, partially_fulfilled, fulfilled
            $table->timestamps();

            $table->index('dealer_name');
            $table->index('status');
        });
    }
};
