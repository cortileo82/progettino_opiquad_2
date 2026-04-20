import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { History, Calendar, ChevronDown, Info, ArrowRight, UserCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

interface Plan {
    id: number;
    name: string;
    num_weeks: number;
    created_at: string;
    trainer?: { name: string };
}

interface Props {
    pastPlans: Plan[];
}

export default function HistoryIndex({ pastPlans = [] }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Storico Schede', href: '/client/history' }]}>
            <Head title="Storico Schede" />
            
            <div className="w-full p-6 md:p-10">
                
                {/* Header Uniformato - Copiato da ExerciseIndex */}
                <div className="mb-10 border-b border-sidebar-border pb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground leading-none">
                                Storico Schede
                            </h1>
                            <p className="text-muted-foreground text-[10px] font-bold mt-2 uppercase tracking-[0.2em] opacity-70">
                                Archivio storico delle schede.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista Cards - Stile identico a ExerciseIndex */}
                <div className="space-y-4">
                    {pastPlans && pastPlans.length > 0 ? (
                        pastPlans.map((plan) => (
                            <div 
                                key={plan.id} 
                                className={`bg-sidebar border rounded-[2rem] transition-all duration-300 ${
                                    expandedId === plan.id 
                                    ? 'border-foreground ring-1 ring-foreground/10 shadow-2xl scale-[1.01]' 
                                    : 'border-sidebar-border hover:border-foreground/20'
                                } overflow-hidden`}
                            >
                                <div 
                                    className="flex items-center justify-between p-6 cursor-pointer" 
                                    onClick={() => toggleExpand(plan.id)}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl transition-all duration-500 ${expandedId === plan.id ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'}`}>
                                            <History size={22} />
                                        </div>
                                        <span className="font-black uppercase italic text-lg tracking-tight text-foreground">
                                            {plan.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 border-r border-sidebar-border pr-5">
                                            <Link 
                                                href={`/client/plans/${plan.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button className="bg-zinc-950 hover:bg-zinc-900 text-white rounded-2xl px-6 py-4 h-auto flex items-center gap-3 transition-all shadow-xl active:scale-95 group border border-white/5">
                                                    <span className="font-black uppercase italic tracking-[0.1em] text-[10px]">
                                                        Rivedi
                                                    </span>
                                                    <ArrowRight size={14} />
                                                </Button>
                                            </Link>
                                        </div>
                                        <ChevronDown 
                                            size={20} 
                                            className={`text-muted-foreground transition-transform duration-500 ${expandedId === plan.id ? 'rotate-180 text-foreground' : ''}`} 
                                        />
                                    </div>
                                </div>

                                {/* Dettagli Espansi - Copiato da ExerciseIndex */}
                                {expandedId === plan.id && (
                                    <div className="px-10 pb-10 pt-2 bg-background/30 border-t border-sidebar-border/50 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                                            <div className="space-y-3">
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block ml-1">
                                                    Durata Programma
                                                </span>
                                                <p className="text-xs font-black italic uppercase text-white bg-zinc-950 inline-block px-5 py-2.5 rounded-xl shadow-lg border border-white/5">
                                                    {plan.num_weeks} Settimane
                                                </p>
                                            </div>

                                            <div className="space-y-3 md:col-span-2">
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block ml-1">
                                                    Informazioni Sessione
                                                </span>
                                                <div className="flex gap-4 text-sm text-foreground/80 leading-relaxed bg-background/50 rounded-2xl p-5 border border-sidebar-border shadow-inner">
                                                    <Calendar size={18} className="shrink-0 mt-0.5 text-primary" />
                                                    <p className="font-bold uppercase italic text-[11px] tracking-tight">
                                                        Assegnata il {new Date(plan.created_at).toLocaleDateString('it-IT')} dal Trainer {plan.trainer?.name || "Staff"}.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        /* Empty State - Copiato da ExerciseIndex */
                        <div className="text-center py-32 bg-sidebar border-2 border-dashed border-sidebar-border rounded-[3rem]">
                            <History size={48} className="mx-auto text-muted-foreground/20 mb-6" />
                            <p className="text-muted-foreground uppercase italic text-[10px] font-black tracking-[0.4em]">
                                Database Storico Vuoto
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}