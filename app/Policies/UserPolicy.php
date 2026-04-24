<?php 

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    // Permessso vista utenti (es.: clienti propri)
    public function viewAny(User $user): bool
    {
        return $user->can('users:read:any') || $user->can('users:read:own');
    }

    // Permesso vista dettagli di un utente
    public function view(User $user, User $model): bool
    {
        if ($user->can('users:read:any')) return true;

        if ($user->can('users:read:own')) {
            // È se stesso OPPURE è un suo cliente
            return $user->id === $model->id || $user->id === $model->trainer_id;
        }

        return false;
    }

    // Permesso creazione di un utente
    public function create(User $user): bool
    {
        return $user->can('users:create');
    }

    // Permesso aggiornamento di un utente
    public function update(User $user, User $model): bool
    {
        if ($user->can('users:update:any')) return true;

        if ($user->can('users:update:own')) {
            // È se stesso (per cambiare la propria password) OPPURE è un suo cliente
            return $user->id === $model->id || $user->id === $model->trainer_id;
        }

        return false;
    }

    // Permesso cancellaizone di un utente
    public function delete(User $user, User $model): bool
    {
        // Regola per tutti: nessuno può cancellare se stesso (prevenzione suicidio digitale)
        if ($user->id === $model->id) {
            return false;
        }

        // Solo chi ha l'autorità assoluta (es. Admin) può cancellare account
        return $user->can('users:delete:any');
    }
}