<?php

use App\Models\User;
use App\Models\Exercise;
use App\Models\WorkoutPlan;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\ClientAssignmentController;

// ------------------------------------------------
// ROTTE PUBBLICHE
// ------------------------------------------------
Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// ------------------------------------------------
// ROTTE PROTETTE (AUTH & VERIFIED)
// ------------------------------------------------
Route::middleware(['auth', 'verified'])->group(function () {
    
    /**
     * Reindirizzamento intelligente basato sul ruolo.
     */
    Route::get('/dashboard', function () {
        $role = auth()->user()->role;

        return match ($role) {
            'admin' => redirect()->route('admin.dashboard'),
            'pt'    => redirect()->route('pt.dashboard'),
            default => redirect()->route('client.dashboard'),
        };
    })->name('dashboard');

    // ------------------------------------------------
    // AREA ADMIN
    // ------------------------------------------------
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard', [
                'stats' => [
                    'total_clients'   => User::where('role', 'client')->count(),
                    'total_pts'       => User::where('role', 'pt')->count(),
                    'total_exercises' => Exercise::count(),
                ],
                'exercises' => Exercise::latest()->take(10)->get(),
            ]);
        })->name('admin.dashboard');

        Route::resource('exercises', ExerciseController::class);
    });

    // ------------------------------------------------
    // AREA PERSONAL TRAINER (PT)
    // ------------------------------------------------
    Route::middleware('role:pt')->prefix('pt')->group(function () {
        
        // Dashboard PT: lista atleti già associati
        Route::get('/dashboard', function () {
            return Inertia::render('pt/dashboard', [
                'clients' => User::where('role', 'client')
                                 ->where('trainer_id', auth()->id())
                                 ->get(),
                'stats' => [
                    'my_clients_count' => User::where('trainer_id', auth()->id())->count(),
                ]
            ]);
        })->name('pt.dashboard');

        // --- BACHECA NUOVI CLIENTI ---
        // Visualizza solo utenti 'client' con trainer_id NULL
        Route::get('/clients/assign', [ClientAssignmentController::class, 'index'])->name('pt.clients.assign');
        
        // Azione per "reclamare" un cliente (aggiorna trainer_id)
        Route::post('/clients/assign', [ClientAssignmentController::class, 'store'])->name('pt.clients.store');

        // --- GESTIONE SCHEDE (WORKOUT PLANS) ---
        // Form creazione scheda
        Route::get('/plans/create/{client}', function (User $client) {
            // Sicurezza: puoi creare schede solo per i tuoi atleti
            if ($client->trainer_id !== auth()->id()) {
                abort(403, 'Questo atleta non è associato al tuo profilo.');
            }

            return Inertia::render('pt/plans/create', [
                'client' => $client,
                'exercises_list' => Exercise::all()
            ]);
        })->name('pt.plans.create');

        // Salvataggio effettivo della scheda nel DB
        Route::post('/plans/store', function (Request $request) {
            $data = $request->validate([
                'user_id'      => 'required|exists:users,id',
                'name'         => 'required|string|max:255',
                'workout_data' => 'required|array', 
            ]);

            WorkoutPlan::create([
                'user_id'    => $data['user_id'],
                'trainer_id' => auth()->id(),
                'name'       => $data['name'],
                'exercises'  => $data['workout_data'],
            ]);

            return redirect()->route('pt.dashboard')->with('success', 'Scheda inviata all\'atleta!');
        })->name('pt.plans.store');
    });

    // ------------------------------------------------
    // AREA CLIENTE
    // ------------------------------------------------
    Route::middleware('role:client')->prefix('client')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('client/dashboard');
        })->name('client.dashboard');
    });

});

require __DIR__.'/settings.php';