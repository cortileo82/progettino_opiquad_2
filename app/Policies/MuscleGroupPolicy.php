<?php

namespace App\Policies;

use App\Models\User;

class MuscleGroupPolicy
{
    public function viewAny(User $user): bool {
        return $user->can('muscle-groups:read');
    }

    public function create(User $user): bool {
        return $user->can('muscle-groups:create');
    }

    public function update(User $user, Exercise $exercise): bool {
        return $user->can('muscle-groups:update');
    }

    public function delete(User $user, Exercise $exercise): bool {
        return $user->can('muscle-groups:delete');
    }
}
