import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Dumbbell, CalendarDays, Timer, Repeat, Info } from 'lucide-react';

interface Exercise {
    id: number;
    name: string;
    description: string | null;
    pivot: {
        week_number: number;
        day_of_week: string;
        sets: string;
        reps: string;
        rest_time: string;
        weight_kg: string | number;
    };
}

interface Props {
    plan: {
        name: string;
        trainer: string | null;
        start_date: string;
        total_weeks: number;
        weeks: Record<string, Record<string, Exercise[]>>;
    } | null;
}

export default function MyPlan({ plan }: Props) {
    const breadcrumbs = [{ title: 'La Mia Scheda', href: '/client/my-plan' }];

    const totalWeeksArray = plan 
        ? Array.from({ length: plan.total_weeks }, (_, i) => (i + 1).toString()) 
        : [];

    const [activeWeek, setActiveWeek] = useState<string>("1");

    if (!plan) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center uppercase italic font-black opacity-30 tracking-tighter">
                    <Dumbbell size={48} className="mb-4" />
                    <p>Nessun programma attivo trovato.</p>
                </div>
            </AppLayout>
        );
    }

    const currentWeekData = plan.weeks[activeWeek];
    const hasExercises = currentWeekData && Object.keys(currentWeekData).length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programma Completo" />
            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8 min-h-screen">
                
                {/* Header Scheda */}
                <div className="bg-sidebar border border-sidebar-border rounded-[2rem] p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 shadow-sm">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                            {plan.name}
                        </h1>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                Allenatore: <span className="text-foreground">{plan.trainer || 'Staff Tecnico'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                Inizio: <span className="text-foreground">{plan.start_date}</span>
                            </div>
                            
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                        {totalWeeksArray.map((w) => (
                            <button
                                key={w}
                                onClick={() => setActiveWeek(w)}
                                className={`flex-1 lg:flex-none min-w-[70px] px-4 py-3 rounded-xl text-xs font-black uppercase italic transition-all duration-200 border ${
                                    activeWeek === w 
                                    ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 z-10' 
                                    : 'bg-background border-sidebar-border text-muted-foreground hover:border-primary/50'
                                }`}
                            >
                                Sett. {w}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenuto della Settimana */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {hasExercises ? (
                        Object.entries(currentWeekData).map(([day, exercises]) => (
                            <div key={`${activeWeek}-${day}`} className="bg-sidebar border border-sidebar-border rounded-3xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-muted/30 px-6 py-4 border-b border-sidebar-border flex items-center justify-between">
                                    <h3 className="font-black uppercase italic text-sm tracking-widest text-foreground flex items-center gap-2">
                                        <CalendarDays size={16} className="text-primary" />
                                        {day}
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    {exercises.map((ex) => (
                                        <div key={ex.id} className="group/ex border-b border-sidebar-border/50 last:border-0 pb-6 last:pb-0">
                                            <p className="text-xs font-black uppercase text-foreground leading-tight tracking-tight">
                                                {ex.name}
                                            </p>

                                            {/* AGGIUNTA DESCRIZIONE - Unica modifica apportata */}
                                            {ex.description && (
                                                <div className="mt-2 mb-1 flex gap-2">
                                                    <Info size={10} className="text-primary shrink-0 mt-0.5" />
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase italic leading-tight opacity-70">
                                                        {ex.description}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground italic uppercase">
                                                    <Repeat size={12} className="text-primary" />
                                                    {ex.pivot.sets} x {ex.pivot.reps}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground italic uppercase">
                                                    <Dumbbell size={12} className="text-primary" />
                                                    {ex.pivot.weight_kg} kg
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground italic uppercase">
                                                    <Timer size={12} className="text-primary" />
                                                    {ex.pivot.rest_time}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center bg-sidebar border-2 border-dashed border-sidebar-border rounded-[3rem] text-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Info size={32} className="text-muted-foreground/50" />
                            </div>
                            <h3 className="uppercase italic font-black text-xl tracking-tighter text-foreground">
                                Settimana di riposo
                            </h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">
                                Nessun esercizio inserito per la settimana {activeWeek}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            </AppLayout>
    );
}