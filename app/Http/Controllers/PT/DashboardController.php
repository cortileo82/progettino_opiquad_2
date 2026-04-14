<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $myClients = User::where('role', 'client')
                        ->where('trainer_id', auth()->id()) // Prende l'ID del PT loggato
                        ->get();

        $numClients = $myClients->count();

        return Inertia::render('pt/dashboard', [
            'clients' => $myClients,
            'stats' => [
                'my_clients_count' => $numClients,
            ]
        ]);
    }
}
