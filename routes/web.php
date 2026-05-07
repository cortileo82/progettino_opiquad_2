<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

// Controllers...
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\ExerciseController;
use App\Http\Controllers\Admin\MuscleGroupController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\PT\DashboardController as PTDashboard;
use App\Http\Controllers\PT\ManageClientsController;
use App\Http\Controllers\PT\ClientAssignmentController;
use App\Http\Controllers\PT\PlanController as PTPlanController;
use App\Http\Controllers\PT\ShowClientPlansController;
use App\Http\Controllers\PT\ExerciseCatalogController;
use App\Http\Controllers\Client\DashboardController as ClientDashboard;
use App\Http\Controllers\Client\PlanController as ClientPlanController;
use App\Http\Controllers\Billing\CheckoutController;
use App\Http\Controllers\Billing\WebhookController; // <--- AGGIUNTO

// --- ROTTA WEBHOOK (PUBBLICA) ---
// Deve stare fuori dal middleware auth
Route::post('/api/webhooks/stripe', [WebhookController::class, 'handle']);

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    
    // 1. MOTORE DI SMISTAMENTO
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->hasRole(User::ROLE_ADMIN)) return redirect()->route('admin.dashboard');
        if ($user->hasRole(User::ROLE_PT)) return redirect()->route('pt.dashboard');
        if ($user->hasRole(User::ROLE_CLIENT)) return redirect()->route('client.dashboard');
        return redirect()->route('default.dashboard');
    })->name('dashboard');

    Route::get('/welcome-on-board', function () {
        return Inertia::render('dashboard/generic', [
            'role' => auth()->user()->roles->first()?->name ?? 'Utente'
        ]);
    })->name('default.dashboard');

    // --- AREA ADMIN ---
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', AdminDashboard::class)->name('dashboard');
        Route::resource('exercises', ExerciseController::class);
        Route::resource('muscle-groups', MuscleGroupController::class);
        Route::resource('users', UserController::class)->except(['show']);
        Route::resource('roles', RoleController::class);
    });

    // --- AREA PT ---
    Route::prefix('pt')->name('pt.')->group(function () {
        Route::get('/dashboard', PTDashboard::class)->name('dashboard');
        Route::get('/clients/manage-clients', ManageClientsController::class)->name('clients.manage-clients');
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
        Route::get('/clients', ManageClientsController::class)->name('clients.index');
    });

    // --- AREA CLIENT ---
    Route::prefix('client')->name('client.')->group(function () { 
        Route::get('/dashboard', ClientDashboard::class)->name('dashboard'); 
        Route::get('/my-plan', [ClientPlanController::class, 'current'])->name('plan.current'); 
        Route::get('/history', [ClientPlanController::class, 'history'])->name('history'); 
        Route::get('/plans/{plan}', [ClientPlanController::class, 'show'])->name('plans.show'); 

        Route::prefix('billing')->name('billing.')->group(function () { 
            Route::get('/pricing', function () { 
                return Inertia::render('client/billing/pricing'); 
            })->name('pricing'); 
            
            Route::get('/success', function () { 
                return Inertia::render('client/billing/success'); 
            })->name('success'); 
            
            Route::get('/cancel', function () { 
                return Inertia::render('client/billing/cancel'); 
            })->name('cancel'); 

            Route::post('/checkout/subscription', [CheckoutController::class, 'createSubscription'])->name('checkout.subscription');
            Route::post('/checkout/plan', [CheckoutController::class, 'createOneOffPayment'])->name('checkout.plan');
        }); 
    });

    // --- ROTTE DI TEST UI ---
    Route::prefix('test-ui')->group(function () {
        Route::get('/success', function () { return Inertia::render('client/billing/success'); });
        Route::get('/cancel', function () { return Inertia::render('client/billing/cancel'); });
    });
});

require __DIR__.'/settings.php';