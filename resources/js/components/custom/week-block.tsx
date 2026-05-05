import React from 'react';
import { Dumbbell, Plus } from 'lucide-react';
import { ExerciseRow } from './exercise-row';

interface WeekBlockProps {
    weekNum: number;
    weekFields: any[];
    remove: (name: number) => void;
    add: (defaultValue: any) => void;
    exercisesList: any[];
}

export function WeekBlock({ weekNum, weekFields, remove, add, exercisesList }: WeekBlockProps) {
    return (
        <div className="bg-card border-2 border-sidebar-border rounded-3xl p-6 shadow-sm overflow-hidden mb-8">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-sidebar-border/50">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <Dumbbell size={24} />
                </div>
                <div>
                    <h3 className="font-black uppercase tracking-widest text-lg text-foreground">
                        Settimana {weekNum}
                    </h3>
                    <p className="text-sm text-foreground/50 italic font-medium">
                        {weekFields.length} {weekFields.length === 1 ? 'Esercizio' : 'Esercizi'} pianificati
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                {weekFields.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-sidebar-border rounded-2xl text-foreground/40 italic text-sm font-medium mb-4">
                        Nessun esercizio presente in questa settimana.
                    </div>
                ) : (
                    weekFields.map(field => (
                        <ExerciseRow 
                            key={field.key} 
                            field={field} 
                            remove={remove} 
                            exercisesList={exercisesList} 
                        />
                    ))
                )}

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => add({ 
                            week_number: weekNum, 
                            day_of_week: 'Lunedì', 
                            sets: 3, 
                            reps: 10, 
                            weight_kg: 0, 
                            rest_time: 60 
                        })}
                        className="flex items-center gap-3 p-2 pr-6 rounded-2xl border-2 border-dashed border-sidebar-border hover:border-primary/50 bg-sidebar/30 hover:bg-sidebar transition-all group w-fit"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Plus size={20} strokeWidth={3} />
                        </div>
                        <span className="font-black uppercase tracking-widest text-[11px] text-foreground/70 group-hover:text-primary transition-colors">
                            Aggiungi in Settimana {weekNum}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}