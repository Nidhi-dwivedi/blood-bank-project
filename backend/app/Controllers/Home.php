<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        return $this->response->setJSON([
            'status' => true,
            'message' => 'Blood Bank API is running',
        ]);
    }
}
