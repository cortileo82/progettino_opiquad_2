<?php

namespace App\Policies;

use App\Models\User;
use App\Models\MuscleGroup;

class MuscleGroupPolicy
{
    public function viewAny(User $user): bool {
        return $user->can('muscle-groups:read');
    }

    public function create(User $user): bool {
        return $user->can('muscle-groups:create');
    }

    public function update(User $user, MuscleGroup $muscleGroup): bool {
        return $user->can('muscle-groups:update');
    }

    public function delete(User $user, MuscleGroup $muscleGroup): bool {
        return $user->can('muscle-groups:delete');
    }
}
