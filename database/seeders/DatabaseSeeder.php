<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
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
            'exercises:read',
            'muscle-groups:read',
            'users:read:own',
            'users:update:own',
            'users:take-free-client',
            'plans:create',
            'plans:read:own',
            'plans:update:own',
            'plans:delete:own',
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
        $luca = User::where('email', 'luca@tempra.com')->first();
        $sara = User::where('email', 'sara@tempra.com')->first();
        $allExercises = Exercise::all();

        // 1. LA SCHEDA ENORME DI LUCA (Programma Titan: 12 settimane, 6 giorni a settimana)
        $this->createTitanPlan($luca, $allExercises);

        // 2. UNA SCHEDA VECCHIA DA SBLOCCARE PER LUCA (Storico Paywall Testing)
        $this->createLockedHistoryPlan($luca, $allExercises);

        // 3. UNA SCHEDA STANDARD PER SARA (Premium User)
        $this->createStandardPlan($sara, $allExercises);
    }

    /**
     * ARCHITETTURA: Metodo dedicato alla generazione intensiva.
     * Genera una scheda di 12 settimane, 6 giorni su 7, con 6 esercizi al giorno (432 record pivot in totale).
     * Utilizza DB::transaction per garantire l'atomicità ed evitare colli di bottiglia nelle query.
     */
    private function createTitanPlan(User $client, $allExercises): void
    {
        $plan = Plan::firstOrCreate(
            ['name' => 'Programma Titan (Volume Estremo)', 'user_id' => $client->id],
            ['pt_id' => $client->trainer_id, 'num_weeks' => 12, 'is_active' => true, 'is_paid' => true]
        );
        
        $plan->exercises()->detach();
        $days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

        DB::transaction(function () use ($plan, $days, $allExercises) {
            for ($week = 1; $week <= 12; $week++) {
                // Aumento progressivo dei carichi ogni 4 settimane per simulare un mesociclo reale
                $intensityMultiplier = 1 + (floor($week / 4) * 0.1); 

                foreach ($days as $day) {
                    // Selezioniamo 6 esercizi casuali dal catalogo per ogni giorno
                    $dailyRoutine = $allExercises->random(6);

                    foreach ($dailyRoutine as $ex) {
                        $baseWeight = rand(10, 60);
                        
                        $plan->exercises()->attach($ex->id, [
                            'week_number' => $week,
                            'day_of_week' => $day,
                            'sets'        => rand(3, 5),
                            'reps'        => rand(6, 15),
                            'rest_time'   => rand(45, 120),
                            'weight_kg'   => round($baseWeight * $intensityMultiplier, 1)
                        ]);
                    }
                }
            }
        });
    }

    /**
     * Genera una vecchia scheda non pagata per testare il Paywall nello storico.
     */
    private function createLockedHistoryPlan(User $client, $allExercises): void
    {
        $plan = Plan::firstOrCreate(
            ['name' => 'Forza Pura (Archiviata)', 'user_id' => $client->id],
            ['pt_id' => $client->trainer_id, 'num_weeks' => 4, 'is_active' => false, 'is_paid' => false]
        );
        
        $plan->exercises()->detach();

        DB::transaction(function () use ($plan, $allExercises) {
            // Solo due giorni per questa scheda bloccata (Full Body)
            foreach (['Lunedì', 'Giovedì'] as $day) {
                $exercises = $allExercises->random(4);
                foreach ($exercises as $ex) {
                    $plan->exercises()->attach($ex->id, [
                        'week_number' => 1,
                        'day_of_week' => $day,
                        'sets'        => 5,
                        'reps'        => 5,
                        'rest_time'   => 120,
                        'weight_kg'   => 80
                    ]);
                }
            }
        });
    }

    /**
     * Genera la routine standard per Sara (Utente PRO)
     */
    private function createStandardPlan(User $client, $allExercises): void
    {
        $plan = Plan::firstOrCreate(
            ['name' => 'Definizione Invernale PRO', 'user_id' => $client->id],
            ['pt_id' => $client->trainer_id, 'num_weeks' => 4, 'is_active' => true, 'is_paid' => true]
        );
        
        $plan->exercises()->detach();

        DB::transaction(function () use ($plan, $allExercises) {
            foreach (['Lunedì', 'Mercoledì', 'Venerdì'] as $day) {
                $exercises = $allExercises->random(4);
                for ($week = 1; $week <= 4; $week++) {
                    foreach ($exercises as $ex) {
                        $plan->exercises()->attach($ex->id, [
                            'week_number' => $week,
                            'day_of_week' => $day,
                            'sets'        => 3,
                            'reps'        => 12,
                            'rest_time'   => 60,
                            'weight_kg'   => rand(10, 30)
                        ]);
                    }
                }
            }
        });
    }
}