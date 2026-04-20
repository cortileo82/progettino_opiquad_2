<?php namespace App\Policies;

use App\Models\User;
use App\Enums\Role;

class UserPolicy
{
    // Solo l'admin può vedere la lista utenti
    public function viewAny(User $user): bool {
        return $user->role === Role::ADMIN->value;
    }

    // Regola custom (già corretta)
    public function viewPlans(User $user, User $client): bool {
        return $user->id === $client->trainer_id;
    }

    // Solo l'admin può creare utenti
    public function create(User $user): bool {
        return $user->role === Role::ADMIN->value;
    }

    // Solo l'admin può modificare utenti
    public function update(User $user, User $model): bool {
        return $user->role === Role::ADMIN->value;
    }

    // L'admin può cancellare, MA non se stesso
    public function delete(User $user, User $model): bool {
        return $user->role === Role::ADMIN->value && $user->id !== $model->id;
    }

    public function restore(User $user, User $model): bool {
        return false;
    }

    public function forceDelete(User $user, User $model): bool {
        return false;
    }
}