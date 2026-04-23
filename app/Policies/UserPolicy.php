<?php 

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Può vedere la lista degli utenti?
     */
    public function viewAny(User $user): bool
    {
        return $user->can('users:read:any') || $user->can('users:read:own');
    }

    /**
     * Può vedere i dettagli di uno specifico utente (es. profilo)?
     */
    public function view(User $user, User $model): bool
    {
        if ($user->can('users:read:any')) return true;

        if ($user->can('users:read:own')) {
            // È se stesso OPPURE è un suo cliente
            return $user->id === $model->id || $user->id === $model->trainer_id;
        }

        return false;
    }

    /**
     * Può creare un nuovo utente?
     */
    public function create(User $user): bool
    {
        return $user->can('users:create');
    }

    /**
     * Può aggiornare i dati di uno specifico utente?
     */
    public function update(User $user, User $model): bool
    {
        if ($user->can('users:update:any')) return true;

        if ($user->can('users:update:own')) {
            // È se stesso (per cambiare la propria password) OPPURE è un suo cliente
            return $user->id === $model->id || $user->id === $model->trainer_id;
        }

        return false;
    }

    /**
     * Può cancellare uno specifico utente?
     */
    public function delete(User $user, User $model): bool
    {
        // Regola suprema per tutti: nessuno può cancellare se stesso (prevenzione suicidio digitale)
        if ($user->id === $model->id) {
            return false;
        }

        // Solo chi ha l'autorità assoluta (es. Admin) può cancellare account in questo dominio
        return $user->can('users:delete:any');
    }
}