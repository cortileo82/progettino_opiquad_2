<?php

namespace App\Enums;

enum Role: string
{
    case ADMIN = 'admin';
    case PT = 'pt';
    case CLIENT = 'client';

    // Funzione per passare questi dati a React
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}