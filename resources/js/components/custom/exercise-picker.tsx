import React, { useState, useMemo } from 'react';
import { Drawer, Input } from 'antd';
import { Search, ChevronRight, Dumbbell } from 'lucide-react';

interface ExercisePickerProps {
    value?: string;
    onChange?: (value: string) => void;
    exercisesList: any[];
}

export function ExercisePicker({ value, onChange, exercisesList }: ExercisePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedExercise = useMemo(() => exercisesList.find(ex => ex.id === value), [value, exercisesList]);

    const filteredExercises = useMemo(() => {
        if (!searchTerm) return exercisesList;
        return exercisesList.filter(ex => (ex.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, exercisesList]);

    const handleSelect = (exerciseId: string) => {
        if (onChange) onChange(exerciseId);
        setIsOpen(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full h-[54px] px-4 bg-background border border-sidebar-border rounded-xl text-left flex items-center justify-between hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm outline-none italic text-foreground"
            >
                <span className={`truncate ${!selectedExercise ? 'text-muted-foreground/50' : 'text-foreground'}`}>
                    {selectedExercise ? (selectedExercise?.name?.toUpperCase() || 'ESERCIZIO SENZA NOME') : 'SELEZIONA...'}
                </span>
                <ChevronRight size={16} className="text-foreground/40" />
            </button>

            <Drawer title="Libreria Esercizi" placement="right" onClose={() => setIsOpen(false)} open={isOpen} width={400} bodyStyle={{ padding: 0 }}>
                <div className="p-4 border-b border-sidebar-border sticky top-0 bg-card z-10">
                    <Input prefix={<Search size={16} className="text-foreground/40" />} placeholder="Cerca per nome, muscolo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} allowClear size="large" className="rounded-xl" />
                </div>
                <div className="p-2">
                    {filteredExercises.length === 0 ? (
                        <div className="text-center p-8 text-foreground/40 text-sm"> Nessun esercizio trovato. </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {filteredExercises.map(ex => (
                                <button key={ex.id} onClick={() => handleSelect(ex.id)} className={`w-full text-left p-3 rounded-xl flex items-center gap-4 transition-all hover:bg-sidebar ${value === ex.id ? 'bg-primary/10 border-primary/30 border' : 'border border-transparent'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-sidebar-border flex items-center justify-center shrink-0">
                                        <Dumbbell size={18} className={value === ex.id ? 'text-primary' : 'text-foreground/50'} />
                                    </div>
                                    <div className="flex flex-col flex-1 truncate">
                                        <span className="font-bold text-sm truncate">{ex.name}</span>
                                        <span className="text-[11px] text-foreground/50 font-medium"> {ex.muscle_group?.name || ''}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </Drawer>
        </>
    );
}