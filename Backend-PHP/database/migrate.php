<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$capsule = new \Illuminate\Database\Capsule\Manager;
$capsule->addConnection(require __DIR__ . '/../config/database.php');
$capsule->setAsGlobal();
$capsule->bootEloquent();

echo "Running migrations...\n\n";

$migrations = glob(__DIR__ . '/migrations/*.php');
sort($migrations);

foreach ($migrations as $file) {
    $filename = basename($file);
    $migration = require $file;
    if (is_callable($migration)) {
        $migration();
        echo "  ✓ $filename\n";
    }
}

echo "\nAll migrations completed.\n";
