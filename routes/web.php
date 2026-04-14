<?php

use App\Models\User;
use App\Models\Exercise;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;
use Illuminate\Http\Request;

// Controllers
use App\Http\Controllers\Admin\ExerciseController;
// Commentato per evitare crash finché non creiamo il file fisico
// use App\Http\Controllers\Admin\TrainerController; 
use App\Http\Controllers\PT\DashboardController as PTDashboard;
use App\Http\Controllers\Client\DashboardController as ClientDashboard;
use App\Http\Controllers\PT\ClientAssignmentController;
use App\Http\Controllers\PT\PlanController;

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
     * Reindirizzamento basato sul ruolo alla dashboard corretta.
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
        
        // 1. DASHBOARD ADMIN
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

        // 2. GESTIONE ESERCIZI
        // Questo comando crea le rotte: index, create, store, show, edit, update, destroy
        Route::resource('exercises', ExerciseController::class);

        // 3. GESTIONE PERSONAL TRAINER (Disabilitata temporaneamente per evitare errori)
        /*
        Route::get('/trainers/create', [TrainerController::class, 'create'])->name('trainers.create');
        Route::post('/trainers', [TrainerController::class, 'store'])->name('trainers.store');
        Route::get('/trainers', [TrainerController::class, 'index'])->name('trainers.index');
        */
    });

    // ------------------------------------------------
    // AREA PERSONAL TRAINER (PT)
    // ------------------------------------------------
    Route::middleware('role:pt')->prefix('pt')->name('pt.')->group(function () {
        Route::get('/dashboard', PTDashboard::class)->name('dashboard');
        Route::get('/clients/assign', [ClientAssignmentController::class, 'index'])->name('clients.assign');
        Route::post('/clients/assign', [ClientAssignmentController::class, 'store'])->name('clients.store');

        Route::get('/plans/create/{client}', [PlanController::class, 'create'])->name('plans.create');
        Route::post('/plans/store', [PlanController::class, 'store'])->name('plans.store');    
    });

    // ------------------------------------------------
    // AREA CLIENTE
    // ------------------------------------------------
    Route::middleware('role:client')->prefix('client')->name('client.')->group(function () {
        Route::get('/dashboard', ClientDashboard::class)->name('dashboard');
    });

});

require __DIR__.'/settings.php';