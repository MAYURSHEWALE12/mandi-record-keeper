<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

return function () {
    if (!Capsule::schema()->hasTable('records')) {
        Capsule::schema()->create('records', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('bill_no')->unique();
            $table->date('date');
            $table->string('farmer_name', 255);
            $table->string('mobile', 20);
            $table->string('crop', 100);
            $table->decimal('quantity', 10, 2);
            $table->decimal('rate', 10, 2);
            $table->decimal('total_amount', 12, 2);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->timestamps();

            $table->index('bill_no');
            $table->index('farmer_name');
            $table->index('date');
        });
    }
};
