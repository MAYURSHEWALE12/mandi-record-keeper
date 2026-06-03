<?php

namespace App\Http\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

abstract class Controller
{
    protected function json(Response $response, mixed $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

    protected function error(Response $response, string $message, int $status = 400): Response
    {
        return $this->json($response, ['error' => $message], $status);
    }

    protected function success(Response $response, mixed $data = null, string $message = null): Response
    {
        $payload = $data ?: ['message' => $message ?? 'Success'];
        return $this->json($response, $payload);
    }
}
