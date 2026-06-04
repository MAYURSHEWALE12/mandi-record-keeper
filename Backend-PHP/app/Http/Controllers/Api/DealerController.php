<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dealer;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class DealerController extends Controller
{
    // GET /api/dealers
    public function index(Request $request, Response $response): Response
    {
        $dealers = Dealer::orderBy('name', 'asc')->get();
        return $this->json($response, $dealers);
    }

    // POST /api/dealers
    public function store(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $name = trim($data['name'] ?? '');

        if (empty($name)) {
            return $this->error($response, 'Company name is required');
        }

        // Check unique
        $exists = Dealer::where('name', $name)->first();
        if ($exists) {
            return $this->error($response, 'Company name already registered');
        }

        $dealer = Dealer::create([
            'name' => $name,
            'place' => trim($data['place'] ?? ''),
            'village' => trim($data['village'] ?? ''),
        ]);

        return $this->json($response, $dealer, 201);
    }

    // DELETE /api/dealers/{id}
    public function destroy(Request $request, Response $response, array $args): Response
    {
        $id = $args['id'];
        $dealer = Dealer::find($id);

        if (!$dealer) {
            return $this->error($response, 'Company not found', 404);
        }

        $dealer->delete();
        return $this->json($response, ['success' => true]);
    }
}
