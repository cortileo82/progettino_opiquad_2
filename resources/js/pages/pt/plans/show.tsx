import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Dumbbell, Calendar, LayoutList, Clock, Repeat } from 'lucide-react';

interface Props {
    client: { id: number; name: string };
    plan: any; 
}

export default function ShowPlan({ client, plan }: Props) {
    return (
            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                
                {/* HEADER SEZIONE */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-sidebar-border pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md">
                                Scheda
                            </span>
                        </div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                            {plan.name}
                        </h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 opacity-70">
                            Atleta: <span className="text-foreground underline decoration-primary/50 decoration-2">{client.name}</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link 
                            href={`/pt/clients/${client.id}/plans`} 
                            className="group flex items-center gap-2 text-[10px] font-black uppercase italic text-zinc-400 hover:text-black transition-all tracking-widest"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Torna all'elenco
                        </Link>
                        
                        <Link 
                            href={`/pt/plans/${plan.id}/edit`} 
                            className="flex items-center gap-3 bg-zinc-950 text-white px-6 py-3 rounded-2xl hover:bg-zinc-900 transition-all shadow-xl active:scale-95 border border-white/5"
                        >
                            <Edit size={14} />
                            <span className="font-black uppercase italic text-xs tracking-widest">Modifica</span>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-10">
                    {/* INFO GENERALI - READ ONLY CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-sidebar border border-sidebar-border rounded-[2rem] p-6 flex items-center gap-6 shadow-sm">
                            <div className="p-4 bg-background rounded-2xl text-primary">
                                <LayoutList size={24} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase italic text-muted-foreground tracking-widest mb-1">Nome Programma</p>
                                <p className="text-xl font-black uppercase italic tracking-tight">{plan.name}</p>
                            </div>
                        </div>

                        <div className="bg-sidebar border border-sidebar-border rounded-[2rem] p-6 flex items-center gap-6 shadow-sm">
                            <div className="p-4 bg-background rounded-2xl text-primary">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase italic text-muted-foreground tracking-widest mb-1">Durata Ciclo</p>
                                <p className="text-xl font-black uppercase italic tracking-tight">{plan.num_weeks} Settimane</p>
                            </div>
                        </div>
                    </div>

                    {/* LISTA ESERCIZI */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pl-4">
                            <Dumbbell size={20} className="text-primary" />
                            <h3 className="font-black uppercase italic text-sm tracking-widest">Protocollo Esercizi</h3>
                        </div>

                        <div className="grid gap-4">
                            {plan.exercises && plan.exercises.map((ex: any, i: number) => (
                                <div key={i} className="bg-sidebar border border-sidebar-border rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:border-primary/30 transition-all group overflow-hidden relative">
                                    
                                    {/* INFO ESERCIZIO */}
                                    <div className="flex items-center gap-6 md:w-1/3 relative z-10">
                                        <div className="flex flex-col items-center justify-center bg-background rounded-2xl h-16 w-16 shrink-0 border border-sidebar-border">
                                            <span className="text-[8px] font-black uppercase text-muted-foreground leading-none">SETT.</span>
                                            <span className="text-xl font-black italic">{ex.pivot.week_number}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase italic text-primary tracking-widest mb-1 leading-none">{ex.pivot.day_of_week}</p>
                                            <h4 className="text-xl font-black uppercase italic tracking-tighter leading-none">{ex.name}</h4>
                                        </div>
                                    </div>

                                    {/* DATI TECNICI (Griglia stats) */}
                                    <div className="grid grid-cols-4 gap-4 md:gap-12 relative z-10">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                                <Repeat size={12} />
                                                <span className="text-[9px] font-black uppercase italic tracking-tighter">Serie</span>
                                            </div>
                                            <span className="text-2xl font-black italic tabular-nums leading-none">{ex.pivot.sets}</span>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                                <LayoutList size={12} />
                                                <span className="text-[9px] font-black uppercase italic tracking-tighter">Reps</span>
                                            </div>
                                            <span className="text-2xl font-black italic tabular-nums leading-none">{ex.pivot.reps}</span>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                                <Dumbbell size={12} />
                                                <span className="text-[9px] font-black uppercase italic tracking-tighter">Kg</span>
                                            </div>
                                            <span className="text-2xl font-black italic tabular-nums leading-none text-primary">
                                                {ex.pivot.weight_kg ? ex.pivot.weight_kg : '-'}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                                <Clock size={12} />
                                                <span className="text-[9px] font-black uppercase italic tracking-tighter">Rest</span>
                                            </div>
                                            <span className="text-2xl font-black italic tabular-nums leading-none">{ex.pivot.rest_time}</span>
                                        </div>
                                    </div>

                                    {/* DECORAZIONE BACKGROUND */}
                                    <div className="absolute -right-4 -bottom-6 text-primary/5 font-black italic text-8xl select-none pointer-events-none group-hover:text-primary/10 transition-colors uppercase">
                                        {i + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FOOTER DECORATIVO */}
                <div className="mt-10 pt-10 border-t border-sidebar-border flex flex-col items-center gap-4 text-center">
                    <p className="text-[9px] font-black uppercase italic opacity-20 tracking-[0.5em]">
                        TEMPRA Performance Lab
                    </p>
                </div>
            </div>
    );
}