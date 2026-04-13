import React from 'react';

export default function ExerciseCreate({ muscleGroups }) {
    // Stampiamo i gruppi muscolari per verificare che l'Enum funzioni!
    console.log("Gruppi Muscolari dall'Enum:", muscleGroups);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Crea Esercizio (Test)</h1>
            <p>Apri la console (F12) per vedere se l'Enum è arrivato!</p>
        </div>
    );
}