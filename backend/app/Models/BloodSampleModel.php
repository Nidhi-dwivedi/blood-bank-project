<?php

namespace App\Models;

use CodeIgniter\Model;

class BloodSampleModel extends Model
{
    protected $table = 'blood_samples';

    protected $primaryKey = 'id';

    protected $returnType = 'array';

    protected $useTimestamps = true;

    protected $allowedFields = [
        'hospital_id',
        'blood_group',
        'quantity',
    ];
}
