<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

return function () {
    if (!Capsule::schema()->hasTable('dealers')) {
        Capsule::schema()->create('dealers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 255)->unique();
            $table->string('place', 255)->nullable();
            $table->string('village', 255)->nullable();
            $table->timestamps();
        });
    }
};
