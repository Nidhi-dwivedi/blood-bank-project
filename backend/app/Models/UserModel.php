<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    public const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    protected $table = 'users';

    protected $primaryKey = 'id';

    protected $returnType = 'array';

    protected $useTimestamps = true;

    protected $allowedFields = [
        'name',
        'email',
        'password',
        'role',
        'blood_group'
    ];
}
