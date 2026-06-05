<?php

namespace App\Controllers;

use App\Models\BloodRequestModel;
use App\Models\BloodSampleModel;
use App\Services\AuthService;
use App\Services\BloodCompatibility;

class BloodRequests extends BaseController
{
    public function create(int $sampleId)
    {
        $user = AuthService::currentUser($this->request);

        if (! $user) {
            return $this->fail('Please login as a receiver to request blood', 401);
        }

        if ($user['role'] !== 'receiver') {
            return $this->fail('Hospitals cannot request blood samples', 403);
        }

        $sample = (new BloodSampleModel())->find($sampleId);

        if (! $sample || (int) $sample['quantity'] <= 0) {
            return $this->fail('Blood sample is not available', 404);
        }

        if (! BloodCompatibility::canReceive($user['blood_group'], $sample['blood_group'])) {
            return $this->fail('You are not eligible for this blood group', 403);
        }

        $requests = new BloodRequestModel();
        $existing = $requests
            ->where('blood_sample_id', $sampleId)
            ->where('receiver_id', $user['id'])
            ->first();

        if ($existing) {
            return $this->fail('You have already requested this blood sample from this hospital', 409);
        }

        $requests->insert([
            'blood_sample_id' => $sampleId,
            'receiver_id' => $user['id'],
            'hospital_id' => $sample['hospital_id'],
            'status' => 'pending',
        ]);

        return $this->response->setStatusCode(201)->setJSON([
            'status' => true,
            'message' => 'Blood request sent successfully',
        ]);
    }

    public function hospitalRequests()
    {
        $user = AuthService::currentUser($this->request);

        if (! $user) {
            return $this->fail('Please login first', 401);
        }

        if ($user['role'] !== 'hospital') {
            return $this->fail('Only hospitals can view blood requests', 403);
        }

        $requests = (new BloodRequestModel())
            ->select('blood_requests.id, blood_requests.status, blood_requests.created_at, blood_samples.blood_group, blood_samples.quantity, users.name AS receiver_name, users.email AS receiver_email, users.blood_group AS receiver_blood_group')
            ->join('blood_samples', 'blood_samples.id = blood_requests.blood_sample_id')
            ->join('users', 'users.id = blood_requests.receiver_id')
            ->where('blood_requests.hospital_id', $user['id'])
            ->orderBy('blood_requests.created_at', 'DESC')
            ->findAll();

        return $this->response->setJSON([
            'status' => true,
            'requests' => $requests,
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
