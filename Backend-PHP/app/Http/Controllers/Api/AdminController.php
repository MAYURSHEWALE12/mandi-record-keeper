<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport\Smtp\SmtpTransport;
use Symfony\Component\Mime\Email;

class AdminController extends Controller
{
    // POST /api/admin/login
    public function login(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        $admin = Admin::where('email', $email)->first();
        if (!$admin || !password_verify($password, $admin->password)) {
            return $this->error($response, 'Invalid credentials', 400);
        }

        $jwtConfig = require __DIR__ . '/../../../../config/jwt.php';
        $payload = [
            'sub' => $admin->id,
            'email' => $admin->email,
            'iat' => time(),
            'exp' => time() + $jwtConfig['expiry'],
        ];

        $token = JWT::encode($payload, $jwtConfig['secret'], $jwtConfig['algo']);

        return $this->json($response, ['token' => $token]);
    }

    // POST /api/admin/forgot-password
    public function forgotPassword(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $email = $data['email'] ?? '';

        $admin = Admin::where('email', $email)->first();
        if (!$admin) {
            return $this->error($response, 'Admin not found', 400);
        }

        $resetToken = bin2hex(random_bytes(32));
        $admin->reset_token = $resetToken;
        $admin->reset_token_expiry = date('Y-m-d H:i:s', time() + 15 * 60);
        $admin->save();

        try {
            $transport = new SmtpTransport(
                $_ENV['MAIL_HOST'] ?? 'smtp.gmail.com',
                (int) ($_ENV['MAIL_PORT'] ?? 587),
                $_ENV['MAIL_ENCRYPTION'] === 'tls'
            );
            $transport->setUsername($_ENV['MAIL_USERNAME'] ?? '');
            $transport->setPassword($_ENV['MAIL_PASSWORD'] ?? '');

            $mailer = new Mailer($transport);

            $resetUrl = ($_ENV['APP_URL'] ?? 'http://localhost:3000') . "/reset-password/{$resetToken}";

            $emailMessage = (new Email())
                ->from($_ENV['MAIL_FROM_ADDRESS'] ?? $_ENV['MAIL_USERNAME'])
                ->to($email)
                ->subject('Password Reset - Trambkaraj Traders')
                ->html("<p>Click <a href=\"{$resetUrl}\">here</a> to reset your password. This link expires in 15 minutes.</p>");

            $mailer->send($emailMessage);

            return $this->json($response, ['message' => 'Reset link sent']);
        } catch (\Exception $e) {
            return $this->error($response, 'Error sending email', 500);
        }
    }

    // POST /api/admin/reset-password/{token}
    public function resetPassword(Request $request, Response $response, array $args): Response
    {
        $token = $args['token'];
        $data = $request->getParsedBody();
        $password = $data['password'] ?? '';

        $admin = Admin::where('reset_token', $token)
            ->where('reset_token_expiry', '>=', date('Y-m-d H:i:s'))
            ->first();

        if (!$admin) {
            return $this->error($response, 'Token is invalid or expired', 400);
        }

        $admin->password = password_hash($password, PASSWORD_BCRYPT);
        $admin->reset_token = null;
        $admin->reset_token_expiry = null;
        $admin->save();

        return $this->json($response, ['message' => 'Password reset successfully']);
    }
}
