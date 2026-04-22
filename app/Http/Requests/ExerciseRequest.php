<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use App\Enums\MuscleGroup;
use App\Enums\Role; 

class ExerciseRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Se la rotta ha un parametro 'exercise', siamo in fase di Update
        if ($this->route('exercise')) {
            return Gate::allows('update', $this->route('exercise'));
        }

        // Altrimenti siamo in fase di Create (Store)
        return Gate::allows('create', Exercise::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ];
    }
}            'muscle_group' => 'required|exists:muscle_groups,id',
