<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index() {
        // Da aggiungere un Gate

        $permissions = Permission::all();

        return Inertia::render('admin/permission/index', [
            'permissions' => $permissions,
        ]);
    }
}
