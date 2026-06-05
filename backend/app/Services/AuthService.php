<?php

namespace App\Services;

use App\Models\UserModel;
use CodeIgniter\HTTP\IncomingRequest;

class AuthService
{
    public static function makeToken(array $user): string
    {
        return base64_encode(json_encode([
            'id' => (int) $user['id'],
            'role' => $user['role'],
            'email' => $user['email'],
        ]));
    }

    public static function currentUser(IncomingRequest $request): ?array
    {
        $header = $request->getHeaderLine('Authorization');

        if (! str_starts_with($header, 'Bearer ')) {
            return null;
        }

        $payload = json_decode(base64_decode(substr($header, 7)), true);

        if (! is_array($payload) || empty($payload['id'])) {
            return null;
        }

        return (new UserModel())->find((int) $payload['id']);
    }
}
