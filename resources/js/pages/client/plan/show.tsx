import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { HeaderNew } from '@/components/custom/header-new';
import { PlanViewer } from '@/components/custom/plan-viewer';
import { PlanPaywall } from '@/components/custom/plan-paywall';
import { ClipboardList, Dumbbell } from 'lucide-react';

interface Exercise {
    id: number;
    name: string;
    description: string | null;
    pivot: {
        sets: string;
        reps: string;
        rest_time: string;
        weight_kg: string;
    };
}

interface Props {
    auth: any;
    plan: {
        id: number;
        is_paid: boolean;
        name: string;
        trainer: string;
        start_date: string;
        total_weeks: number;
        weeks: Record<string, Record<string, Exercise[]>>;
    } | null;
}

export default function MyPlan({ auth, plan }: Props) {
    const breadcrumbs = [{ title: 'La Mia Scheda', href: '/client/my-plan' }];
    
    // 1. Logica di accesso identica alla Dashboard
    const isPremium = Boolean(auth?.user?.is_premium);
    const isPaid = Boolean(plan?.is_paid);
    const hasAccess = isPremium || isPaid;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={plan ? `Scheda: ${plan.name}` : "La Mia Scheda"} />
            
            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8 min-h-screen">
                
                {/* 2. HEADER: Sempre visibile e mai sfocato (Come in Dashboard) */}
                <HeaderNew 
                    title={plan ? plan.name : "La Mia Scheda"}
                    subtitle={plan 
                        ? `Coach: ${plan.trainer.toUpperCase()} • Data Inizio: ${plan.start_date}`
                        : "Programma di allenamento personalizzato"
                    }
                    icon={ClipboardList}
                    isPremium={isPremium}
                />

                {/* 3. AREA CONTENUTO: Struttura identica alla Dashboard */}
                <div className="relative w-full">
                    
                    {/* PAYWALL: Si appoggia direttamente sulla sfocatura se non c'è accesso */}
                    {!hasAccess && <PlanPaywall planId={plan?.id} isSticky={true} />}

                    {/* CONTENUTO: Sfocatura leggera (6px) per schiarire l'effetto */}
                    <div className={`transition-all duration-700 ${
                        !hasAccess 
                        ? 'blur-[6px] opacity-50 pointer-events-none select-none overflow-hidden rounded-[2.5rem]' 
                        : ''
                    }`}>
                        
                        {plan ? (
                            /* Se la scheda c'è, carichiamo il viewer */
                            <PlanViewer 
                                weeks={plan.weeks} 
                                totalWeeks={plan.total_weeks} 
                            />
                        ) : (
                            /* Se la scheda NON c'è nel DB, carichiamo l'Empty State */
                            <div className="flex flex-col items-center justify-center py-32 bg-sidebar/10 rounded-[2.5rem] border border-dashed border-sidebar-border text-center">
                                <Dumbbell size={60} className="mb-6 opacity-20" />
                                <h3 className="text-xl font-black uppercase italic tracking-tighter opacity-40">
                                    Nessun programma attivo trovato
                                </h3>
                                <p className="text-xs uppercase font-bold opacity-30 mt-2">
                                    Riceverai una notifica quando il coach caricherà il piano
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-20" />
            </div>
        </AppLayout>
    );
}