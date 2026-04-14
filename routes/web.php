<?php

use App\Models\User;
use App\Models\Exercise;
use App\Models\Plan;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;
use Illuminate\Http\Request;

// Controller
use App\Http\Controllers\ExerciseController; // Controller per gli esercizi
use App\Http\Controllers\ClientAssignmentController; // Controller per assegnare client a PT
use App\Http\Controllers\PT\PlanController; // Controller per le schede 

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
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard', [
                'stats' => [
                    'total_clients'   => User::where('role', 'client')->count(),
                    'total_pts'       => User::where('role', 'pt')->count(),
                    'total_exercises' => Exercise::count(),
                ],
                'exercises' => Exercise::latest()->take(10)->get(),
            ]);
        })->name('dashboard');

        Route::resource('exercises', ExerciseController::class);
    });

    // ------------------------------------------------
    // AREA PERSONAL TRAINER (PT)
    // ------------------------------------------------
    Route::middleware('role:pt')->prefix('pt')->name('pt.')->group(function () {
        
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
        })->name('dashboard');

        // --- BACHECA NUOVI CLIENTI ---
        Route::get('/clients/assign', [ClientAssignmentController::class, 'index'])->name('clients.assign');
        Route::post('/clients/assign', [ClientAssignmentController::class, 'store'])->name('clients.store');

        // --- GESTIONE SCHEDE (PLANS) ---
        // Usiamo il PlanController per gestire la logica complessa
        Route::get('/plans/create/{client}', [PlanController::class, 'create'])->name('plans.create');
        Route::post('/plans/store', [PlanController::class, 'store'])->name('plans.store');
    });

    // ------------------------------------------------
    // AREA CLIENTE
    // ------------------------------------------------
    Route::middleware('role:client')->prefix('client')->name('client.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('client/dashboard');
        })->name('dashboard');
    });

});

require __DIR__.'/settings.php';