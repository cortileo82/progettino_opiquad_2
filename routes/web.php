<?php 

use App\Models\User;
use App\Models\Exercise;
use App\Models\Plan;
use App\Models\MuscleGroup;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

// ---- Controller per l'Admin ----
use App\Http\Controllers\Admin\ExerciseController;
use App\Http\Controllers\Admin\MuscleGroupController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;

// ---- Controller per il Personal Trainer ----
use App\Http\Controllers\PT\DashboardController as PTDashboard;
use App\Http\Controllers\PT\ClientAssignmentController;
use App\Http\Controllers\PT\PlanController as PTPlanController;
use App\Http\Controllers\PT\ShowClientPlansController;
use App\Http\Controllers\PT\ExerciseCatalogController;

// ---- Controller per il Cliente ----
use App\Http\Controllers\Client\DashboardController as ClientDashboard;
use App\Http\Controllers\Client\PlanController as ClientPlanController;
use App\Http\Controllers\Client\PlanHistoryController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // Il redirect della Dashboard usa Spatie per leggere il ruolo in RAM
    Route::get('/dashboard', function () {
        $user = auth()->user();
        
        if ($user->hasRole('admin')) return redirect()->route('admin.dashboard');
        if ($user->hasRole('pt')) return redirect()->route('pt.dashboard');
        
        return redirect()->route('client.dashboard');
    })->name('dashboard');

    // ==============================================
    // AREA ADMIN (Protezione delegata alle Policy)
    // ==============================================
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard', [
                // Usiamo il model scope di Spatie per contare gli utenti per ruolo
                'stats' => [
                    'total_clients' => User::role('client')->count(),
                    'total_pts' => User::role('pt')->count(),
                    'total_exercises' => Exercise::count(),
                    'total_workouts' => Plan::count(),
                ],
                'exercises' => Exercise::latest()->take(10)->get(),
            ]);
        })->name('dashboard');

        Route::resource('exercises', ExerciseController::class);
        Route::resource('muscle-groups', MuscleGroupController::class);
        Route::resource('accounts', UserController::class)->except(['show']);
        Route::resource('roles', RoleController::class);
    });

    // ==============================================
    // AREA PT (Protezione delegata alle Policy)
    // ==============================================
    Route::prefix('pt')->name('pt.')->group(function () {
        Route::get('/dashboard', PTDashboard::class)->name('dashboard');
        Route::get('/exercises/catalog', ExerciseCatalogController::class)->name('exercises.catalog');
        Route::get('/clients/assign', [ClientAssignmentController::class, 'index'])->name('clients.assign');
        Route::post('/clients/assign', [ClientAssignmentController::class, 'store'])->name('clients.store');
        Route::get('/clients/{client}/plans', ShowClientPlansController::class)->name('clients.plans');
        Route::get('/plans/create/{client}', [PTPlanController::class, 'create'])->name('plans.create');
        Route::post('/plans/store', [PTPlanController::class, 'store'])->name('plans.store');
        Route::get('/plans/{plan}', [PTPlanController::class, 'show'])->name('plans.show');
        Route::get('/plans/{plan}/edit', [PTPlanController::class, 'edit'])->name('plans.edit');
        Route::put('/plans/{plan}', [PTPlanController::class, 'update'])->name('plans.update');
        Route::delete('/plans/{plan}', [PTPlanController::class, 'delete'])->name('plans.delete');
    });

    // ==============================================
    // AREA CLIENT (Protezione delegata alle Policy)
    // ==============================================
    Route::prefix('client')->name('client.')->group(function () {
        Route::get('/dashboard', ClientDashboard::class)->name('dashboard');
        Route::get('/my-plan', [ClientPlanController::class, 'current'])->name('plan.current');
        Route::get('/history', [ClientPlanController::class, 'history'])->name('history');
        Route::get('/plans/{plan}', [ClientPlanController::class, 'show'])->name('plans.show');
    });
    
});

require __DIR__.'/settings.php';