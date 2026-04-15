import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Clock, Dumbbell, Calendar, Trophy, ChevronDown, CheckCircle2, History } from 'lucide-react';

// Interfacce per TypeScript
interface Exercise {
    id: number;
    name: string;
    pivot: {
        sets: number;
        reps: string;
        rest_time: string;
        day_of_week: string;
    };
}

interface Plan {
    id: number;
    name: string;
    is_active: boolean;
    start_date: string;
    end_date: string;
    days: Record<string, Exercise[]>;
}

interface Props {
    activePlan: Plan | null;
    pastPlans: Plan[];
    assignedTrainer: string;
}

export default function Dashboard({ activePlan = null, pastPlans = [] }: Props) {
    // Recuperiamo i dati dell'utente loggato
    const { auth } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={[{ title: 'Area Personale', href: '/client/dashboard' }]}>
            <Head title="La Mia Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto">
                {/* Intestazione di benvenuto */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Bentornato, {auth.user.name}! 
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {activePlan ? "Pronto per il tuo prossimo allenamento?" : "Visualizza il tuo stato e i tuoi progressi."}
                    </p>
                </div>

                {/* Sezione Stato Rapido - Dinamica */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border bg-sidebar p-5 shadow-sm">
                        <div className="rounded-full bg-blue-500/10 p-3 text-blue-600">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Scadenza Scheda</p>
                            <p className="font-bold">{activePlan ? activePlan.end_date : "Nessuna"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border bg-sidebar p-5 shadow-sm">
                        <div className="rounded-full bg-green-500/10 p-3 text-green-600">
                            <Trophy size={24} />
                        </div>
                       <div>
                            <p className="text-sm font-medium text-muted-foreground">Personal Trainer</p>
                            <p className="font-bold">
                                {auth.user.trainer ? auth.user.trainer.name : "Non assegnato"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border bg-sidebar p-5 shadow-sm">
                        <div className="rounded-full bg-orange-500/10 p-3 text-orange-600">
                            <Dumbbell size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Scheda Attiva</p>
                            <p className="font-bold">
                                {activePlan ? activePlan.name : (auth.user.trainer_id ? "In elaborazione" : "Nessun PT")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Area Scheda di Allenamento */}
                <div className="flex-1 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-orange-500" />
                        Il tuo Programma
                    </h2>

                    {activePlan ? (
                        <div className="grid gap-3">
                            {/* Ciclo sui giorni della settimana */}
                            {Object.entries(activePlan.days).map(([day, exercises]) => (
                                <details 
                                    key={day} 
                                    className="group bg-sidebar border border-sidebar-border rounded-2xl overflow-hidden transition-all duration-200"
                                >
                                    <summary className="list-none p-5 flex justify-between items-center cursor-pointer hover:bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                                            <span className="font-bold uppercase tracking-wide">{day}</span>
                                        </div>
                                        <ChevronDown size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
                                    </summary>

                                    <div className="p-4 pt-0 space-y-3 border-t border-sidebar-border/50 bg-muted/20">
                                        {exercises.map((ex, index) => (
                                            <div 
                                                key={index} 
                                                className="bg-sidebar p-4 rounded-xl border border-sidebar-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                            >
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-sm uppercase">{ex.name}</h4>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={12} className="text-orange-500" /> 
                                                            Recupero: {ex.pivot.rest_time}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-6">
                                                    <div className="text-center">
                                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Serie</p>
                                                        <p className="font-mono font-bold text-sm">{ex.pivot.sets}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Reps</p>
                                                        <p className="font-mono font-bold text-sm">{ex.pivot.reps}</p>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-sidebar-border bg-sidebar/50 p-12 flex flex-col items-center justify-center text-center">
                            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <Dumbbell className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">Nessuna scheda attiva</h3>
                            <p className="mt-2 text-muted-foreground max-w-xs">
                                {auth.user.trainer_id 
                                    ? "Il tuo coach non ha ancora pubblicato una scheda valida per questo periodo."
                                    : "Contatta la segreteria per farti assegnare un Personal Trainer."
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* Sezione Storico (appare solo se ci sono piani passati) */}
                {Array.isArray(pastPlans) && pastPlans.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-sidebar-border">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                            <History size={16} /> Storico Allenamenti
                        </h3>
                        <div className="grid gap-2 md:grid-cols-2">
                            {pastPlans.map((plan) => (
                                <div key={plan.id} className="p-4 bg-sidebar/30 border border-sidebar-border rounded-xl flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
                                    <div>
                                        <p className="font-bold text-xs uppercase">{plan.name}</p>
                                        <p className="text-[10px] text-muted-foreground italic">Terminata il {plan.end_date}</p>
                                    </div>
                                    <div className="text-[10px] bg-muted px-2 py-1 rounded font-bold uppercase">Archiviata</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}