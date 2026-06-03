<?php

namespace Database\Seeders;

use App\Models\Admin;

class AdminSeeder
{
    public function run(): void
    {
        $admin = Admin::where('email', 'admin@example.com')->first();

        if (!$admin) {
            Admin::create([
                'email' => 'admin@example.com',
                'password' => password_hash('admin123', PASSWORD_BCRYPT),
            ]);
            echo "  ✓ Admin user seeded: admin@example.com / admin123\n";
        } else {
            $admin->password = password_hash('admin123', PASSWORD_BCRYPT);
            $admin->save();
            echo "  ✓ Admin user updated\n";
        }
    }
}
