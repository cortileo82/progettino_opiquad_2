<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ShowClientPlansController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(User $client)
    {
        // 1. Autorizzazione
        Gate::authorize('viewPlans', $client);

        // 2. Query per ottenere le schede dell'utente (non serve where trainer_id perchè utente già autorizzato dal gate)
        $clientPlans = Plan::where('user_id', $client->id)
                            ->latest()
                            ->get();

        // 3. Si ritorna la vista
        return Inertia::render('pt/plans/index', [
            'clientPlans' => $clientPlans,
            'client' => $client,
        ]);
    }
}
