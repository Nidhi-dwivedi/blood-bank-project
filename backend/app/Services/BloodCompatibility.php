<?php

namespace App\Services;

class BloodCompatibility
{
    private const RECEIVER_TO_DONORS = [
        'A+' => ['A+', 'A-', 'O+', 'O-'],
        'A-' => ['A-', 'O-'],
        'B+' => ['B+', 'B-', 'O+', 'O-'],
        'B-' => ['B-', 'O-'],
        'AB+' => ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        'AB-' => ['A-', 'B-', 'AB-', 'O-'],
        'O+' => ['O+', 'O-'],
        'O-' => ['O-'],
    ];

    public static function canReceive(string $receiverBloodGroup, string $sampleBloodGroup): bool
    {
        return in_array(
            $sampleBloodGroup,
            self::RECEIVER_TO_DONORS[$receiverBloodGroup] ?? [],
            true
        );
    }
}
