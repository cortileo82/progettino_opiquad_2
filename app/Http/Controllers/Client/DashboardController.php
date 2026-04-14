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
        $myPlans = Plan::with(['trainer', 'exercises']) // 1. Prepara l'Eager Loading (le relazioni)
               ->where('user_id', auth()->id())         // 2. Applica il filtro di sicurezza
               ->get();                                 // 3. Esegue la query ed estrae i dati

        return Inertia::render('client/dashboard', [
            'plans' => $myPlans
        ]);
    }
}
