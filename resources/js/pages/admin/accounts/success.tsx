import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { LayoutDashboard, CheckCircle } from 'lucide-react';

export default function Success() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Account', href: '/admin/accounts' }]}>
            <Head title="Utente Creato" />

            <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
                
                {/* Icona di conferma semplice, coerente con lo stile */}
                <div className="mb-6 text-green-500">
                    <CheckCircle size={64} strokeWidth={1} />
                </div>

                {/* TESTO RICHIESTO: Stile Palestra/Premium */}
                <h1 className="mb-10 text-5xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                    Hai creato un nuovo utente!
                </h1>

                {/* PULSANTE RICHIESTO: Torna alla Dashboard (Senza Ziggy) */}
                <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-3 rounded-xl bg-orange-600 px-8 py-4 font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-orange-700 active:scale-95"
                >
                    <LayoutDashboard size={20} />
                    Torna alla Dashboard
                </Link>
            </div>
        </AppLayout>
    );
}