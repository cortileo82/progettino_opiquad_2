import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { History, Archive, ChevronDown, Calendar } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';
import { PlanViewer } from '@/components/custom/plan-viewer';
import Pagination from '@/components/custom/pagination';

export default function Index({ pastPlans }: any) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Gestione dati paginati o array semplice
    const plansList = pastPlans.data || pastPlans;

    return (          
        <AppLayout breadcrumbs={[{ title: 'Storico Schede', href: '/client/history' }]}>
            <Head title="Storico Schede" />  
            <div className="w-full p-6 md:p-10 max-w-7xl mx-auto">
                
                <HeaderNew 
                    title="Storico Schede"
                    subtitle="Archivio delle tue programmazioni passate."
                    icon={Archive}
                />

                <div className="mt-6 space-y-4">
                    {plansList.length > 0 ? (
                        plansList.map((plan: any) => (
                            <div 
                                key={plan.id} 
                                className={`bg-sidebar border rounded-[2rem] overflow-hidden transition-all duration-300 ${
                                    expandedId === plan.id ? 'border-foreground shadow-xl' : 'border-sidebar-border'
                                }`}
                            >
                                {/* Header della Card cliccabile */}
                                <div 
                                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50" 
                                    onClick={() => setExpandedId(expandedId === plan.id ? null : plan.id)}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl ${expandedId === plan.id ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'}`}>
                                            <History size={22} />
                                        </div>
                                        <span className="font-black uppercase italic text-lg text-foreground">
                                            {plan.name}
                                        </span>
                                    </div>
                                    <ChevronDown className={`transition-transform ${expandedId === plan.id ? 'rotate-180' : ''}`} />
                                </div>

                                {/* Contenuto Espanso */}
                                {expandedId === plan.id && (
                                    <div className="px-6 pb-10 pt-4 bg-background/20 border-t border-sidebar-border/50 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-center gap-4 mb-8 p-4 bg-sidebar/50 rounded-2xl border border-sidebar-border/50">
                                            <Calendar size={16} className="text-primary" />
                                            <p className="text-[10px] font-bold uppercase italic text-muted-foreground">
                                                Scheda del {new Date(plan.created_at).toLocaleDateString()} • {plan.num_weeks} Settimane
                                            </p>
                                        </div>

                                        {/* Riutilizziamo la stessa logica di visualizzazione della scheda attuale */}
                                        <PlanViewer 
                                            weeks={plan.weeks} 
                                            totalWeeks={plan.num_weeks} 
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <EmptyState message="Nessuna scheda in archivio" icon={History} />
                    )}
                </div>

                {pastPlans.links && <Pagination meta={pastPlans} />}
            </div>
        </AppLayout>
    );
}