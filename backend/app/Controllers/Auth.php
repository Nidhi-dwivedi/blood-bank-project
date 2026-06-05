<?php

namespace App\Controllers;

use App\Models\UserModel;
use App\Services\AuthService;

class Auth extends BaseController
{
    private UserModel $users;

    public function __construct()
    {
        $this->users = new UserModel();
    }

    public function registerHospital()
    {
        return $this->register('hospital');
    }

    public function registerReceiver()
    {
        return $this->register('receiver');
    }

    public function login()
    {
        $json = $this->request->getJSON(true) ?? [];
        $email = strtolower(trim($json['email'] ?? ''));
        $password = $json['password'] ?? '';

        $user = $this->users->where('email', $email)->first();

        if (! $user || ! password_verify($password, $user['password'])) {
            return $this->fail('Invalid email or password', 401);
        }

        unset($user['password']);

        return $this->response->setJSON([
            'status' => true,
            'message' => 'Login successful',
            'token' => AuthService::makeToken($user),
            'user' => $user,
        ]);
    }

    private function register(string $role)
    {
        $json = $this->request->getJSON(true) ?? [];
        $name = trim($json['name'] ?? '');
        $email = strtolower(trim($json['email'] ?? ''));
        $password = $json['password'] ?? '';
        $bloodGroup = $json['blood_group'] ?? null;

        if ($name === '' || $email === '' || $password === '') {
            return $this->fail('Name, email and password are required');
        }

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->fail('Please enter a valid email address');
        }

        if ($role === 'receiver' && ! in_array($bloodGroup, UserModel::BLOOD_GROUPS, true)) {
            return $this->fail('Please select a valid blood group');
        }

        if ($this->users->where('email', $email)->first()) {
            return $this->fail('This email is already registered');
        }

        $userId = $this->users->insert([
            'name' => $name,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'role' => $role,
            'blood_group' => $role === 'receiver' ? $bloodGroup : null,
        ]);

        if (! $userId) {
            return $this->fail('Unable to register user');
        }

        return $this->response->setStatusCode(201)->setJSON([
            'status' => true,
            'message' => ucfirst($role) . ' registered successfully',
        ]);
    }

    private function fail(string $message, int $status = 400)
    {
        return $this->response->setStatusCode($status)->setJSON([
            'status' => false,
            'message' => $message,
        ]);
    }
}
