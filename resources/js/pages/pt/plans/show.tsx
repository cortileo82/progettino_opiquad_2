import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

interface Props {
    client: { id: number; name: string };
    plan: any; // Il piano con la relazione .exercises inclusa
}

export default function ShowPlan({ client, plan }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'I Miei Atleti', href: '/pt/dashboard' }, { title: 'Dettaglio Scheda', href: '#' }]}>
            <Head title={`Dettaglio Scheda - ${plan.name}`} />
            
            <div className="p-4 md:p-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight uppercase italic">{plan.name}</h1>
                        <p className="text-muted-foreground text-sm">Destinatario: <span className="text-orange-500 font-bold">{client.name}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <Link href={`/pt/clients/${client.id}/plans`} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
                            <ArrowLeft size={14}/> Torna all'elenco
                        </Link>
                        {/* Opzionale: Bottone per andare in modalità modifica */}
                        <Link href={`/pt/plans/${plan.id}/edit`} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-500 hover:text-orange-600">
                            <Edit size={14}/> Modifica Scheda
                        </Link>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Dati Generali (Sola Lettura) */}
                    <div className="bg-sidebar p-6 rounded-2xl border border-sidebar-border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nome Programma</label>
                            <div className="w-full bg-background border border-sidebar-border rounded-xl px-4 py-3 font-bold">{plan.name}</div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Durata Totale (Settimane)</label>
                            <div className="w-full bg-background border border-sidebar-border rounded-xl px-4 py-3 font-bold">{plan.num_weeks}</div>
                        </div>
                    </div>

                    {/* Lista Esercizi */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 pl-1">Esercizi in Programma</h3>
                        {plan.exercises && plan.exercises.map((ex: any, i: number) => (
                            // Qui accediamo ai dati pivot usando ex.pivot.sets, ex.pivot.reps ecc.
                            <div key={i} className="bg-sidebar p-5 rounded-2xl border border-sidebar-border grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-sm">
                                
                                <div className="md:col-span-1">
                                    <label className="text-[10px] font-bold uppercase mb-1 block text-muted-foreground">Sett.</label>
                                    <div className="font-bold">{ex.pivot.week_number}</div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase mb-1 block text-muted-foreground">Giorno</label>
                                    <div className="font-bold">{ex.pivot.day_of_week}</div>
                                </div>

                                <div className="md:col-span-4">
                                    <label className="text-[10px] font-bold uppercase mb-1 block text-muted-foreground">Esercizio</label>
                                    <div className="font-bold text-orange-500 uppercase">{ex.name}</div>
                                </div>

                                <div className="md:col-span-5 grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase mb-1 block text-center text-muted-foreground">Serie</label>
                                        <div className="text-center font-bold">{ex.pivot.sets}</div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase mb-1 block text-center text-muted-foreground">Reps</label>
                                        <div className="text-center font-bold">{ex.pivot.reps}</div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase mb-1 block text-center text-muted-foreground">Recupero</label>
                                        <div className="text-center font-bold">{ex.pivot.rest_time}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}