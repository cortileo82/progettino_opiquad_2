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
        
        $availableClients = User::isClient()
            ->free()                            // Metodo del Model che restituisce gli utenti senza PT assegnati
            ->select('id', 'name', 'email')     // Ottimizzazione memoria: si evita di caricare colonne come la password, token o ID
            ->orderBy('name')                   // Ordinamento
            ->get();                            // Ottenimenti di tutti i risultati

        return Inertia::render('pt/clients/assign', [
            'availableClients' => $availableClients
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('users:take-free-client');

        $validated = $request->validate([
            'client_id' => [
                'required',
                'integer',
                // Sicurezza: Il DB deve confermare che l'ID esiste E che non ha già un trainer
                // Questo previene hack dove un PT altera l'HTML per rubare il cliente di un altro
                Rule::exists('users', 'id')->whereNull('trainer_id')
            ],
        ]);

        // Si applica nuovamente lo scope di Spatie 
        // per assicurarci che l'ID passato non sia quello di un altro Admin o PT
        $client = User::role(User::ROLE_CLIENT)->findOrFail($validated['client_id']);

        $client->update([
            'trainer_id' => $request->user()->id
        ]);

        return redirect()->route('pt.clients.manage-clients')
            ->with('success', "Hai preso in carico l'atleta {$client->name} con successo!");
    }
}