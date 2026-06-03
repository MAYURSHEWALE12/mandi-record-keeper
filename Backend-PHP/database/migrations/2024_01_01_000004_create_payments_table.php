<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

return function () {
    if (!Capsule::schema()->hasTable('payments')) {
        Capsule::schema()->create('payments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('record_id');
            $table->decimal('amount', 12, 2);
            $table->date('date');
            $table->decimal('remaining', 12, 2);
            $table->timestamps();

            $table->foreign('record_id')
                ->references('id')
                ->on('records')
                ->onDelete('cascade');

            $table->index('record_id');
        });
    }
};
