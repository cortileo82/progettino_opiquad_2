import React from 'react';

export default function ExerciseIndex({ exercises }) {
    // Stampiamo i dati in console per verificare che il Database risponda!
    console.log("Esercizi dal Database:", exercises);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Lista Esercizi (Test)</h1>
            <p>Apri la console (F12) per vedere se i dati sono arrivati!</p>
        </div>
    );
}