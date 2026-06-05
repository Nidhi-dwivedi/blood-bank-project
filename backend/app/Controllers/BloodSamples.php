<?php

namespace App\Controllers;

use App\Models\BloodSampleModel;
use App\Models\UserModel;
use App\Services\AuthService;

class BloodSamples extends BaseController
{
    public function index()
    {
        $samples = (new BloodSampleModel())
            ->select('blood_samples.id, blood_samples.blood_group, blood_samples.quantity, blood_samples.hospital_id, users.name AS hospital_name')
            ->join('users', 'users.id = blood_samples.hospital_id')
            ->where('blood_samples.quantity >', 0)
            ->orderBy('blood_samples.created_at', 'DESC')
            ->findAll();

        return $this->response->setJSON([
            'status' => true,
            'samples' => $samples,
        ]);
    }

    public function create()
    {
        $user = AuthService::currentUser($this->request);

        if (! $user) {
            return $this->fail('Please login first', 401);
        }

        if ($user['role'] !== 'hospital') {
            return $this->fail('Only hospitals can add blood samples', 403);
        }

        $json = $this->request->getJSON(true) ?? [];
        $bloodGroup = $json['blood_group'] ?? '';
        $quantity = (int) ($json['quantity'] ?? 0);

        if (! in_array($bloodGroup, UserModel::BLOOD_GROUPS, true)) {
            return $this->fail('Please select a valid blood group');
        }

        if ($quantity <= 0) {
            return $this->fail('Quantity must be greater than zero');
        }

        (new BloodSampleModel())->insert([
            'hospital_id' => $user['id'],
            'blood_group' => $bloodGroup,
            'quantity' => $quantity,
        ]);

        return $this->response->setStatusCode(201)->setJSON([
            'status' => true,
            'message' => 'Blood sample added successfully',
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
