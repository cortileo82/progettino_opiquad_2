<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
<<<<<<< HEAD
=======
use Illuminate\Support\Facades\Auth;
>>>>>>> 559eefc552189407a3d6cbdd4dfea22c2f651d93

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        // 1. Recuperiamo tutti i piani dell'utente loggato con le relazioni necessarie
        $myPlans = Plan::with(['trainer', 'exercises'])
                       ->where('user_id', auth()->id())
                       ->latest() // Ordina per i più recenti
                       ->get();

        // 2. Trasformiamo i dati per il frontend
        // Questa mappatura è fondamentale per calcolare is_active e raggruppare gli esercizi
        $formattedPlans = $myPlans->map(function ($plan) {
            return [
                'id'         => $plan->id,
                'name'       => $plan->name,
                'is_active'  => $plan->is_active, // Richiama getIsActiveAttribute() nel Modello
                'start_date' => $plan->created_at->format('d/m/Y'),
                'end_date'   => $plan->end_date,   // Richiama getEndDateAttribute() nel Modello
                
                // Raggruppiamo gli esercizi per il giorno della settimana (es: "Lunedì", "Martedì")
                // Il raggruppamento avviene sulla colonna della tabella pivot 'plan_exercises'
                'days'       => $plan->exercises->groupBy('pivot.day_of_week')->toArray(),
            ];
        });

        // 3. Inviamo i dati separati al frontend React
        return Inertia::render('client/dashboard', [
            // Prendiamo il primo piano che risulta attivo oggi
            'activePlan' => $formattedPlans->firstWhere('is_active', true),
            
            // Prendiamo tutti i piani che NON sono attivi (già scaduti)
            // Usiamo values() per resettare le chiavi dell'array ed evitare che diventi un oggetto JSON
            'pastPlans'  => $formattedPlans->where('is_active', false)->values()->all(),
        ]);
    }
}