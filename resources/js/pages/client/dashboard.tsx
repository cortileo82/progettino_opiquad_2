import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Dumbbell, Calendar, Trophy } from 'lucide-react';

export default function Dashboard() {
    // Recuperiamo i dati dell'utente loggato
    const { auth } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={[{ title: 'Area Personale', href: '/client/dashboard' }]}>
            <Head title="La Mia Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Intestazione di benvenuto */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Bentornato, {auth.user.name}! 
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Pronto per il tuo prossimo allenamento?
                    </p>
                </div>

                {/* Sezione Stato Rapido */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border bg-sidebar p-5 shadow-sm">
                        <div className="rounded-full bg-blue-500/10 p-3 text-blue-600">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Prossima Scadenza</p>
                            <p className="font-bold">Da definire</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border bg-sidebar p-5 shadow-sm">
                        <div className="rounded-full bg-green-500/10 p-3 text-green-600">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Obiettivo</p>
                            <p className="font-bold">In corso</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border bg-sidebar p-5 shadow-sm">
                        <div className="rounded-full bg-orange-500/10 p-3 text-orange-600">
                            <Dumbbell size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Scheda Attiva</p>
                            <p className="font-bold">
                                {auth.user.trainer_id ? "In elaborazione" : "Nessun PT assegnato"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Area Scheda di Allenamento */}
                <div className="flex-1 rounded-2xl border border-sidebar-border bg-sidebar/50 p-8 flex flex-col items-center justify-center text-center">
                    <div className="max-w-md">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Dumbbell className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold">Visualizzazione Scheda</h2>
                        <p className="mt-2 text-muted-foreground">
                            {auth.user.trainer_id 
                                ? "Il tuo coach non ha ancora pubblicato una scheda per te."
                                : "Contatta la segreteria per farti assegnare un Personal Trainer e iniziare il tuo percorso."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}