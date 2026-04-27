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
        $ptId = $request->user()->id;

        // 1. Conta il numero totale di clienti assegnati a questo PT
        $numClients = User::role(User::ROLE_CLIENT)
            ->where('trainer_id', $ptId)
            ->count();

        // 2. Conta il numero totale di schede create da questo PT
        // Nota: Assumo che la tabella dei piani abbia una colonna 'user_id' o 'trainer_id' 
        // che indica chi ha creato la scheda.
        $numWorkoutPlans = Plan::where('pt_id', $ptId)->count();

        return Inertia::render('pt/dashboard', [
            'totalClients'      => $numClients,
            'totalWorkoutPlans' => $numWorkoutPlans,
            // Passiamo anche le stats vecchie se per caso le usi ancora altrove, 
            // ma per le Card useremo le due variabili sopra.
            'stats' => [
                'my_clients_count' => $numClients,
            ]
        ]);
    }
}