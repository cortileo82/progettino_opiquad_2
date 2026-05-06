import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function Success() {
    return (
        <AppLayout>
            <Head title="Pagamento Riuscito" />
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
                <CheckCircle size={80} className="text-green-500 mb-6" />
                <h1 className="text-3xl font-black italic uppercase text-zinc-900 mb-2">Pagamento Riuscito!</h1>
                <p className="text-zinc-500 mb-8 text-center max-w-md">
                    Il tuo account è in fase di aggiornamento. Potrebbe volerci qualche istante.
                </p>
                <Link href="/client/dashboard" className="bg-black text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-zinc-800 transition-colors">
                    Torna alla Dashboard
                </Link>
            </div>
        </AppLayout>
    );
}