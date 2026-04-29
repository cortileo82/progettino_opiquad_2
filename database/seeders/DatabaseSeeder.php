<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Exercise;
use App\Models\Plan;
use App\Models\MuscleGroup;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $this->seedPermissionsAndRoles();
        $this->seedUsers();
        $this->seedCatalog();
        $this->seedPlans();
    }

    private function seedPermissionsAndRoles(): void
    {
        $globalEntities = ['roles', 'muscle-groups', 'exercises'];
        $actions = ['create', 'read', 'update', 'delete'];

        foreach ($globalEntities as $entity) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$entity}:{$action}"]);
            }
        }

        $scopedEntities = ['users', 'plans'];
        $scopedActions = ['read', 'update', 'delete'];

        foreach ($scopedEntities as $entity) {
            Permission::firstOrCreate(['name' => "{$entity}:create"]);
            foreach ($scopedActions as $action) {
                Permission::firstOrCreate(['name' => "{$entity}:{$action}:any"]);
                Permission::firstOrCreate(['name' => "{$entity}:{$action}:own"]);
            }
        }

        Permission::firstOrCreate(['name' => 'users:change-trainer']);
        Permission::firstOrCreate(['name' => 'users:take-free-client']);

        $adminRole = Role::firstOrCreate(['name' => User::ROLE_ADMIN ?? 'admin']);
        $adminRole->syncPermissions(Permission::all());

        $ptRole = Role::firstOrCreate(['name' => User::ROLE_PT ?? 'pt']);
        $ptRole->syncPermissions([
            'exercises:read', 'muscle-groups:read',
            'users:read:own', 'users:update:own', 'users:take-free-client',
            'plans:create', 'plans:read:own', 'plans:update:own', 'plans:delete:own',
        ]);

        $clientRole = Role::firstOrCreate(['name' => User::ROLE_CLIENT ?? 'client']);
        $clientRole->syncPermissions([
            'users:read:own', 'plans:read:own',
        ]);
    }

    private function seedUsers(): void
    {
        $defaultPassword = Hash::make('pwd');

        $admin = User::firstOrCreate(
            ['email' => 'admin@tempra.com'],
            ['name' => 'First Admin', 'password' => $defaultPassword]
        );
        $admin->assignRole(User::ROLE_ADMIN ?? 'admin');

        $pt1 = User::firstOrCreate(
            ['email' => 'marco@tempra.com'],
            ['name' => 'Trainer Marco', 'password' => $defaultPassword]
        );
        $pt1->assignRole(User::ROLE_PT ?? 'pt');

        $pt2 = User::firstOrCreate(
            ['email' => 'giulia@tempra.com'],
            ['name' => 'Trainer Giulia', 'password' => $defaultPassword]
        );
        $pt2->assignRole(User::ROLE_PT ?? 'pt');

        $client1 = User::firstOrCreate(
            ['email' => 'luca@tempra.com'],
            ['name' => 'Cliente Luca', 'password' => $defaultPassword, 'trainer_id' => $pt1->id]
        );
        $client1->assignRole(User::ROLE_CLIENT ?? 'client');

        $client2 = User::firstOrCreate(
            ['email' => 'sara@tempra.com'],
            ['name' => 'Cliente Sara', 'password' => $defaultPassword, 'trainer_id' => $pt2->id]
        );
        $client2->assignRole(User::ROLE_CLIENT ?? 'client');
    }

    private function seedCatalog(): void
    {
        $muscleGroupsList = [
            'Alti Pettorali', 'Pettorali', 'Schiena Alta', 'Laterali', 'Schiena Bassa', 
            'Quadricipiti', 'Bicipiti Femorali', 'Deltoidi Anteriori', 'Deltoidi Laterali', 
            'Deltoidi Posteriori', 'Bicipiti', 'Tricipiti', 'Addome', 'Cardio', 'Collo'
        ];

        $mg = [];
        foreach ($muscleGroupsList as $groupName) {
            $mg[$groupName] = MuscleGroup::firstOrCreate(['name' => $groupName]);
        }

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

        foreach ($exercisesData as $ex) {
            Exercise::firstOrCreate(['name' => $ex['name']], $ex);
        }
    }

    private function seedPlans(): void
    {
        $client1 = User::where('email', 'luca@tempra.com')->first();
        $client2 = User::where('email', 'sara@tempra.com')->first();
        
        // Estraiamo dal database una selezione di esercizi per creare le routine
        $panca    = Exercise::where('name', 'Panca Piana')->first();
        $french   = Exercise::where('name', 'French Press')->first();
        $squat    = Exercise::where('name', 'Squat')->first();
        $legCurl  = Exercise::where('name', 'Leg Curl')->first();
        $trazioni = Exercise::where('name', 'Trazioni')->first();
        $curl     = Exercise::where('name', 'Curl Bicipiti')->first();

        // Entrambe le schede ora sono di 4 settimane
        $plan1 = Plan::firstOrCreate(
            ['name' => 'Scheda Massa A', 'user_id' => $client1->id],
            ['pt_id' => $client1->trainer_id, 'num_weeks' => 4, 'is_active' => true]
        );

        $plan2 = Plan::firstOrCreate(
            ['name' => 'Definizione Invernale', 'user_id' => $client2->id],
            ['pt_id' => $client2->trainer_id, 'num_weeks' => 4, 'is_active' => true]
        );

        // ARCHITETTURA: Puliamo la pivot prima di inserire. 
        // Questo rende il seeder "Idempotente" aggirando il limite del sync() con ID duplicati.
        $plan1->exercises()->detach();
        $plan2->exercises()->detach();

        $days = ['Lunedì', 'Mercoledì', 'Venerdì'];

        // Strutturiamo la routine (2 esercizi al giorno)
        $routine = [
            'Lunedì' => [
                ['ex' => $panca, 'sets' => 4, 'reps' => 8, 'rest' => 90, 'weight' => 60.5],
                ['ex' => $french, 'sets' => 3, 'reps' => 10, 'rest' => 60, 'weight' => 22.5],
            ],
            'Mercoledì' => [
                ['ex' => $squat, 'sets' => 5, 'reps' => 5, 'rest' => 120, 'weight' => 80],
                ['ex' => $legCurl, 'sets' => 3, 'reps' => 12, 'rest' => 60, 'weight' => 35],
            ],
            'Venerdì' => [
                ['ex' => $trazioni, 'sets' => 4, 'reps' => 8, 'rest' => 90, 'weight' => 0], // A corpo libero
                ['ex' => $curl, 'sets' => 3, 'reps' => 12, 'rest' => 60, 'weight' => 14],
            ]
        ];

        // Popolamento massivo: 4 settimane x 3 giorni x 2 esercizi = 24 righe per scheda
        for ($week = 1; $week <= 4; $week++) {
            foreach ($days as $day) {
                foreach ($routine[$day] as $workout) {
                    
                    // Inserimento Scheda 1 (Massa)
                    $plan1->exercises()->attach($workout['ex']->id, [
                        'week_number' => $week,
                        'day_of_week' => $day,
                        'sets'        => $workout['sets'],
                        'reps'        => $workout['reps'],
                        'rest_time'   => $workout['rest'],
                        'weight_kg'   => $workout['weight']
                    ]);

                    // Inserimento Scheda 2 (Definizione)
                    // Variamo dinamicamente i dati per non avere schede identiche:
                    // Abbassiamo i recuperi, togliamo 10kg e aumentiamo le reps
                    $plan2->exercises()->attach($workout['ex']->id, [
                        'week_number' => $week,
                        'day_of_week' => $day,
                        'sets'        => $workout['sets'],
                        'reps'        => $workout['reps'] + 4,
                        'rest_time'   => 45,
                        'weight_kg'   => max(0, $workout['weight'] - 10) 
                    ]);
                }
            }
        }
    }
}