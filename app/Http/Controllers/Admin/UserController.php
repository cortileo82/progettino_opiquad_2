<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('trainer')->latest()->get();
        return Inertia::render('admin/accounts/index', ['users' => $users]);
    }

    public function create()
    {
        $personalTrainers = User::where('role', 'pt')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/accounts/create', [
            'personalTrainers' => $personalTrainers
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,pt,client',
            'pt_id' => 'nullable|exists:users,id',
        ]);

        User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'trainer_id' => $validated['role'] === 'client' ? $validated['pt_id'] : null,
        ]);

        return redirect()->route('admin.accounts.index')->with('success', 'Utente creato.');
    }
}