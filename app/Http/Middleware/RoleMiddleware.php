<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Controllo se l'utente non è loggato o se il suo ruolo è sbagliato
        if(! $request->user() || $request->user()->role !== $role) {
            // Solo se è l'admin lo si fa passare comunque dovunqueà
            if($request->user() && $request->user()->role === 'admin') {
                return $next($request);
            }

            // Per chi non è admin si blocca la richiesta con errore 403
            abort(403, 'Access denied. You do not have permission to view this page.');
        }

        // Se è tutto a posto si fa passare la richiesta
        return $next($request);
    }
}
