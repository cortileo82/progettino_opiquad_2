import React, { useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Dumbbell, Calendar, User, LayoutDashboard, Activity } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';
import { Card } from '@/components/custom/cards'; 
import { PlanViewer } from '@/components/custom/plan-viewer';
import { PlanPaywall } from '@/components/custom/plan-paywall';

interface Props {
    assignedTrainer: string;
    activePlan: any; 
}

export default function Dashboard({ assignedTrainer, activePlan }: Props) {
    const { auth } = usePage().props as any;
    const breadcrumbs = [{ title: 'Dashboard', href: '/client/dashboard' }];
    
    const hasAccess = Boolean(auth.user.is_premium) || Boolean(activePlan?.is_paid);

    const formattedWeeks = useMemo(() => {
        if (!activePlan || !activePlan.weekly_days) return {};
        const currentWeekNumber = activePlan.current_week || 1;
        return { [currentWeekNumber.toString()]: activePlan.weekly_days };
    }, [activePlan]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-10">
                
                <HeaderNew title={`Ciao, ${auth.user.name}`} subtitle="Focus settimanale e riepilogo attività." icon={LayoutDashboard} />

                {activePlan ? (
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card label="Programma" value={activePlan.name} icon={Activity}/>
                            <Card label="Personal Trainer" value={assignedTrainer || 'Staff'} icon={User}/>
                            <Card label="Progresso" value={`Settimana ${activePlan.current_week} di ${activePlan.total_weeks}`} icon={Calendar}/>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pl-4 border-b border-zinc-100 pb-4">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <h3 className="font-black uppercase italic text-sm tracking-widest text-zinc-600">
                                    Focus: Settimana {activePlan.current_week}
                                </h3>
                            </div>
                            <div className="grid grid-cols-1">
                                {!hasAccess ? (
                                    <div className="relative">
                                        {/* Il Paywall ora guida l'altezza se necessario */}
                                        <div className="z-30 relative w-full flex justify-center py-4">
                                            <PlanPaywall isSticky={false} />
                                        </div>

                                        {/* Il contenuto dietro è posizionato in modo da non influenzare lo scroll eccessivamente */}
                                        <div className="absolute top-0 left-0 w-full h-full blur-2xl opacity-20 pointer-events-none select-none overflow-hidden rounded-[32px]">
                                            <style dangerouslySetInnerHTML={{ __html: `.dashboard-viewer-wrapper .flex-wrap.gap-2.p-2 { display: none !important; }`}} />
                                            <div className="dashboard-viewer-wrapper">
                                                <PlanViewer weeks={formattedWeeks} totalWeeks={activePlan.current_week} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Se ha accesso, visualizzazione normale pulita */
                                    <div className="dashboard-viewer-wrapper">
                                        <style dangerouslySetInnerHTML={{ __html: `.dashboard-viewer-wrapper .flex-wrap.gap-2.p-2 { display: none !important; }`}} />
                                        <PlanViewer weeks={formattedWeeks} totalWeeks={activePlan.current_week} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyState message="Nessuna scheda attiva." icon={Dumbbell}/>
                )}

                <div className="pb-20" />
            </div>
        </AppLayout>
    );
}