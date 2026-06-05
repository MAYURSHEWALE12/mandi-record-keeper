<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\RecordController;
use App\Http\Middleware\JwtMiddleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/** @var \Slim\App $app */

// Record routes (protected)
$app->get('/api/records', [RecordController::class, 'index'])->add(JwtMiddleware::class);
$app->post('/api/add-record', [RecordController::class, 'store'])->add(JwtMiddleware::class);
$app->put('/api/update-record/{id}', [RecordController::class, 'update'])->add(JwtMiddleware::class);

// Dealer Orders & Dispatches routes (protected)
$app->get('/api/dealer-orders', [\App\Http\Controllers\Api\DealerOrderController::class, 'index'])->add(JwtMiddleware::class);
$app->post('/api/dealer-orders', [\App\Http\Controllers\Api\DealerOrderController::class, 'store'])->add(JwtMiddleware::class);
$app->get('/api/dealer-orders/{id}', [\App\Http\Controllers\Api\DealerOrderController::class, 'show'])->add(JwtMiddleware::class);
$app->post('/api/dealer-orders/{id}/dispatch', [\App\Http\Controllers\Api\DealerOrderController::class, 'storeDispatch'])->add(JwtMiddleware::class);
$app->delete('/api/dealer-dispatches/{id}', [\App\Http\Controllers\Api\DealerOrderController::class, 'destroyDispatch'])->add(JwtMiddleware::class);
$app->put('/api/dealer-orders/{orderId}/dispatch/{dispatchId}', [\App\Http\Controllers\Api\DealerOrderController::class, 'updateDispatch'])->add(JwtMiddleware::class);
$app->post('/api/dealer-orders/{id}/payment', [\App\Http\Controllers\Api\DealerOrderController::class, 'storePayment'])->add(JwtMiddleware::class);
$app->delete('/api/dealer-orders/{orderId}/payment/{paymentId}', [\App\Http\Controllers\Api\DealerOrderController::class, 'destroyPayment'])->add(JwtMiddleware::class);
$app->delete('/api/dealer-orders/{id}', [\App\Http\Controllers\Api\DealerOrderController::class, 'destroy'])->add(JwtMiddleware::class);

// Registered Dealers/Companies routes (protected)
$app->get('/api/dealers', [\App\Http\Controllers\Api\DealerController::class, 'index'])->add(JwtMiddleware::class);
$app->post('/api/dealers', [\App\Http\Controllers\Api\DealerController::class, 'store'])->add(JwtMiddleware::class);
$app->delete('/api/dealers/{id}', [\App\Http\Controllers\Api\DealerController::class, 'destroy'])->add(JwtMiddleware::class);

// Admin auth routes (no auth middleware)
$app->post('/api/admin/login', [AdminController::class, 'login']);
$app->post('/api/admin/forgot-password', [AdminController::class, 'forgotPassword']);
$app->post('/api/admin/reset-password/{token}', [AdminController::class, 'resetPassword']);

// Health check
$app->get('/api/health', function (Request $request, Response $response) {
    $response->getBody()->write(json_encode([
        'status' => 'ok',
        'app' => 'Trambkaraj Traders API',
        'version' => '1.0.0 (PHP)',
    ]));
    return $response->withHeader('Content-Type', 'application/json');
});

// Market rates proxy (no auth required - public data)
$app->get('/api/market-rates', function (Request $request, Response $response) {
    $apiKey = $_ENV['MARKET_API_KEY'] ?? '579b464db66ec23bdd000001dc6ef7663e8746615667305510709d20';
    $url = "https://api.data.gov.in/resource/9ef27131-652a-4a3a-a3a3-705074e767c7?api-key={$apiKey}&format=json&limit=20";

    try {
        $json = file_get_contents($url);
        $data = json_decode($json, true);
        $records = $data['records'] ?? [];

        $response->getBody()->write(json_encode($records));
        return $response->withHeader('Content-Type', 'application/json');
    } catch (\Exception $e) {
        $response->getBody()->write(json_encode([]));
        return $response->withHeader('Content-Type', 'application/json');
    }
});
