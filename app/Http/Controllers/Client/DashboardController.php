<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        // 1. Recuperiamo l'utente loggato con la relazione del suo trainer
        // DEFINIAMO LA VARIABILE $user QUI
        $user = auth()->user()->load('trainer');

        // 2. Recuperiamo tutti i piani dell'utente loggato
        $myPlans = Plan::with(['trainer', 'exercises'])
                       ->where('user_id', $user->id)
                       ->latest()
                       ->get();

        // 3. Trasformiamo i dati per il frontend
        $formattedPlans = $myPlans->map(function ($plan) {
            return [
                'id'         => $plan->id,
                'name'       => $plan->name,
                'is_active'  => $plan->is_active, 
                'start_date' => $plan->created_at->format('d/m/Y'),
                'end_date'   => $plan->end_date,
                
                // Raggruppiamo gli esercizi per il giorno della settimana
                'days'       => $plan->exercises->groupBy('pivot.day_of_week')->toArray(),
            ];
        });

        // 4. Inviamo i dati al frontend React
        return Inertia::render('client/dashboard', [
            // Ora $user è definita e questo funzionerà!
            'assignedTrainer' => $user->trainer ? $user->trainer->name : 'Nessun Trainer',
            
            'activePlan' => $formattedPlans->firstWhere('is_active', true),
            
            'pastPlans'  => $formattedPlans->where('is_active', false)->values()->all(),
        ]);
    }
}