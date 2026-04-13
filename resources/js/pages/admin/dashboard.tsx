import React from 'react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">👑 Benvenuto Super Admin!</h1>
                <p className="text-gray-700">Questa è la tua area protetta. Il routing funziona!</p>
            </div>
        </div>
    );
}