<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\RecordController;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/** @var \Slim\App $app */

// Record routes
$app->get('/api/records', [RecordController::class, 'index']);
$app->post('/api/add-record', [RecordController::class, 'store']);
$app->put('/api/update-record/{id}', [RecordController::class, 'update']);

// Dealer Orders & Dispatches routes
$app->get('/api/dealer-orders', [\App\Http\Controllers\Api\DealerOrderController::class, 'index']);
$app->post('/api/dealer-orders', [\App\Http\Controllers\Api\DealerOrderController::class, 'store']);
$app->get('/api/dealer-orders/{id}', [\App\Http\Controllers\Api\DealerOrderController::class, 'show']);
$app->post('/api/dealer-orders/{id}/dispatch', [\App\Http\Controllers\Api\DealerOrderController::class, 'storeDispatch']);
$app->delete('/api/dealer-dispatches/{id}', [\App\Http\Controllers\Api\DealerOrderController::class, 'destroyDispatch']);
$app->delete('/api/dealer-orders/{id}', [\App\Http\Controllers\Api\DealerOrderController::class, 'destroy']);

// Registered Dealers/Companies routes
$app->get('/api/dealers', [\App\Http\Controllers\Api\DealerController::class, 'index']);
$app->post('/api/dealers', [\App\Http\Controllers\Api\DealerController::class, 'store']);
$app->delete('/api/dealers/{id}', [\App\Http\Controllers\Api\DealerController::class, 'destroy']);

// Admin auth routes
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
