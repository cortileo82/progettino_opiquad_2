import React from 'react';

// 1. Definiamo cosa ci aspettiamo che sia un "Exercise"
interface Exercise {
    id: number;
    name: string;
    muscle_group: string;
    description?: string;
}

// 2. Definiamo le Props del componente
interface Props {
    exercises: Exercise[];
}

export default function ExerciseIndex({ exercises }: Props) {
    // Ora TypeScript sa che exercises è un array di oggetti!
    console.log("Esercizi dal Database:", exercises);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 italic uppercase">Lista Esercizi (Test)</h1>
            
            <ul className="mt-4 space-y-2">
                {exercises.map((ex) => (
                    <li key={ex.id} className="p-2 bg-sidebar border border-sidebar-border rounded">
                        {ex.name} - <span className="text-orange-500 text-xs">{ex.muscle_group}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}