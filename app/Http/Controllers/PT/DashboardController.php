<?php
namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $numClients = User::role(User::ROLE_CLIENT)->where('trainer_id', $request->user()->id)->count();
        
        return Inertia::render('pt/dashboard', [
            'stats' => ['my_clients_count' => $numClients]
        ]);
    }
}