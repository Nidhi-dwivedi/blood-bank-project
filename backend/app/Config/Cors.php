<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Cors extends BaseConfig
{
    public array $default = [
        'allowedOrigins' => [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5174',
        ],
        'allowedOriginsPatterns' => [
            'http://localhost:\d+',
            'http://127\.0\.0\.1:\d+',
        ],
        'allowedHeaders' => [
            'Authorization',
            'Content-Type',
            'Accept',
            'Origin',
            'X-Requested-With',
        ],
        'allowedMethods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'supportsCredentials' => false,
        'exposedHeaders' => [],
        'maxAge' => 7200,
    ];
}
