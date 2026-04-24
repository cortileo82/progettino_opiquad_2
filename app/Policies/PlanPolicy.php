<?php namespace App\Policies;

use App\Models\Plan;
use App\Models\User;

class PlanPolicy
{
    public function viewAny(User $user): bool {
        return $user->can('plans:read');
    }

    public function view(User $user, Plan $plan): bool
    {
        // 1. Si fa passare l'Admin
        if ($user->can('plans:read:any')) {
            return true;
        }

        // 2. Si fa passare chi il permesso di leggere le schede che gli riguardano
        if ($user->can('plans:read:own')) {
            
            // Può vederla se: è il cliente (proprietario) || è il PT che l'ha creata || è l'attuale PT assegnato al cliente.
            return $user->id === $plan->user_id                                 // Cliente proprietario della scheda
                || $user->id === $plan->pt_id                                   // PT creatore della scheda
                || ($plan->client && $user->id === $plan->client->trainer_id);  // PT attuale del cliente
                                                // Nessun User::find(), perché si usa la relazione definita nel Model.
                                                // Si controlla che il client esista (->client) prima di chiamarne la proprietà (->trainer_id)
                
        }

        // 3. Fallback di sicurezza
        return false;
    }

    public function create(User $user, User $client): bool
    {
        return $user->can('plans:create');
    }

    public function update(User $user, Plan $plan): bool
    {
        // 1. Si fa passare l'Admin
        if ($user->can('plans:update:any')) {
            return true;
        }

        // 2. Si fa passare chi il permesso di leggere le schede che gli riguardano
        if ($user->can('plans:update:own')) {
            
            // Può vederla se: è il cliente (proprietario) || ( è il PT che l'ha creata && è l'attuale PT assegnato al cliente ).
            return $user->id === $plan->user_id                                         // Cliente proprietario della scheda
                || ( $user->id === $plan->pt_id                                         // PT creatore della scheda
                    && ($plan->client && $user->id === $plan->client->trainer_id) );    // PT attuale del cliente
                                                // Nessun User::find(), perché si usa la relazione definita nel Model.
                                                // Si controlla che il client esista (->client) prima di chiamarne la proprietà (->trainer_id)
                
        }

        // 3. Fallback di sicurezza
        return false;
    }

    public function delete(User $user, Plan $plan): bool
    {
        if (!$plan->client) {
            return false;
        }

        // Un PT può modificare solo le schede che ha creato lui || che sono di suoi clienti attuali
        return $user->id === $plan->pt_id 
            || ($plan->client && $user->id === $plan->client->trainer_id);
    }
}