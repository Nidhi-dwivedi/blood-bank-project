<?php

namespace App\Models;

use CodeIgniter\Model;

class BloodRequestModel extends Model
{
    protected $table = 'blood_requests';

    protected $primaryKey = 'id';

    protected $returnType = 'array';

    protected $useTimestamps = true;

    protected $allowedFields = [
        'blood_sample_id',
        'receiver_id',
        'hospital_id',
        'status',
    ];
}
