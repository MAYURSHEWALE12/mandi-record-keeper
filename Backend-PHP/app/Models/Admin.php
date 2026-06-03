<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'admins';

    protected $fillable = [
        'email',
        'password',
        'reset_token',
        'reset_token_expiry',
    ];

    protected $hidden = [
        'password',
        'reset_token',
    ];

    protected $casts = [
        'reset_token_expiry' => 'datetime',
    ];
}
