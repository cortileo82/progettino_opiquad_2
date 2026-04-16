<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
// Importazione corretta dei modelli e dei trait necessari
use App\Models\User;
use App\Models\Exercise;
use App\Models\Plan;
use App\Models\PlanExercise;
use App\Enums\MuscleGroup;

class DatabaseSeeder extends Seeder
{
    /**
     * Esegue il seeder del database.
     */
    public function run(): void
    {
        // 1. CREAZIONE UTENTI
        $defaultPassword = Hash::make('password123');

        $admin = User::create([
            'name' => 'First Admin',
            'email' => 'admin@tempra.com',
            'password' => $defaultPassword,
            'role' => 'admin',
        ]);

        $pt1 = User::create([
            'name' => 'Trainer Marco',
            'email' => 'marco@tempra.com',
            'password' => $defaultPassword,
            'role' => 'pt',
        ]);

        $pt2 = User::create([
            'name' => 'Trainer Giulia',
            'email' => 'giulia@tempra.com',
            'password' => $defaultPassword,
            'role' => 'pt',
        ]);

        $client1 = User::create([
            'name' => 'Cliente Luca',
            'email' => 'luca@tempra.com',
            'password' => $defaultPassword,
            'role' => 'client',
            'trainer_id' => $pt1->id,
        ]);

        $client2 = User::create([
            'name' => 'Cliente Sara',
            'email' => 'sara@tempra.com',
            'password' => $defaultPassword,
            'role' => 'client',
            'trainer_id' => $pt2->id,
        ]);

        // 2. CREAZIONE ESERCIZI BASE
        $exercisesData = [
            ['name' => 'Panca Piana', 'description' => 'Bilanciere al petto.', 'muscle_group' => MuscleGroup::LOWER_CHEST->value],
            ['name' => 'Squat', 'description' => 'Accosciata con bilanciere.', 'muscle_group' => MuscleGroup::QUADS->value],
            ['name' => 'Stacco da Terra', 'description' => 'Sollevamento da terra.', 'muscle_group' => MuscleGroup::LOWER_BACK->value],
            ['name' => 'Trazioni', 'description' => 'Trazioni alla sbarra.', 'muscle_group' => MuscleGroup::UPPER_BACK->value],
            ['name' => 'Shoulder Press', 'description' => 'Spinta sopra la testa.', 'muscle_group' => MuscleGroup::DELT_ANT->value],
            ['name' => 'Curl Bicipiti', 'description' => 'Flessione braccia.', 'muscle_group' => MuscleGroup::BICEPS->value],
            ['name' => 'French Press', 'description' => 'Estensione tricipiti.', 'muscle_group' => MuscleGroup::TRICEPS->value],
            ['name' => 'Leg Extension', 'description' => 'Isolamento quadricipiti.', 'muscle_group' => MuscleGroup::QUADS->value],
            ['name' => 'Leg Curl', 'description' => 'Isolamento femorali.', 'muscle_group' => MuscleGroup::HAMSTRINGS->value],
            ['name' => 'Crunch', 'description' => 'Addominali a terra.', 'muscle_group' => MuscleGroup::ABS->value],
        ];

        $exercises = [];
        foreach ($exercisesData as $ex) {
            $exercises[] = Exercise::create($ex);
        }

        // 3. CREAZIONE SCHEDE (Utilizzando la colonna 'num_weeks')
        $plan1 = Plan::create([
            'user_id' => $client1->id,
            'pt_id' => $pt1->id,
            'name' => 'Scheda Massa A',
            'num_weeks' => '4' // Modificato da duration a num_weeks
        ]);

        $plan2 = Plan::create([
            'user_id' => $client2->id,
            'pt_id' => $pt2->id,
            'name' => 'Definizione Invernale',
            'num_weeks' => '8' // Modificato da duration a num_weeks
        ]);

        // 4. ASSEGNAZIONE ESERCIZI ALLE SCHEDE
        PlanExercise::create([
            'plan_id' => $plan1->id,
            'exercise_id' => $exercises[0]->id, // Panca
            'day_of_week' => 'Lunedì',
            'sets' => 4,
            'reps' => 8
        ]);

        PlanExercise::create([
            'plan_id' => $plan2->id,
            'exercise_id' => $exercises[1]->id, // Squat
            'day_of_week' => 'Mercoledì',
            'sets' => 5,
            'reps' => 5
        ]);
    }
}