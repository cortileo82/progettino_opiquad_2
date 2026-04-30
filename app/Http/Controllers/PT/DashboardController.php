<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan; // Assicurati che il nome del modello sia corretto
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Gestisce la visualizzazione della Dashboard per il Personal Trainer.
     */
    public function __invoke(Request $request) 
    {
        $pt = $request->user();

        $numClients = $pt->clients()->count();

        $numWorkoutPlans = Plan::byTrainer($pt->id)->count();

        return Inertia::render('pt/dashboard', [
            'totalClients' => $numClients,
            'totalWorkoutPlans' => $numWorkoutPlans,
            'stats' => [
                'my_clients_count' => $numClients,
            ]
        ]);
    }
}