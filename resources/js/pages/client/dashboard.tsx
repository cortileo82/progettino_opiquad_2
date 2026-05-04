import React, { useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Dumbbell, Calendar, User, LayoutDashboard, Activity } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';
import { Card } from '@/components/custom/cards'; 
import { PlanViewer } from '@/components/custom/plan-viewer';

interface Props {
    auth: { user: { name: string } };
    assignedTrainer: string;
    activePlan: any; 
}

export default function Dashboard({ auth, assignedTrainer, activePlan }: Props) {
    const breadcrumbs = [{ title: 'Dashboard', href: '/client/dashboard' }];

    const formattedWeeks = useMemo(() => {
        if (!activePlan || !activePlan.weekly_days) return {};
        const currentWeekNumber = activePlan.current_week || 1;
        
        return {
            [currentWeekNumber.toString()]: activePlan.weekly_days
        };
    }, [activePlan]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-10">
                
                <HeaderNew title={`Bentornato, ${auth.user.name}`} subtitle="Ecco la tua scheda di allenamento per la settimana corrente." icon={LayoutDashboard} />

                {activePlan ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card label="Programma" value={activePlan.name} icon={Activity}/>
                            <Card label="Il Tuo Personal Trainer" value={assignedTrainer} icon={User}/>
                            <Card label="Progresso" value={`Settimana ${activePlan.current_week} di ${activePlan.total_weeks}`} icon={Calendar}/>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pl-4 border-b border-sidebar-border pb-4">
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                <h3 className="font-black uppercase italic text-sm tracking-widest">
                                    Focus: Settimana {activePlan.current_week}
                                </h3>
                            </div>

                          
                            <div className="dashboard-viewer-wrapper">
                                <style dangerouslySetInnerHTML={{ __html: `.dashboard-viewer-wrapper .flex-wrap.gap-2.p-2 { display: none !important; }`}} />
                                <PlanViewer weeks={formattedWeeks} totalWeeks={activePlan.current_week}  />
                            </div>
                        </div>
                    </>
                ) : (
                    <EmptyState message="Nessuna scheda attiva per questo periodo." icon={Dumbbell}/>
                )}
            </div>
        </AppLayout>
    );
}