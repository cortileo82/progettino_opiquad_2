<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Exercise;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_clients' => User::role(User::ROLE_CLIENT)->count(),
                'total_pts' => User::role(User::ROLE_PT)->count(),
                'total_exercises' => Exercise::count(),
                'total_workouts' => Plan::count(),
            ],
            'exercises' => Exercise::with('muscleGroup')->latest()->take(10)->get(),
        ]);
    }
}