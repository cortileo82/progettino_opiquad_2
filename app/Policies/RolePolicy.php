<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    // Definiamo i ruoli intoccabili
    private array $protectedRoles = [
        User::ROLE_ADMIN,
        User::ROLE_PT,
        User::ROLE_CLIENT,
    ];

    public function viewAny(User $user): bool
    {
        return $user->can('roles:read');
    }

    public function create(User $user): bool
    {
        return $user->can('roles:create');
    }

    public function update(User $user, Role $role): bool
    {
        // Regola di business: i ruoli strutturali non si possono toccare dal pannello web
        if (in_array($role->name, $this->protectedRoles)) {
            return false; 
        }

        return $user->can('roles:update');
    }

    public function delete(User $user, Role $role): bool
    {
        // Regola di business: i ruoli core non si possono cancellare
        if (in_array($role->name, $this->protectedRoles)) {
            return false;
        }

        return $user->can('roles:delete');
    }
}
