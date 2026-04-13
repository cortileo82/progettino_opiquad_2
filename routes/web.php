<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

// Rotta pubblica (Welcome)
Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Rotte protette da login
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Si controlla il ruolo e si reindirizza l'utente sulla dashboard corretta
    Route::get('/dashboard', function () {
        $role = auth()->user()->role;

        if($role === 'admin') {
            return redirect()->route('admin.dashboard');
        } elseif($role === 'pt') {
            return redirect()->route('pt.dashboard');
        } else {
            return redirect()->route('client.dashboard');
        }
    })->name('dashboard');

    // ------------------------------------------------
    // ROTTE ADMIN (Protette dal middleware)
    // ------------------------------------------------
    Route::middleware('role:admin')->prefix('admin')->group(function ()  {
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('admin.dashboard');

        Route::resource('exercises', \App\Http\Controllers\ExerciseController::class);
    });

    // ------------------------------------------------
    // ROTTE PERSONAL TRAINER
    // ------------------------------------------------
    Route::middleware('role:pt')->prefix('pt')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('pt/dashboard');
        })->name('pt.dashboard');
        
        
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
