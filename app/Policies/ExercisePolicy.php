<?php namespace App\Policies;

use App\Models\Exercise;
use App\Models\User;
use App\Enums\Role;

class ExercisePolicy
{
    // Solo l'admin vede la griglia di gestione esercizi
    public function viewAny(User $user): bool {
        return $user->role === Role::ADMIN->value;
    }

    // PT e Admin possono vedere il catalogo
    public function viewCatalog(User $user): bool {
        return in_array($user->role, [Role::ADMIN->value, Role::PT->value]);
    }

    public function create(User $user): bool {
        return $user->role === Role::ADMIN->value;
    }

    public function update(User $user, Exercise $exercise): bool {
        return $user->role === Role::ADMIN->value;
    }

    public function delete(User $user, Exercise $exercise): bool {
        return $user->role === Role::ADMIN->value;
    }
}