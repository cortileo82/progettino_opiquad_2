<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use App\Models\User; 
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
{
    // Determine if the user is authorized to make this request.
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Si stabilisce se si sta modificando un ruolo esistente estraendolo dalla rotta
        $role = $this->route('role');
        $roleId = is_object($role) ? $role->id : $role;

        return [
            'name' => [
                'required', 
                'string', 
                'max:255', 
                // Se l'ID esiste (modifica), lo si ignora nel controllo unique. 
                // Se non esiste (creazione), si fa il controllo normale.
                Rule::unique('roles', 'name')->ignore($roleId) 
            ],
            'permissions' => ['nullable', 'array'],
        ];
    }
}
