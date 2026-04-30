<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ClientAssignmentController extends Controller
{
    public function index(Request $request) 
    {
        Gate::authorize('users:take-free-client');
        
        $availableClients = User::isClient()    // Usa lo scope definito nel Model
            ->free()                            // Metodo del Model che restituisce gli utenti senza PT assegnati
            ->search($request->search)          // Applicazione filtri se l'utente sta cercando
            ->select('id', 'name', 'email')     // Ottimizzazione memoria: si evita di caricare colonne come la password, token o ID
            ->orderBy('name')                   // Ordinamento
            ->get();

        return Inertia::render('pt/clients/assign', [
            'availableClients' => $availableClients,
            'filters' => [
                'search' => $request->search ?? ''
            ]
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('users:take-free-client');

        $validated = $request->validate([
            'client_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) {
                    // La validazione deve essere speculare alla query della index
                    $query->whereNull('trainer_id')
                          ->orWhere('trainer_id', '');
                })
            ],
        ]);

        $client = User::findOrFail($validated['client_id']);

        // 3. Verifichiamo che l'utente sia effettivamente un CLIENT
        if (!$client->hasRole(User::ROLE_CLIENT)) {
             abort(403, "L'utente selezionato non è un atleta.");
        }

        $client->update([
            'trainer_id' => $request->user()->id
        ]);

        return redirect()->route('pt.clients.index')
            ->with('success', "Hai preso in carico l'atleta {$client->name} con successo!");
    }
}