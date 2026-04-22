<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Exercise;
use App\Models\Plan;
use App\Models\PlanExercise;
use App\Models\MuscleGroup;

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

        // 2. CREAZIONE GRUPPI MUSCOLARI (I tuoi vecchi Enum trasformati in record DB)
        $muscleGroupsList = [
            'Alti Pettorali',
            'Pettorali',
            'Schiena Alta',
            'Laterali',
            'Schiena Bassa',
            'Quadricipiti',
            'Bicipiti Femorali',
            'Deltoidi Anteriori',
            'Deltoidi Laterali',
            'Deltoidi Posteriori',
            'Bicipiti',
            'Tricipiti',
            'Addome',
            'Cardio',
            'Collo'
        ];

        $mg = []; // Array associativo per recuperare gli ID
        foreach ($muscleGroupsList as $groupName) {
            $mg[$groupName] = MuscleGroup::create(['name' => $groupName]);
        }

        // 3. CREAZIONE ESERCIZI BASE (Mappati con i nuovi nomi esatti)
        $exercisesData = [
            ['name' => 'Panca Piana', 'description' => 'Bilanciere al petto.', 'muscle_group_id' => $mg['Pettorali']->id],
            ['name' => 'Squat', 'description' => 'Accosciata con bilanciere.', 'muscle_group_id' => $mg['Quadricipiti']->id],
            ['name' => 'Stacco da Terra', 'description' => 'Sollevamento da terra.', 'muscle_group_id' => $mg['Schiena Bassa']->id],
            ['name' => 'Trazioni', 'description' => 'Trazioni alla sbarra.', 'muscle_group_id' => $mg['Schiena Alta']->id],
            ['name' => 'Shoulder Press', 'description' => 'Spinta sopra la testa.', 'muscle_group_id' => $mg['Deltoidi Anteriori']->id],
            ['name' => 'Curl Bicipiti', 'description' => 'Flessione braccia.', 'muscle_group_id' => $mg['Bicipiti']->id],
            ['name' => 'French Press', 'description' => 'Estensione tricipiti.', 'muscle_group_id' => $mg['Tricipiti']->id],
            ['name' => 'Leg Extension', 'description' => 'Isolamento quadricipiti.', 'muscle_group_id' => $mg['Quadricipiti']->id],
            ['name' => 'Leg Curl', 'description' => 'Isolamento femorali.', 'muscle_group_id' => $mg['Bicipiti Femorali']->id],
            ['name' => 'Crunch', 'description' => 'Addominali a terra.', 'muscle_group_id' => $mg['Addome']->id],
        ];

        $exercises = [];
        foreach ($exercisesData as $ex) {
            $exercises[] = Exercise::create($ex);
        }

        // 4. CREAZIONE SCHEDE
        $plan1 = Plan::create([
            'user_id' => $client1->id,
            'pt_id' => $pt1->id,
            'name' => 'Scheda Massa A',
            'num_weeks' => 4
        ]);

        $plan2 = Plan::create([
            'user_id' => $client2->id,
            'pt_id' => $pt2->id,
            'name' => 'Definizione Invernale',
            'num_weeks' => 8
        ]);

        // 5. ASSEGNAZIONE ESERCIZI ALLE SCHEDE
        PlanExercise::create([
            'plan_id' => $plan1->id,
            'exercise_id' => $exercises[0]->id, // Panca
            'week_number' => 1,
            'day_of_week' => 'Lunedì',
            'sets' => 4,
            'reps' => 8,
            'rest_time' => "90''"
        ]);

        PlanExercise::create([
            'plan_id' => $plan2->id,
            'exercise_id' => $exercises[1]->id, // Squat
            'week_number' => 1,
            'day_of_week' => 'Mercoledì',
            'sets' => 5,
            'reps' => 5,
            'rest_time' => "120''"
        ]);
    }
}