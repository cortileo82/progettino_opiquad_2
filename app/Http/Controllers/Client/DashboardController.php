<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $myPlans = Plan::with(['trainer', 'exercises']) // 1. Prepara l'Eager Loading (le relazioni)
               ->where('user_id', auth()->id())         // 2. Applica il filtro di sicurezza
               ->get();                                 // 3. Esegue la query ed estrae i dati

        return Inertia::render('client/dashboard', [
            'plans' => $myPlans
        ]);
    }
}
