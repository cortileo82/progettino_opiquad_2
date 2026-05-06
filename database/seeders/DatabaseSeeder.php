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
        $clientRole->syncPermissions(['users:read:own', 'plans:read:own']);
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
            [
                'name' => 'Cliente Luca', 
                'password' => $defaultPassword, 
                'trainer_id' => $pt1->id,
                'is_premium' => false 
            ]
        );
        $client1->assignRole(User::ROLE_CLIENT ?? 'client');
        
        $client2 = User::firstOrCreate(
            ['email' => 'sara@tempra.com'],
            [
                'name' => 'Cliente Sara', 
                'password' => $defaultPassword, 
                'trainer_id' => $pt2->id,
                'is_premium' => true, 
                'stripe_id' => 'cus_test_seeder_123'
            ]
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
        
        $panca = Exercise::where('name', 'Panca Piana')->first();
        $french = Exercise::where('name', 'French Press')->first();
        $squat = Exercise::where('name', 'Squat')->first();
        $legCurl = Exercise::where('name', 'Leg Curl')->first();
        $trazioni = Exercise::where('name', 'Trazioni')->first();
        $curl = Exercise::where('name', 'Curl Bicipiti')->first();
        
        // 1. Scheda per Cliente 1 (Già Pagata / Vecchia)
        $plan1 = Plan::firstOrCreate(
            ['name' => 'Scheda Massa A', 'user_id' => $client1->id],
            ['pt_id' => $client1->trainer_id, 'num_weeks' => 4, 'is_active' => true, 'is_paid' => true]
        );

        // 2. NUOVA Scheda per Cliente 1 (Da Pagare -> Mostrerà il Paywall a Luca)
        $planLocked = Plan::firstOrCreate(
            ['name' => 'Scheda Massa B', 'user_id' => $client1->id],
            ['pt_id' => $client1->trainer_id, 'num_weeks' => 4, 'is_active' => true, 'is_paid' => false]
        );
        
        // 3. Scheda per Cliente 2 (Sbloccata in automatico essendo utente PRO)
        $plan2 = Plan::firstOrCreate(
            ['name' => 'Definizione Invernale', 'user_id' => $client2->id],
            ['pt_id' => $client2->trainer_id, 'num_weeks' => 4, 'is_active' => true, 'is_paid' => true]
        );

        // Svuota e ripopola gli esercizi nelle schede
        $plan1->exercises()->detach();
        $planLocked->exercises()->detach();
        $plan2->exercises()->detach();
        
        $days = ['Lunedì', 'Mercoledì', 'Venerdì'];
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
                ['ex' => $trazioni, 'sets' => 4, 'reps' => 8, 'rest' => 90, 'weight' => 0],
                ['ex' => $curl, 'sets' => 3, 'reps' => 12, 'rest' => 60, 'weight' => 14],
            ]
        ];
        
        for ($week = 1; $week <= 4; $week++) {
            foreach ($days as $day) {
                foreach ($routine[$day] as $workout) {
                    $plan1->exercises()->attach($workout['ex']->id, [
                        'week_number' => $week, 'day_of_week' => $day, 'sets' => $workout['sets'],
                        'reps' => $workout['reps'], 'rest_time' => $workout['rest'], 'weight_kg' => $workout['weight']
                    ]);
                    
                    $planLocked->exercises()->attach($workout['ex']->id, [
                        'week_number' => $week, 'day_of_week' => $day, 'sets' => $workout['sets'],
                        'reps' => $workout['reps'], 'rest_time' => $workout['rest'], 'weight_kg' => $workout['weight']
                    ]);

                    $plan2->exercises()->attach($workout['ex']->id, [
                        'week_number' => $week, 'day_of_week' => $day, 'sets' => $workout['sets'],
                        'reps' => $workout['reps'] + 4, 'rest_time' => 45, 'weight_kg' => max(0, $workout['weight'] - 10)
                    ]);
                }
            }
        }
    }
}