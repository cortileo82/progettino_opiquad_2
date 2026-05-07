import React, { useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Dumbbell, Calendar, User, LayoutDashboard, Activity } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';
import { Card } from '@/components/custom/cards'; 
import { PlanViewer } from '@/components/custom/plan-viewer';
import { PlanPaywall } from '@/components/custom/plan-paywall';

export default function Dashboard({ assignedTrainer, activePlan }: any) {
    const { auth } = usePage().props as any;
    const isPremium = Boolean(auth.user?.is_premium);
    const hasAccess = isPremium || Boolean(activePlan?.is_paid);

    const formattedWeeks = useMemo(() => {
        if (!activePlan?.weekly_days) return {};
        return { [activePlan.current_week.toString()]: activePlan.weekly_days };
    }, [activePlan]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/client/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-10">
                
                {/* 1. HEADER: PULITO IN CIMA */}
                <HeaderNew 
                    title={`Ciao, ${auth.user?.name}`} 
                    subtitle={activePlan ? "Il tuo focus settimanale." : "Scegli il tuo piano di allenamento."} 
                    icon={LayoutDashboard} 
                    isPremium={isPremium}
                />

                <div className="w-full">
                    {activePlan ? (
                        /* CASO A: SCHEDA PRESENTE -> SOVRAPPOSIZIONE */
                        <div className="relative min-h-[600px]">
                            {!hasAccess && <PlanPaywall planId={activePlan.id} />}
                            
                            <div className={`space-y-10 transition-all ${!hasAccess ? 'blur-3xl opacity-20 pointer-events-none' : ''}`}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card label="Programma" value={activePlan.name} icon={Activity}/>
                                    <Card label="Trainer" value={assignedTrainer || 'Staff'} icon={User}/>
                                    <Card label="Settimana" value={activePlan.current_week} icon={Calendar}/>
                                </div>
                                <PlanViewer weeks={formattedWeeks} totalWeeks={activePlan.current_week} />
                            </div>
                        </div>
                    ) : (
                        /* CASO B: SCHEDA MANCANTE */
                        <div className="w-full py-10">
                            {!hasAccess ? (
                                /* Se non ha accesso, mostriamo SOLO il Paywall pulito */
                                <PlanPaywall />
                            ) : (
                                /* Se è già premium ma non ha ancora la scheda, mostriamo l'EmptyState */
                                <EmptyState 
                                    message="Il tuo PT sta preparando il programma. Riceverai una notifica a breve." 
                                    icon={Dumbbell} 
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className="pb-20" />
            </div>
        </AppLayout>
    );
}