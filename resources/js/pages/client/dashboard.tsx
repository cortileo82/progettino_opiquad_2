import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Dumbbell, Calendar, User, LayoutDashboard, Activity } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';
import { Card } from '@/components/custom/cards'; 
import { PlanViewer } from '@/components/custom/plan-viewer';

interface Props {
    auth: { user: { name: string; is_premium: boolean } };
    assignedTrainer: string;
    activePlan: any; 
}

export default function Dashboard({ auth, assignedTrainer, activePlan }: Props) {
    const breadcrumbs = [{ title: 'Dashboard', href: '/client/dashboard' }];
    
    // LOGICA DI ACCESSO: Premium globale oppure Scheda singola pagata
    const hasAccess = auth.user.is_premium || (activePlan && activePlan.is_paid);

    const formattedWeeks = useMemo(() => {
        if (!activePlan || !activePlan.weekly_days) return {};
        const currentWeekNumber = activePlan.current_week || 1;
        return { [currentWeekNumber.toString()]: activePlan.weekly_days };
    }, [activePlan]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-10">
                <HeaderNew 
                    title={`Bentornato, ${auth.user.name}`} 
                    subtitle="Ecco la tua scheda di allenamento per la settimana corrente." 
                    icon={LayoutDashboard} 
                />

                {activePlan ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card label="Programma" value={activePlan.name} icon={Activity}/>
                            <Card label="Il Tuo Personal Trainer" value={assignedTrainer} icon={User}/>
                            <Card label="Progresso" value={`Settimana ${activePlan.current_week} di ${activePlan.total_weeks}`} icon={Calendar}/>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pl-4 border-b border-sidebar-border pb-4">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <h3 className="font-black uppercase italic text-sm tracking-widest text-zinc-600">
                                    Focus: Settimana {activePlan.current_week}
                                </h3>
                            </div>

                            <div className="relative">
                                {!hasAccess && (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/10 backdrop-blur-[1px] px-8 py-24 text-center">
                                        <div className="bg-white/90 p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 backdrop-blur-xl max-w-lg">
                                            <h3 className="text-3xl font-black italic uppercase text-zinc-900 tracking-tight">
                                                Piano Bloccato
                                            </h3>
                                            <p className="text-zinc-500 mt-4 mb-10 font-medium italic leading-relaxed">
                                                Questa scheda non è inclusa nel tuo piano attuale. Passa a PRO o acquista la singola scheda.
                                            </p>
                                            
                                            <div className="w-full max-w-xs mx-auto">
                                                <Link 
                                                    href="/client/pricing"
                                                    className="block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase italic py-5 rounded-lg shadow-lg shadow-yellow-500/40 text-center transition-all hover:scale-105 active:scale-95"
                                                >
                                                    Sblocca Ora
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={`dashboard-viewer-wrapper transition-all duration-1000 ${!hasAccess ? 'blur-[4px] opacity-60 pointer-events-none select-none' : ''}`}>
                                    <style dangerouslySetInnerHTML={{ __html: `.dashboard-viewer-wrapper .flex-wrap.gap-2.p-2 { display: none !important; }`}} />
                                    <PlanViewer weeks={formattedWeeks} totalWeeks={activePlan.current_week}  />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <EmptyState message="Nessuna scheda attiva per questo periodo." icon={Dumbbell}/>
                )}
                <div className="h-20" />
            </div>
        </AppLayout>
    );
}