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
            ->select('id', 'name', 'email')
            ->orderBy('name') 
            ->paginate(10); // Al posto di get uso paginate per ritornare 10 risultati per volta 

        $numClients = $myClients->count(); 

        return Inertia::render('pt/clients/manage-clients', [ 
            'clients' => $myClients, 
            'stats' => [ 
                'my_clients_count' => $numClients, 
            ] 
        ]); 
    } 
}