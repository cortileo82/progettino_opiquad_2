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
        $roleId = $this->route('route')?->id;

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('roles', 'name')->ignore($roleId)],
            // Si valida che l'input 'permissions' sia un array
            'permissions' => ['nullable', 'array'],
            // Si valida che ogni elemento dell'array esista davvero nel DB di Spatie
            'permissions.*' => ['string', 'exists:permissions,name']
        ];
    }
}
