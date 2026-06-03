<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;
use Slim\Factory\AppFactory;
use Slim\Psr7\Response;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$capsule = new Capsule;
$capsule->addConnection(require __DIR__ . '/../config/database.php');
$capsule->setAsGlobal();
$capsule->bootEloquent();

$app = AppFactory::create();

$app->addBodyParsingMiddleware();

// CORS Middleware
$app->add(function ($request, $handler) {
    $corsConfig = require __DIR__ . '/../config/cors.php';
    $origin = $request->getHeaderLine('Origin');
    $allowedOrigins = $corsConfig['allowed_origins'];

    if ($request->getMethod() === 'OPTIONS') {
        $response = new \Slim\Psr7\Response();
        $response = $response
            ->withHeader('Access-Control-Allow-Origin', in_array($origin, $allowedOrigins) ? $origin : ($allowedOrigins[0] ?? '*'))
            ->withHeader('Access-Control-Allow-Methods', implode(', ', $corsConfig['allowed_methods']))
            ->withHeader('Access-Control-Allow-Headers', implode(', ', $corsConfig['allowed_headers']))
            ->withHeader('Access-Control-Max-Age', (string) $corsConfig['max_age']);
        return $response->withStatus(204);
    }

    $response = $handler->handle($request);
    $response = $response
        ->withHeader('Access-Control-Allow-Origin', in_array($origin, $allowedOrigins) ? $origin : ($allowedOrigins[0] ?? '*'))
        ->withHeader('Access-Control-Allow-Methods', implode(', ', $corsConfig['allowed_methods']))
        ->withHeader('Access-Control-Allow-Headers', implode(', ', $corsConfig['allowed_headers']));

    return $response;
});

$app->addErrorMiddleware(
    filter_var($_ENV['APP_DEBUG'] ?? true, FILTER_VALIDATE_BOOLEAN),
    true,
    true
);

require_once __DIR__ . '/../routes/api.php';

return $app;
