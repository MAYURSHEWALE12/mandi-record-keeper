<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

return function () {
    if (!Capsule::schema()->hasTable('dealer_dispatches')) {
        Capsule::schema()->create('dealer_dispatches', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('dealer_order_id');
            $table->bigInteger('bill_no')->unique();
            $table->date('date');
            $table->string('delivery_place', 255)->nullable();
            $table->string('broker_name', 255)->nullable();
            $table->string('transport_agent', 255)->nullable();
            $table->string('truck_no', 50);
            $table->string('owner_name', 255)->nullable();
            $table->string('driver_name', 255)->nullable();
            $table->string('driver_license', 100)->nullable();
            $table->string('driver_village', 255)->nullable();
            $table->string('driver_mobile', 20)->nullable();
            $table->string('crop_type', 100);
            $table->integer('bags_count')->nullable();
            $table->decimal('weight', 10, 2);
            $table->decimal('rate', 10, 2);
            $table->decimal('amount', 12, 2);
            $table->decimal('moisture', 5, 2)->nullable();
            $table->decimal('freight_rate', 10, 2)->nullable();
            $table->decimal('total_freight', 12, 2)->nullable();
            $table->decimal('paid_freight', 12, 2)->nullable();
            $table->decimal('due_freight', 12, 2)->nullable();
            $table->text('note')->nullable();
            $table->timestamps();

            $table->foreign('dealer_order_id')
                ->references('id')
                ->on('dealer_orders')
                ->onDelete('cascade');

            $table->index('dealer_order_id');
            $table->index('bill_no');
            $table->index('date');
        });
    }
};
