<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

return function () {
    if (!Capsule::schema()->hasTable('admins')) {
        Capsule::schema()->create('admins', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('email', 255)->unique();
            $table->string('password', 255);
            $table->string('reset_token', 64)->nullable();
            $table->dateTime('reset_token_expiry')->nullable();
            $table->timestamps();
        });
    }
};
