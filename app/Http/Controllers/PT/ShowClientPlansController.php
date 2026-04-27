<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ShowClientPlansController extends Controller
{
    public function __invoke(User $client)
    {
        Gate::authorize('view', $client);

        $clientPlans = Plan::where('user_id', $client->id)
            ->select('id', 'name', 'num_weeks', 'is_active', 'created_at')
            ->latest()
            ->get();

        return Inertia::render('pt/plans/index', [
            'clientPlans' => $clientPlans,
            'client' => $client,
        ]);
    }
}
