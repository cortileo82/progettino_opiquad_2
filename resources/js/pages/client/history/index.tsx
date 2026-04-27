import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { History, Calendar, ChevronDown, ArrowRight, Archive } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';
import Pagination from '@/components/custom/pagination';

interface Plan {
    id: number;
    name: string;
    num_weeks: number;
    created_at: string;
    trainer?: { name: string } | null;
}

// Interfaccia per i dati paginati (se presenti)
interface PaginatedPlans {
    data: Plan[];
    current_page: number;
    total: number;
    per_page: number;
}

interface Props {
    // Gestiamo sia il caso array semplice che l'oggetto paginato
    pastPlans: Plan[] | PaginatedPlans;
}

export default function HistoryIndex({ pastPlans }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Normalizziamo i dati: capiamo se pastPlans è un array o un oggetto paginato
    const isPaginated = !Array.isArray(pastPlans);
    const plansList = isPaginated ? (pastPlans as PaginatedPlans).data : (pastPlans as Plan[]);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (          
        <AppLayout breadcrumbs={[{ title: 'Storico Schede', href: '/client/history' }]}>
            <Head title="Storico Schede" />  
            <div className="w-full p-6 md:p-10 max-w-5xl mx-auto">
                
                {/* Header con componente */}
                <HeaderNew 
                    title="Storico Schede"
                    subtitle="Archivio storico delle schede di allenamento passate."
                    icon={Archive}
                />

                <div className="mt-6">
                    {plansList.length > 0 ? (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                {plansList.map((plan) => (
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

                                        {/* Dettagli Espansi */}
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
                                                                Assegnata il {new Date(plan.created_at).toLocaleDateString('it-IT')} dal Trainer {plan.trainer?.name || "Staff Tecnico"}.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Paginazione (mostrata solo se i dati sono paginati) */}
                            {isPaginated && (
                                <Pagination 
                                    meta={{
                                        current_page: (pastPlans as PaginatedPlans).current_page,
                                        total: (pastPlans as PaginatedPlans).total,
                                        per_page: (pastPlans as PaginatedPlans).per_page
                                    }} 
                                />
                            )}
                        </div>
                    ) : (
                        /* Utilizzo del nuovo componente EmptyState */
                        <EmptyState 
                            message="Nessuna scheda presente nello storico" 
                            icon={History} 
                        />
                    )}
                </div>
            </div>
            </AppLayout>
        );
}