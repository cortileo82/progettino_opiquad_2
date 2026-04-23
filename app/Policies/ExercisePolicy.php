<?php namespace App\Policies;

use App\Models\Exercise;
use App\Models\User;
use App\Enums\Role;

class ExercisePolicy
{
    public function viewAny(User $user): bool {
        return $user->can('exercises:read');
    }

    public function viewCatalog(User $user): bool {
        return $user->can('exercises:read');
    }

    public function create(User $user): bool {
        return $user->can('exercises:create');
    }

    public function update(User $user, Exercise $exercise): bool {
        return $user->can('exercises:update');
    }

    public function delete(User $user, Exercise $exercise): bool {
        return $user->can('exercises:delete');
    }
}