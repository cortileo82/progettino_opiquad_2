<?php 

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Exercise;
use App\Models\Plan;
use App\Models\PlanExercise;
use App\Models\MuscleGroup;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Reset della cache dei permessi di Spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Generazione Permessi: ENTITÀ GLOBALI (Nessuna proprietà)
        $globalEntities = ['roles', 'muscle-groups', 'exercises'];
        $actions = ['create', 'read', 'update', 'delete'];

        foreach ($globalEntities as $entity) {
            foreach ($actions as $action) {
                Permission::create(['name' => "{$entity}:{$action}"]);
            }
        }

        // 3. Generazione Permessi: ENTITÀ DI PROPRIETÀ (Scope: any/own)
        $scopedEntities = ['users', 'plans'];
        $scopedActions = ['read', 'update', 'delete'];

        foreach ($scopedEntities as $entity) {
            // La creazione non ha scope (non si può possedere qualcosa che non esiste ancora)
            Permission::create(['name' => "{$entity}:create"]); 
            
            foreach ($scopedActions as $action) {
                Permission::create(['name' => "{$entity}:{$action}:any"]);
                Permission::create(['name' => "{$entity}:{$action}:own"]);
            }
        }

        // Permessi specifici di logica aziendale
        Permission::create(['name' => 'users:change-trainer']);
        Permission::create(['name' => 'users:take-free-client']);

        // 4. Creazione Ruoli e Assegnazione Permessi
        
        // ADMIN: Ottiene tutti i permessi (inclusi gli :any)
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // PT: Lavora in lettura sul globale, ma ha logica :own sulle schede e sui clienti
        $ptRole = Role::create(['name' => 'pt']);
        $ptRole->givePermissionTo([
            // Accesso Globale
            'exercises:read',
            'muscle-groups:read',
            // Accesso Utenti (Clienti)
            'users:read:own', 
            'users:update:own',
            'users:take-free-client',
            // Accesso Schede
            'plans:create',
            'plans:read:own',
            'plans:update:own',
            'plans:delete:own',
        ]);

        // CLIENT: Vede solo se stesso e le sue schede
        $clientRole = Role::create(['name' => 'client']);
        $clientRole->givePermissionTo([
            'users:read:own',
            'plans:read:own',
        ]);

        // 5. Creazione Utenti
        $defaultPassword = Hash::make('pwd');

        $admin = User::create([
            'name' => 'First Admin',
            'email' => 'admin@tempra.com',
            'password' => $defaultPassword,
        ]);
        $admin->assignRole($adminRole);

        $pt1 = User::create([
            'name' => 'Trainer Marco',
            'email' => 'marco@tempra.com',
            'password' => $defaultPassword,
        ]);
        $pt1->assignRole($ptRole);

        $pt2 = User::create([
            'name' => 'Trainer Giulia',
            'email' => 'giulia@tempra.com',
            'password' => $defaultPassword,
        ]);
        $pt2->assignRole($ptRole);

        $client1 = User::create([
            'name' => 'Cliente Luca',
            'email' => 'luca@tempra.com',
            'password' => $defaultPassword,
            'trainer_id' => $pt1->id,
        ]);
        $client1->assignRole($clientRole);

        $client2 = User::create([
            'name' => 'Cliente Sara',
            'email' => 'sara@tempra.com',
            'password' => $defaultPassword,
            'trainer_id' => $pt2->id,
        ]);
        $client2->assignRole($clientRole);

        // 6. Popolamento Dati Dominio (Gruppi, Esercizi, Schede)
        $muscleGroupsList = [
            'Alti Pettorali', 'Pettorali', 'Schiena Alta', 'Laterali', 'Schiena Bassa',
            'Quadricipiti', 'Bicipiti Femorali', 'Deltoidi Anteriori', 'Deltoidi Laterali',
            'Deltoidi Posteriori', 'Bicipiti', 'Tricipiti', 'Addome', 'Cardio', 'Collo'
        ];
        $mg = [];
        foreach ($muscleGroupsList as $groupName) {
            $mg[$groupName] = MuscleGroup::create(['name' => $groupName]);
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
        
        $exercises = [];
        foreach ($exercisesData as $ex) {
            $exercises[] = Exercise::create($ex);
        }

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

        PlanExercise::create([
            'plan_id' => $plan1->id,
            'exercise_id' => $exercises[0]->id,
            'week_number' => 1,
            'day_of_week' => 'Lunedì',
            'sets' => 4,
            'reps' => 8,
            'rest_time' => "90''"
        ]);

        PlanExercise::create([
            'plan_id' => $plan2->id,
            'exercise_id' => $exercises[1]->id,
            'week_number' => 1,
            'day_of_week' => 'Mercoledì',
            'sets' => 5,
            'reps' => 5,
            'rest_time' => "120''"
        ]);
    }
}