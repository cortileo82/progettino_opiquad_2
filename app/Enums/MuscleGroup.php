<?php

namespace App\Enums;

enum MuscleGroup: string
{
    case UPPER_CHEST = 'Alti Pettorali';
    case LOWER_CHEST = 'Pettorali';
    case UPPER_BACK = 'Schiena Alta';
    case LATS = 'Laterali';
    case LOWER_BACK = 'Lombari'
    case QUADS = 'Quadricipiti';
    case HAMSTRINGS = 'Bicipiti Femorali';
    case DELT_ANT = 'Deltoidi Anteriori';
    case DELT_LAT = 'Deltoidi Laterali';
    case DELT_POST = 'Deltoidi Posteriori';
    case BICEPS = 'Bicipiti';
    case TRICEPS = 'Tricipiti';
    case ABS = 'Addome';
    case CARDIO = 'Cardio';
    case NECK = 'Collo';

    // Funzione per passare questi dati a React
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}