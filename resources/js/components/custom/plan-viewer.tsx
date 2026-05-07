import React, { useState, useEffect } from 'react';
import { CalendarDays, Info, Repeat, Timer, Weight, Dumbbell } from 'lucide-react';

interface PlanViewerProps {
    weeks?: any;
    totalWeeks?: number;
}

export function PlanViewer({ weeks = {}, totalWeeks = 0 }: PlanViewerProps) {
    const availableWeeks = Object.keys(weeks || {});
    const [activeWeek, setActiveWeek] = useState<string>("1");

    useEffect(() => {
        if (availableWeeks.length > 0 && !availableWeeks.includes(activeWeek)) {
            setActiveWeek(availableWeeks[0]);
        }
    }, [weeks]);

    // Se mancano i dati o le settimane sono vuote
    if (!weeks || Object.keys(weeks).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-sidebar/10 rounded-[2.5rem] border border-dashed border-sidebar-border">
                <Dumbbell size={40} className="mb-4 opacity-10" />
                <p className="text-[10px] font-black uppercase italic text-muted-foreground opacity-40">Dati allenamento non pervenuti</p>
            </div>
        );
    }

    const currentWeekData = weeks[activeWeek] || {};
    const totalWeeksArray = Array.from({ length: totalWeeks || availableWeeks.length }, (_, i) => (i + 1).toString());

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Selettore Settimane (solo se c'è più di una settimana) */}
            {totalWeeksArray.length > 1 && (
                <div className="flex flex-wrap gap-2 p-2 bg-sidebar/50 border border-sidebar-border rounded-2xl w-fit">
                    {totalWeeksArray.map((w) => (
                        <button
                            key={w}
                            onClick={() => setActiveWeek(w)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase italic transition-all ${
                                activeWeek === w ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'
                            }`}
                        >
                            WK {w}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {Object.entries(currentWeekData).map(([day, exercises]: [string, any]) => (
                    <div key={day} className="bg-sidebar border border-sidebar-border rounded-[2.5rem] overflow-hidden">
                        <div className="bg-muted/30 px-6 py-4 border-b border-sidebar-border">
                            <h3 className="font-black uppercase italic text-xs tracking-widest flex items-center gap-2">
                                <CalendarDays size={14} className="text-primary" />
                                {day}
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {Array.isArray(exercises) && exercises.map((ex: any) => (
                                <div key={ex.id} className="border-b border-sidebar-border/50 last:border-0 pb-6 last:pb-0">
                                    <p className="text-xs font-black uppercase text-foreground mb-1">{ex.name}</p>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-[10px] font-bold text-muted-foreground italic uppercase">
                                        <div className="flex items-center gap-1"><Repeat size={12} className="text-primary" /> {ex.pivot?.sets}x{ex.pivot?.reps}</div>
                                        <div className="flex items-center gap-1"><Weight size={12} className="text-primary" /> {ex.pivot?.weight_kg > 0 ? `${ex.pivot.weight_kg}kg` : '-'}</div>
                                        <div className="flex items-center gap-1"><Timer size={12} className="text-primary" /> {ex.pivot?.rest_time}''</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}