<?php

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

return function () {
    // Add missing columns to dealer_orders
    if (Capsule::schema()->hasTable('dealer_orders')) {
        if (!Capsule::schema()->hasColumn('dealer_orders', 'order_date')) {
            Capsule::schema()->table('dealer_orders', function (Blueprint $table) {
                $table->date('order_date')->nullable()->after('total_ordered_weight');
            });
        }
        if (!Capsule::schema()->hasColumn('dealer_orders', 'expected_delivery')) {
            Capsule::schema()->table('dealer_orders', function (Blueprint $table) {
                $table->date('expected_delivery')->nullable()->after('order_date');
            });
        }
        if (!Capsule::schema()->hasColumn('dealer_orders', 'dealer_phone')) {
            Capsule::schema()->table('dealer_orders', function (Blueprint $table) {
                $table->string('dealer_phone', 20)->nullable()->after('dealer_name');
            });
        }
        if (!Capsule::schema()->hasColumn('dealer_orders', 'note')) {
            Capsule::schema()->table('dealer_orders', function (Blueprint $table) {
                $table->text('note')->nullable()->after('status');
            });
        }
    }

    // Add cutting data columns to dealer_dispatches
    if (Capsule::schema()->hasTable('dealer_dispatches')) {
        if (!Capsule::schema()->hasColumn('dealer_dispatches', 'comp_weight')) {
            Capsule::schema()->table('dealer_dispatches', function (Blueprint $table) {
                $table->decimal('comp_weight', 10, 2)->nullable()->after('note');
                $table->decimal('comp_rate', 10, 2)->nullable()->after('comp_weight');
                $table->decimal('comp_damage_cut', 10, 2)->nullable()->after('comp_rate');
                $table->decimal('comp_moisture_cut', 10, 2)->nullable()->after('comp_damage_cut');
                $table->decimal('comp_other_cut', 10, 2)->nullable()->after('comp_moisture_cut');
                $table->decimal('passed_amt', 12, 2)->nullable()->after('comp_other_cut');
                $table->decimal('loss_amt', 12, 2)->nullable()->after('passed_amt');
                $table->text('comp_note')->nullable()->after('loss_amt');
            });
        }
    }

    // Add dealer_order_id and new columns to payments
    if (Capsule::schema()->hasTable('payments')) {
        if (!Capsule::schema()->hasColumn('payments', 'dealer_order_id')) {
            Capsule::schema()->table('payments', function (Blueprint $table) {
                $table->unsignedBigInteger('dealer_order_id')->nullable()->after('record_id');
                $table->foreign('dealer_order_id')
                    ->references('id')
                    ->on('dealer_orders')
                    ->onDelete('cascade');
                $table->index('dealer_order_id');
            });
        }
        if (!Capsule::schema()->hasColumn('payments', 'mode')) {
            Capsule::schema()->table('payments', function (Blueprint $table) {
                $table->string('mode', 50)->nullable()->after('remaining');
            });
        }
        if (!Capsule::schema()->hasColumn('payments', 'ref_no')) {
            Capsule::schema()->table('payments', function (Blueprint $table) {
                $table->string('ref_no', 255)->nullable()->after('mode');
            });
        }
        if (!Capsule::schema()->hasColumn('payments', 'note')) {
            Capsule::schema()->table('payments', function (Blueprint $table) {
                $table->text('note')->nullable()->after('ref_no');
            });
        }
    }
};
