<?php

use App\Models\User;
use App\Models\Exercise;
use App\Models\Plan; 
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

// Controllers Admin
use App\Http\Controllers\Admin\ExerciseController;
use App\Http\Controllers\Admin\UserController;

// Controllers PT
use App\Http\Controllers\PT\DashboardController as PTDashboard;
use App\Http\Controllers\PT\ClientAssignmentController;
use App\Http\Controllers\PT\PlanController as PTPlanController;
use App\Http\Controllers\PT\ShowClientPlansController;
use App\Http\Controllers\PT\ExerciseCatalogController; 

// Controllers Client
use App\Http\Controllers\Client\DashboardController as ClientDashboard;
use App\Http\Controllers\Client\PlanController as ClientPlanController;
use App\Http\Controllers\Client\PlanHistoryController; // Nuovo Controller per lo storico

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
    
    // Reindirizzamento Dashboard basato sul ruolo
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
                    'total_workouts'  => Plan::count(),
                ],
                'exercises' => Exercise::latest()->take(10)->get(),
            ]);
        })->name('dashboard');

        Route::resource('exercises', ExerciseController::class);

        Route::get('/accounts', [UserController::class, 'index'])->name('accounts.index');
        Route::get('/accounts/create', [UserController::class, 'create'])->name('accounts.create');
        Route::post('/accounts', [UserController::class, 'store'])->name('accounts.store');
        Route::get('/accounts/{user}/edit', [UserController::class, 'edit'])->name('accounts.edit');
        Route::patch('/accounts/{user}', [UserController::class, 'update'])->name('accounts.update');
        Route::delete('/accounts/{user}', [UserController::class, 'destroy'])->name('accounts.destroy');
    });

    // ------------------------------------------------
    // AREA PT (Personal Trainer)
    // ------------------------------------------------
    Route::middleware('role:pt')->prefix('pt')->name('pt.')->group(function () {
        Route::get('/dashboard', PTDashboard::class)->name('dashboard');
        
        // Catalogo Esercizi (Sola Lettura per PT)
        Route::get('/exercises/catalog', ExerciseCatalogController::class)->name('exercises.catalog');

        // Gestione Clienti e Assegnazioni
        Route::get('/clients/assign', [ClientAssignmentController::class, 'index'])->name('clients.assign');
        Route::post('/clients/assign', [ClientAssignmentController::class, 'store'])->name('clients.store');
        Route::get('/clients/{client}/plans', ShowClientPlansController::class)->name('clients.plans');

        // CRUD Piani di Allenamento
        Route::get('/plans/create/{client}', [PTPlanController::class, 'create'])->name('plans.create');
        Route::post('/plans/store', [PTPlanController::class, 'store'])->name('plans.store');    
        Route::get('/plans/{plan}', [PTPlanController::class, 'show'])->name('plans.show');
        Route::get('/plans/{plan}/edit', [PTPlanController::class, 'edit'])->name('plans.edit');
        Route::put('/plans/{plan}', [PTPlanController::class, 'update'])->name('plans.update');
        Route::delete('/plans/{plan}', [PTPlanController::class, 'delete'])->name('plans.delete');
    });

    // ------------------------------------------------
    // AREA CLIENTE
    // ------------------------------------------------
    Route::middleware('role:client')->prefix('client')->name('client.')->group(function () {
        // Dashboard (Vista veloce / Settimana Corrente)
        Route::get('/dashboard', ClientDashboard::class)->name('dashboard');
    
        // Gestione Piani
        Route::get('/my-plan', [ClientPlanController::class, 'current'])->name('plan.current');
        Route::get('/history', [ClientPlanController::class, 'history'])->name('history');
        Route::get('/plans/{plan}', [ClientPlanController::class, 'show'])->name('plans.show');
    });
});

require __DIR__.'/settings.php';