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
        Gate::authorize('viewOwnClients', User::class);
        
        $myClients = User::isClient()
            ->assignedTo($request->user()->id)  // Metodo del Model per ottenere i clienti di tale PT
            ->search($request->search)          // Applicazione filtri se l'utente sta cercando
            ->select('id', 'name', 'email')     // Ottimizzazione memoria: si evita di caricare colonne come la password, token o ID
            ->orderBy('name')                   // Ordinamento
            ->paginate()                        // Paginazione definita nel Model (varabile "$perPage")
            ->withQueryString();                // e aggiunta link per le pagine successive

        return Inertia::render('pt/clients/manage-clients', [
            'clients' => $myClients,
            'filters' => $request->only(['search']),
            'stats' => ['my_clients_count' => $myClients->total()]
        ]);
    }
}