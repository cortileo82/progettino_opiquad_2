<?php

use App\Models\User;
use App\Models\Exercise;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;
use Illuminate\Http\Request;

// Rotta pubblica (Welcome)
Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Rotte protette da login
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Reindirizzamento intelligente basato sul ruolo
    Route::get('/dashboard', function () {
        $role = auth()->user()->role;

        return match ($role) {
            'admin' => redirect()->route('admin.dashboard'),
            'pt'    => redirect()->route('pt.dashboard'),
            default => redirect()->route('client.dashboard'),
        };
    })->name('dashboard');

    // ------------------------------------------------
    // ROTTE ADMIN
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
    });

    // ------------------------------------------------
    // ROTTE PERSONAL TRAINER
    // ------------------------------------------------
    Route::middleware('role:pt')->prefix('pt')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('pt/dashboard', [
                // Recupera solo i clienti assegnati a questo PT
                'clients' => User::where('role', 'client')
                                 ->where('trainer_id', auth()->id())
                                 ->get(),
                'stats' => [
                    'my_clients_count' => User::where('trainer_id', auth()->id())->count(),
                ]
            ]);
        })->name('pt.dashboard');

        // Rotta per vedere la lista completa dei clienti da associare
        Route::get('/clients/assign', function () {
            return Inertia::render('pt/clients/assign', [
                'availableClients' => User::where('role', 'client')
                                        ->whereNull('trainer_id')
                                        ->get()
            ]);
        })->name('pt.clients.assign');
    });

    // ------------------------------------------------
    // ROTTE CLIENTE
    // ------------------------------------------------
    Route::middleware('role:client')->prefix('client')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('client/dashboard');
        })->name('client.dashboard');
    });

});

require __DIR__.'/settings.php';