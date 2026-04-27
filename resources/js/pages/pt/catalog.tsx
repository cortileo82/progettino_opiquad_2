import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Dumbbell, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { ResourceList } from '@/components/custom/resource-list';
import { HeaderNew } from '@/components/custom/header-new';

interface Exercise {
    id: number;
    name: string;
    // muscle_group può essere una stringa o un oggetto con una proprietà name
    muscle_group?: any; 
    description?: string;
}

interface Props {
    exercises: Exercise[];
}

const breadcrumbs = [
        { title: 'Catalogo Esercizi', href: '/pt/exercises/catalog' }
    ];

export default function ExerciseCatalog({ exercises = [] }: Props) {
    const [search, setSearch] = useState('');

    // --- LOGICA DI FILTRAGGIO CORRETTA ---
    const filteredExercises = exercises.filter(ex => {
        const searchLower = search.toLowerCase();
        
        // Estraiamo il nome del muscolo in modo sicuro
        // Se è un oggetto prendiamo .name, altrimenti lo trattiamo come stringa, altrimenti stringa vuota
        const muscleName = typeof ex.muscle_group === 'object' 
            ? ex.muscle_group?.name 
            : (ex.muscle_group || '');

        return (
            ex.name.toLowerCase().includes(searchLower) || 
            muscleName.toLowerCase().includes(searchLower)
        );
    });

    return (
         <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catalogo Tecnico Esercizi" />

            <div className="flex h-full flex-col gap-8 p-6 md:p-10">
                
                {/* Header con componente */}
                <HeaderNew 
                    title="CATALOGO ESERCIZI"
                    subtitle="Database tecnico degli esercizi disponibili"
                    icon={Dumbbell}
                    actions={
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input 
                                placeholder="FILTRA PER NOME O MUSCOLO..." 
                                className="pl-12 bg-sidebar border-sidebar-border rounded-2xl h-14 uppercase italic font-black text-[10px] tracking-widest focus:ring-foreground/20 w-full md:w-[300px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    }
                />

                {/* Lista esercizi con componente*/}
                <div className="w-full">
                    {filteredExercises.length > 0 ? (
                        <ResourceList 
                            items={filteredExercises} 
                            type="exercises" 
                            readOnly={true} 
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-sidebar-border rounded-[2.5rem] opacity-50 mt-6">
                            <Dumbbell size={40} className="mb-4 text-muted-foreground" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Nessun esercizio trovato</p>
                        </div>
                    )}
                </div>
            </div>
            </AppLayout>
    );
}