import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Dumbbell, Calendar, User, LayoutDashboard, Activity } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';
import { Card } from '@/components/custom/cards'; 
import { PlanViewer } from '@/components/custom/plan-viewer';

interface Props {
    auth: { 
        user: { 
            name: string;
            is_premium: boolean;
        } 
    };
    assignedTrainer: string;
    activePlan: any; 
}

export default function Dashboard({ auth, assignedTrainer, activePlan }: Props) {
    const breadcrumbs = [{ title: 'Dashboard', href: '/client/dashboard' }];
    
    // Verifica se l'utente è premium
    const isPremium = auth.user.is_premium;

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
                                
                                {!isPremium && (
                                    /* Overlay più trasparente per far intravedere il contenuto */
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[2px] px-8 py-24 text-center">
                                        <div className="bg-white/80 p-10 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-md max-w-lg">
                                            <h3 className="text-3xl font-black italic uppercase text-zinc-900 tracking-tight">
                                                Contenuto PRO
                                            </h3>
                                            <p className="text-zinc-600 mt-4 mb-10 font-medium italic">
                                                Sblocca il dettaglio degli esercizi e i carichi personalizzati dal tuo coach.
                                            </p>
                                            
                                            <div className="w-full max-w-xs mx-auto">
                                                <Link 
                                                    href="/client/billing/pricing"
                                                    className="block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase italic py-5 rounded-lg shadow-lg shadow-yellow-500/30 text-center transition-all hover:scale-105 active:scale-95"
                                                >
                                                    Passa a PRO
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* La scheda sottostante: blur regolato per far "intravedere" */}
                                <div className={`dashboard-viewer-wrapper transition-all duration-700 ${!isPremium ? 'blur-[4px] grayscale opacity-50 pointer-events-none select-none' : ''}`}>
                                    <style dangerouslySetInnerHTML={{ __html: `.dashboard-viewer-wrapper .flex-wrap.gap-2.p-2 { display: none !important; }`}} />
                                    <PlanViewer weeks={formattedWeeks} totalWeeks={activePlan.current_week}  />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <EmptyState message="Nessuna scheda attiva per questo periodo." icon={Dumbbell}/>
                )}
                
                <div/>
            </div>
        </AppLayout>
    );
}