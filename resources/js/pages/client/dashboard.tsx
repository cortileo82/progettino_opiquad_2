import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Dumbbell, Calendar, User, Clock, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';

interface Exercise {
    id: number;
    name: string;
    pivot: {
        sets: string;
        reps: string;
        rest_time: string;
    };
}

interface PlanData {
    id: number;
    name: string;
    start_date: string;
    current_week: number;
    total_weeks: number;
    weekly_days: Record<string, Exercise[]>;
}

interface Props {
    auth: { user: { name: string } };
    assignedTrainer: string;
    activePlan: PlanData | null;
}

export default function Dashboard({ auth, assignedTrainer, activePlan }: Props) {
    const breadcrumbs = [{ title: 'Dashboard', href: '/client/dashboard' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-10">
                
                {/* Header con componente */}
                <HeaderNew 
                    title={`Bentornato, ${auth.user.name}`}
                    subtitle="Ecco una panoramica del tuo percorso di allenamento."
                    icon={LayoutDashboard}
                />

                {activePlan ? (
                    <>
                        {/* 2. SCHEDA ATTIVA & INFO COACH */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-sidebar border border-sidebar-border rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden group">
                                <Dumbbell className="absolute -right-8 -bottom-8 w-40 h-40 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-2">Programma Attivo</span>
                                <h2 className="text-5xl font-black uppercase italic leading-none tracking-tighter">
                                    {activePlan.name}
                                </h2>
                            </div>

                            <div className="bg-muted/30 border border-sidebar-border rounded-[2rem] p-8 flex flex-col justify-center space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Personal Trainer</p>
                                        <p className="font-black uppercase italic text-sm text-foreground">{assignedTrainer}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 border-t border-sidebar-border pt-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Data Inizio</p>
                                        <p className="font-black uppercase italic text-sm text-foreground">{activePlan.start_date}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. WORKOUT SETTIMANA CORRENTE */}
                        <div className="space-y-6">
                            <div className="flex items-end justify-between border-b border-sidebar-border pb-4">
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">
                                    Focus: <span className="text-primary">Settimana {activePlan.current_week}</span>
                                </h3>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase italic pb-1">
                                    {activePlan.total_weeks} Settimane Totali
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                {Object.keys(activePlan.weekly_days).length > 0 ? (
                                    Object.entries(activePlan.weekly_days).map(([day, exercises]) => (
                                        <div key={day} className="bg-sidebar border border-sidebar-border rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group">
                                            <div className="bg-muted/50 px-6 py-4 border-b border-sidebar-border group-hover:bg-primary/5 transition-colors">
                                                <h4 className="font-black uppercase italic text-sm tracking-widest text-foreground">
                                                    {day}
                                                </h4>
                                            </div>
                                            <div className="p-6 space-y-4">
                                                {exercises.map((ex) => (
                                                    <div key={ex.id} className="space-y-1">
                                                        <p className="text-[11px] font-black uppercase text-foreground leading-tight">
                                                            {ex.name}
                                                        </p>
                                                        <div className="flex gap-3 text-[9px] font-bold text-muted-foreground uppercase italic">
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={10} className="text-primary" /> {ex.pivot.sets}x{ex.pivot.reps}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <CheckCircle2 size={10} className="text-primary" /> {ex.pivot.rest_time}''
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full">
                                        <EmptyState 
                                            message="Riposo programmato per questa settimana" 
                                            icon={Calendar} 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    /* Componente per db vuoto */
                    <EmptyState 
                        message="Nessun piano attivo assegnato. Contatta il tuo coach." 
                        icon={Dumbbell} 
                    />
                )}
            </div>
            </AppLayout>
    );
}