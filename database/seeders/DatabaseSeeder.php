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
        // 1. Reset della cache di Spatie per evitare bug sui permessi
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Suddivisione delle responsabilità (Single Responsibility)
        $this->seedPermissionsAndRoles();
        $this->seedUsers();
        $this->seedCatalog();
        $this->seedPlans();
    }

    /**
     * Creazione e assegnazione di Permessi e Ruoli
     */
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

        // Ruoli (Usa sempre le costanti del Model User se disponibili)
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

    /**
     * Creazione degli utenti base del sistema
     */
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

    /**
     * Creazione del catalogo usando gli array esatti da te forniti
     */
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

    /**
     * Creazione delle schede assegnate e popolamento pivot
     */
    private function seedPlans(): void
    {
        $client1 = User::where('email', 'luca@tempra.com')->first();
        $client2 = User::where('email', 'sara@tempra.com')->first();
        
        $panca = Exercise::where('name', 'Panca Piana')->first();
        $squat = Exercise::where('name', 'Squat')->first();

        // Utilizzo di firstOrCreate per evitare duplicati in caso di re-seeding
        // IMPORTANTE: is_active => true è stato aggiunto per rendere la scheda visibile al client!
        $plan1 = Plan::firstOrCreate(
            ['name' => 'Scheda Massa A', 'user_id' => $client1->id],
            ['pt_id' => $client1->trainer_id, 'num_weeks' => 4, 'is_active' => true]
        );

        $plan2 = Plan::firstOrCreate(
            ['name' => 'Definizione Invernale', 'user_id' => $client2->id],
            ['pt_id' => $client2->trainer_id, 'num_weeks' => 8, 'is_active' => true]
        );

        // Popolamento della tabella pivot tramite la relazione Eloquent (addio PlanExercise::create)
        // Usiamo syncWithoutDetaching per non sdoppiare l'esercizio se lanciamo il seeder due volte
        $plan1->exercises()->syncWithoutDetaching([
            $panca->id => [
                'week_number' => 1,
                'day_of_week' => 'Lunedì',
                'sets' => 4,
                'reps' => 8,
                'rest_time' => "90''"
            ]
        ]);

        $plan2->exercises()->syncWithoutDetaching([
            $squat->id => [
                'week_number' => 1,
                'day_of_week' => 'Mercoledì',
                'sets' => 5,
                'reps' => 5,
                'rest_time' => "120''"
            ]
        ]);
    }
}