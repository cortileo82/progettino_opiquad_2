import React, { useState, useEffect } from 'react';
import { CalendarDays, Info, Repeat, Timer, Weight, Dumbbell } from 'lucide-react';

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

interface PlanViewerProps {
    // Rendiamo le props opzionali o gestite con default per evitare crash
    weeks?: Record<string, Record<string, Exercise[]>>;
    totalWeeks?: number;
}

export function PlanViewer({ weeks = {}, totalWeeks = 0 }: PlanViewerProps) {
    // Calcoliamo le chiavi disponibili per evitare di puntare a una settimana che non esiste
    const availableWeeks = Object.keys(weeks);
    
    // Inizializziamo la settimana attiva sulla prima disponibile, altrimenti "1"
    const [activeWeek, setActiveWeek] = useState<string>("1");

    // Sincronizziamo l'activeWeek se cambiano i dati (utile nello storico quando si switcha tra piani)
    useEffect(() => {
        if (availableWeeks.length > 0 && !availableWeeks.includes(activeWeek)) {
            setActiveWeek(availableWeeks[0]);
        }
    }, [weeks]);

    // Se non ci sono settimane o l'oggetto è nullo
    if (!weeks || totalWeeks === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-sidebar/20 rounded-[2rem] border border-dashed border-sidebar-border">
                <Dumbbell size={32} className="mb-3 opacity-20" />
                <p className="text-[10px] font-black uppercase italic text-muted-foreground opacity-50">
                    Nessun dato di allenamento disponibile
                </p>
            </div>
        );
    }

    // PROTEZIONE 2: Accesso sicuro ai dati
    const currentWeekData = weeks[activeWeek] || {};
    const totalWeeksArray = Array.from({ length: totalWeeks }, (_, i) => (i + 1).toString());
    const hasExercises = Object.keys(currentWeekData).length > 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* SELETTORE SETTIMANE */}
            <div className="flex flex-wrap gap-2 p-2 bg-sidebar/50 border border-sidebar-border rounded-2xl w-fit">
                {totalWeeksArray.map((w) => (
                    <button
                        key={w}
                        onClick={() => setActiveWeek(w)}
                        className={`min-w-[70px] px-4 py-2 rounded-xl text-[10px] font-black uppercase italic transition-all duration-200 border ${
                            activeWeek === w 
                            ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' 
                            : 'bg-background border-sidebar-border text-muted-foreground hover:border-primary/50'
                        }`}
                    >
                        WK {w}
                    </button>
                ))}
            </div>

            {/* GRIGLIA GIORNI E LISTA ESERCIZI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {hasExercises ? (
                    Object.entries(currentWeekData).map(([day, exercises]) => (
                        <div key={`${activeWeek}-${day}`} className="bg-sidebar border border-sidebar-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* Header Giorno */}
                            <div className="bg-muted/30 px-6 py-4 border-b border-sidebar-border">
                                <h3 className="font-black uppercase italic text-xs tracking-widest text-foreground flex items-center gap-2">
                                    <CalendarDays size={14} className="text-primary" />
                                    {day}
                                </h3>
                            </div>

                            {/* Lista Esercizi */}
                            <div className="p-6 space-y-6">
                                {exercises.map((ex) => (
                                    <div key={ex.id} className="group/ex border-b border-sidebar-border/50 last:border-0 pb-6 last:pb-0">
                                        <p className="text-xs font-black uppercase text-foreground mb-1 group-hover/ex:text-primary transition-colors">
                                            {ex.name}
                                        </p>
                                        
                                        {ex.description && (
                                            <div className="flex gap-2 mb-3">
                                                <Info size={10} className="text-primary shrink-0 mt-0.5" />
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase italic opacity-70 leading-tight">
                                                    {ex.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Dati Tecnici (Sets, Reps, Weight, Rest) */}
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground italic uppercase">
                                                <Repeat size={12} className="text-primary" />
                                                {ex.pivot.sets}x{ex.pivot.reps}
                                            </div>
                                            
                                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground italic uppercase">
                                                <Weight size={12} className="text-primary" />
                                                {ex.pivot.weight_kg && parseFloat(ex.pivot.weight_kg) > 0 
                                                    ? `${ex.pivot.weight_kg} kg` 
                                                    : "-"
                                                }
                                            </div>

                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground italic uppercase">
                                                <Timer size={12} className="text-primary" />
                                                {ex.pivot.rest_time}''
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-sidebar/10 rounded-[2.5rem] border border-dashed border-sidebar-border">
                        <Info size={24} className="mx-auto mb-3 opacity-20 text-primary" />
                        <p className="text-[10px] font-black uppercase italic text-muted-foreground tracking-widest">
                            Nessun esercizio pianificato per la settimana {activeWeek}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}