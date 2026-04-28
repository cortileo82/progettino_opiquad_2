import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Edit, Dumbbell, Calendar, LayoutList, Clock, Repeat, ClipboardList } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';

interface Props {
    client: { id: number; name: string };
    plan: any;
}

export default function ShowPlan({ client, plan }: Props) {
    return (
        // FIX SINTASSI: Rimossi i ";" alla fine delle prop
        <AppLayout breadcrumbs={[{ title: 'I Miei Atleti', href: '/pt/clients/manage-clients' }, { title: 'Dettaglio Scheda', href: '#' }]}>
            <Head title={`Scheda: ${plan.name}`} />
            
            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                <HeaderNew 
                    title={plan.name.toUpperCase()} 
                    subtitle={`Visualizzazione dettagli della scheda assegnata a: ${client.name.toUpperCase()}`} 
                    icon={ClipboardList} 
                    actions={
                        <div className="flex items-center gap-4">
                            <Link href={`/pt/clients/${client.id}/plans`} className="group flex items-center gap-2 text-[10px] font-black uppercase italic text-muted-foreground hover:text-foreground transition-all tracking-widest bg-sidebar border border-sidebar-border px-4 py-2 rounded-xl">
                                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Elenco
                            </Link>
                            <Link href={`/pt/plans/${plan.id}/edit`} className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-2 rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95">
                                <Edit size={14} />
                                <span className="font-black uppercase italic text-[10px] tracking-widest">Modifica</span>
                            </Link>
                        </div>
                    } 
                />
                
                <div className="grid gap-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-sidebar border border-sidebar-border rounded-[2rem] p-6 flex items-center gap-6 shadow-sm">
                            <div className="p-4 bg-background rounded-2xl text-primary shrink-0">
                                <LayoutList size={24} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase italic text-muted-foreground tracking-widest mb-1">Nome Scheda</p>
                                <p className="text-xl font-black uppercase italic tracking-tight leading-none">{plan.name}</p>
                            </div>
                        </div>
                        <div className="bg-sidebar border border-sidebar-border rounded-[2rem] p-6 flex items-center gap-6 shadow-sm">
                            <div className="p-4 bg-background rounded-2xl text-primary shrink-0">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase italic text-muted-foreground tracking-widest mb-1">Durata Scheda</p>
                                <p className="text-xl font-black uppercase italic tracking-tight leading-none">{plan.num_weeks} Settimane</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pl-4">
                            <Dumbbell size={20} className="text-primary" />
                            <h3 className="font-black uppercase italic text-sm tracking-widest">Protocollo Esercizi</h3>
                        </div>
                        
                        <div className="grid gap-4">
                            {plan.exercises && plan.exercises.map((ex: any, i: number) => (
                                <div key={i} className="bg-sidebar border border-sidebar-border rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:border-primary/30 transition-all group overflow-hidden relative">
                                    <div className="flex items-center gap-6 md:w-1/3 relative z-10">
                                        <div className="flex flex-col items-center justify-center bg-background rounded-2xl h-16 w-16 shrink-0 border border-sidebar-border shadow-inner">
                                            <span className="text-[8px] font-black uppercase text-muted-foreground leading-none">SETT.</span>
                                            <span className="text-xl font-black italic">{ex.pivot.week_number}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase italic text-primary tracking-widest mb-1 leading-none">
                                                {ex.pivot.day_of_week}
                                            </p>
                                            <h4 className="text-xl font-black uppercase italic tracking-tighter leading-none">
                                                {ex.name}
                                            </h4>
                                        </div>
                                    </div>
                                    
                                    {/* LA TUA LOGICA: Ripristinati i 4 blocchi (grid-cols-4) con il campo Kg */}
                                    <div className="grid grid-cols-4 gap-4 md:gap-8 relative z-10 w-full md:w-auto mt-4 md:mt-0">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                                <span className="text-[9px] font-black uppercase italic tracking-tighter text-center">Serie</span>
                                            </div>
                                            <span className="text-2xl font-black italic tabular-nums leading-none">{ex.pivot.sets}</span>
                                        </div>
                                        
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                                <span className="text-[9px] font-black uppercase italic tracking-tighter text-center">Reps</span>
                                            </div>
                                            <span className="text-2xl font-black italic tabular-nums leading-none">{ex.pivot.reps}</span>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1 text-primary mb-1">
                                                <Dumbbell size={12} />
                                                <span className="text-[9px] font-black uppercase italic tracking-tighter text-center">Kg</span>
                                            </div>
                                            <span className="text-2xl font-black italic tabular-nums leading-none text-primary">
                                                {ex.pivot.weight_kg ? ex.pivot.weight_kg : '-'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                                <span className="text-[9px] font-black uppercase italic tracking-tighter text-center">Rest (s)</span>
                                                <Clock size={12} />
                                                <span className="text-[9px] font-black uppercase italic tracking-tighter text-center">Rest</span>
                                            </div>
                                            <span className="text-2xl font-black italic tabular-nums leading-none">{ex.pivot.rest_time}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute -right-4 -bottom-6 text-primary/5 font-black italic text-8xl select-none pointer-events-none group-hover:text-primary/10 transition-colors uppercase">
                                        {i + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="mt-10 pt-10 border-t border-sidebar-border flex flex-col items-center gap-4 text-center">
                    <p className="text-center text-[9px] font-black uppercase italic opacity-20 tracking-[0.5em]"> TEMPRA Performance Lab - Sistema di Programmazione </p>
                </div>
            </div>
        </AppLayout>
    );
}