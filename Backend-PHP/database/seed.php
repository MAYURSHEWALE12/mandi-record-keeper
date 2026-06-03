<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$capsule = new \Illuminate\Database\Capsule\Manager;
$capsule->addConnection(require __DIR__ . '/../config/database.php');
$capsule->setAsGlobal();
$capsule->bootEloquent();

echo "Running seeders...\n\n";

require_once __DIR__ . '/seeders/AdminSeeder.php';
$seeder = new \Database\Seeders\AdminSeeder();
$seeder->run();

echo "\nSeeding completed.\n";
