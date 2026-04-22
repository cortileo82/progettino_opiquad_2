<?php namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MuscleGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Sicuro perché la rotta è sotto middleware admin
    }

    public function rules(): array
    {
        $param = $this->route('muscle-group');
        // Se è un Oggetto (Model), prendiamo l'ID. Se è già l'ID (numero/stringa), lo usiamo direttamente.
        $muscleGroupId = is_object($param) ? $param->id : $param;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                // Ignore serve perché si ha un unica MuscleGroupRequest per store e update.
                // Serve a evitare il blocco della validazione durante l'update
                // Se si aggiorna un record senza modificare il nome, 
                // allora la query verrebbe tradotta com un tentativo di salvataggio di uno stesso muscle group con id diverso,
                // risultando quindi in un errore (errore 422).
                // Ignore aggiunge la clausola alla query "WHERE ... AND id != id_di_questo_muscle_group".
                // Laravel controlla se il nome esiste già in ALTRI record (non con l'id del muscle group che si sta modificando).
                Rule::unique('muscle_groups', 'name')->ignore($muscleGroupId)
            ],
        ];
    }
}