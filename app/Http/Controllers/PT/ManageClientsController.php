<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManageClientsController extends Controller 
{ 
    public function __invoke(Request $request) 
    { 
        Gate::authorize('viewAny', User::class);

        $myClients = User::role(User::ROLE_CLIENT)
            ->where('trainer_id', $request->user()->id)
            // 1. Logica di ricerca (Nome o Email)
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->select('id', 'name', 'email')
            ->orderBy('name') 
            ->paginate(10)
            ->withQueryString(); // Fondamentale per mantenere il filtro tra le pagine

        return Inertia::render('pt/clients/manage-clients', [ 
            'clients' => $myClients, 
            // 2. Passiamo i filtri (risolve l'errore undefined search)
            'filters' => $request->only(['search']),
            'stats' => [ 
                // Usiamo total() per contare tutti gli atleti, non solo quelli in pagina
                'my_clients_count' => $myClients->total(), 
            ] 
        ]); 
    } 
}