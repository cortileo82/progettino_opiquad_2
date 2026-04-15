import React from 'react';
import { useForm } from '@inertiajs/react';

// INTERO FILE DI TEST

export default function EditPlan({ plan, exercises_list }: any) {
    
    // 1. INIZIALIZZAZIONE DELLO STATO (Hydration)
    // Invece di partire da zero, mappiamo i dati che arrivano dal database
    const { data, setData, put, processing, errors } = useForm({
        // 1. AGGIUNGIAMO L'USER ID MANCANTE
        user_id: plan.user_id,
        name: plan.name,
        num_weeks: plan.num_weeks,
        // Traduciamo l'array di Laravel (che ha i dati nel 'pivot') nel nostro formato piatto
        exercises: plan.exercises ? plan.exercises.map((ex: any) => ({
            exercise_id: ex.id,
            week_number: ex.pivot.week_number,
            day_of_week: ex.pivot.day_of_week,
            sets: ex.pivot.sets,
            reps: ex.pivot.reps,
            rest_time: ex.pivot.rest_time || ''
        })) : []
    });

    // Stampa nella console di eventuali errori passati da backend
    console.log("🛑 ERRORI DAL DOGANIERE:", errors);

    // 2. HELPER ARRAY (Identici al Create)
    const addExerciseRow = () => {
        setData('exercises', [
            ...data.exercises, 
            { exercise_id: '', week_number: 1, day_of_week: 'Lunedì', sets: 3, reps: '10', rest_time: '60' }
        ]);
    };

    const removeExerciseRow = (indexToRemove: number) => {
        setData('exercises', data.exercises.filter((_, index) => index !== indexToRemove));
    };

    const handleExerciseChange = (index: number, field: string, value: string | number) => {
        const newExercises = [...data.exercises];
        newExercises[index][field] = value;
        setData('exercises', newExercises);
    };

    // 3. INVIO DATI A LARAVEL (Usiamo PUT per l'aggiornamento)
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Attenzione: puntiamo alla rotta di update passando l'ID della scheda
        put(`/pt/plans/${plan.id}`);
    };

    const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white rounded shadow mt-10">
            <h1 className="text-2xl font-bold mb-6">Modifica Scheda: {plan.name}</h1>

            <form onSubmit={submit}>
                
                {/* --- TESTATA SCHEDA --- */}
                <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <div>
                        <label className="block text-sm font-bold mb-2">Nome Scheda</label>
                        <input 
                            type="text" 
                            className="w-full border p-2 rounded"
                            value={data.name} 
                            onChange={e => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Numero Settimane</label>
                        <input 
                            type="number" 
                            min="1"
                            className="w-full border p-2 rounded"
                            value={data.num_weeks} 
                            onChange={e => setData('num_weeks', parseInt(e.target.value))}
                        />
                        {errors.num_weeks && <p className="text-red-500 text-xs mt-1">{errors.num_weeks}</p>}
                    </div>
                </div>

                {/* --- LISTA ESERCIZI DINAMICA --- */}
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Esercizi</h2>
                    <button 
                        type="button" 
                        onClick={addExerciseRow}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        + Aggiungi Esercizio
                    </button>
                </div>

                {errors.exercises && <p className="text-red-500 text-sm mb-4">{errors.exercises}</p>}

                {data.exercises.map((exercise: any, index: number) => (
                    <div key={index} className="grid grid-cols-6 gap-2 items-end mb-4 p-4 border rounded relative bg-gray-50">
                        
                        <button 
                            type="button" 
                            onClick={() => removeExerciseRow(index)}
                            className="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold"
                        >
                            X
                        </button>

                        <div className="col-span-2">
                            <label className="block text-xs font-bold mb-1">Esercizio</label>
                            <select 
                                className="w-full border p-2 rounded text-sm"
                                value={exercise.exercise_id}
                                onChange={e => handleExerciseChange(index, 'exercise_id', parseInt(e.target.value))}
                            >
                                <option value="">Seleziona...</option>
                                {exercises_list.map((ex: any) => (
                                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                                ))}
                            </select>
                            {errors[`exercises.${index}.exercise_id`] && (
                                <p className="text-red-500 text-xs mt-1">Obbligatorio</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">Settimana</label>
                            <input 
                                type="number" min="1" max={data.num_weeks}
                                className="w-full border p-2 rounded text-sm"
                                value={exercise.week_number}
                                onChange={e => handleExerciseChange(index, 'week_number', parseInt(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">Giorno</label>
                            <select 
                                className="w-full border p-2 rounded text-sm"
                                value={exercise.day_of_week}
                                onChange={e => handleExerciseChange(index, 'day_of_week', e.target.value)}
                            >
                                {giorni.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <label className="block text-xs font-bold mb-1">Set</label>
                                <input 
                                    type="number" min="1"
                                    className="w-full border p-2 rounded text-sm"
                                    value={exercise.sets}
                                    onChange={e => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs font-bold mb-1">Reps</label>
                                <input 
                                    type="text"
                                    className="w-full border p-2 rounded text-sm"
                                    value={exercise.reps}
                                    onChange={e => handleExerciseChange(index, 'reps', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">Recupero</label>
                            <input 
                                type="text"
                                className="w-full border p-2 rounded text-sm"
                                value={exercise.rest_time}
                                onChange={e => handleExerciseChange(index, 'rest_time', e.target.value)}
                            />
                        </div>
                    </div>
                ))}

                <div className="mt-8 border-t pt-4">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className={`w-full py-3 rounded font-bold text-white ${processing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {processing ? 'Salvataggio...' : 'Aggiorna Scheda'}
                    </button>
                </div>

            </form>
        </div>
    );
}