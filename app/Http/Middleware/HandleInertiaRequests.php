<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            
            'auth' => [
                // Lazy Evaluation (fn() =>)
                // Il server calcola questi dati solo un millisecondo prima di inviare il JSON.
                'user' => fn () => $request->user() ? [
                    // DTO (Data Transfer Object)
                    // Si seleziona chirurgicamente solo i dati sicuri.
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'is_premium' => $request->user()->is_premium,
                    
                    // Incapsulamento
                    // Ruoli e permessi vivono DENTRO l'oggetto user.
                    'role' => $request->user()->roles->first()?->name,
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                ] : null,
            ],
            
            // Lazy Evaluation anche per la lettura dei cookie
            'sidebarOpen' => fn () => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}