import React, { useState, useMemo, useEffect } from 'react';
import { Drawer, Input, Select, Space, Empty } from 'antd';
import { Search, ChevronRight, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExercisePickerProps {
    value?: any; // Cambiato in any per sicurezza sugli ID (string/int)
    onChange?: (value: any) => void;
    exercisesList: any[];
}

export function ExercisePicker({ value, onChange, exercisesList }: ExercisePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Sincronizzazione ID: cerchiamo l'esercizio assicurandoci che il confronto sia tra tipi uguali
    const selectedExercise = useMemo(() => {
        if (value === undefined || value === null) return null;
        return exercisesList.find(ex => String(ex.id) === String(value));
    }, [value, exercisesList]);

    const filteredExercises = useMemo(() => {
        if (!searchTerm) return exercisesList;
        return exercisesList.filter(ex => 
            (ex.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, exercisesList]);

    const handleSelect = (exerciseId: any) => {
        if (onChange) {
            onChange(exerciseId);
        }
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <>
            <Select
                value={value}
                placeholder="Seleziona..."
                className="w-full"
                open={false} 
                onMouseDown={(e) => {
                    e.preventDefault();
                    setIsOpen(true);
                }}
                // Ant Design Select ha bisogno dell'opzione nell'array per visualizzarla
                options={selectedExercise ? [{ label: selectedExercise.name, value: selectedExercise.id }] : []}
                suffixIcon={<ChevronRight size={14} className="text-muted-foreground/40" />}
                optionLabelProp="label"
            />

            <Drawer 
                title={
                    <Space>
                        <Dumbbell size={16} className="text-primary" />
                        <span className="font-bold text-sm uppercase tracking-tight italic">Libreria Esercizi</span>
                    </Space>
                }
                placement="right" 
                onClose={() => setIsOpen(false)} 
                open={isOpen} 
                width={400} // Altirmento si può utilizzare size="large"
                styles={{ body: { padding: 0 } }}
            >
                <div className="p-4 border-b border-sidebar-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                    <Input 
                        prefix={<Search size={16} className="text-foreground/40" />} 
                        placeholder="Cerca esercizio..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        allowClear 
                        autoFocus
                    />
                </div>

                <div className="p-2">
                    {filteredExercises.length === 0 ? (
                        <Empty 
                            image={Empty.PRESENTED_IMAGE_SIMPLE} 
                            description={<span className="text-xs italic text-foreground/40">Nessun esercizio trovato</span>} 
                            className="mt-10"
                        />
                    ) : (
                        <div className="flex flex-col gap-1">
                            {filteredExercises.map(ex => {
                                const isSelected = String(value) === String(ex.id);
                                return (
                                    <button 
                                        key={ex.id} 
                                        type="button" 
                                        onClick={() => handleSelect(ex.id)} 
                                        className={cn(
                                            "w-full text-left p-3 rounded-xl flex items-center gap-4 transition-all border border-transparent",
                                            "hover:bg-sidebar",
                                            isSelected ? 'bg-primary/5 border-primary/20' : ''
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-sidebar-border text-foreground/50'
                                        )}>
                                            <Dumbbell size={18} />
                                        </div>
                                        <div className="flex flex-col flex-1 truncate">
                                            <span className={cn(
                                                "font-bold text-sm truncate uppercase italic", 
                                                isSelected ? 'text-primary' : 'text-foreground'
                                            )}>
                                                {ex.name}
                                            </span>
                                            <span className="text-[10px] text-foreground/40 uppercase font-black tracking-tighter"> 
                                                {ex.muscle_group?.name || ''}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Drawer>
        </>
    );
}