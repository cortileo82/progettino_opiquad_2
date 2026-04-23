import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { ChevronDown, Dumbbell, Info, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { ResourceList } from '@/components/custom/resource-list';
import { HeaderNew } from '@/components/custom/header-new';

interface Exercise {
    id: number;
    name: string;
    muscle_group: string;
    description?: string;
}

interface Props {
    exercises: Exercise[];
}

export default function ExerciseCatalog({ exercises = [] }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Filtro rapido lato client per performance istantanee
    const filteredExercises = exercises.filter(ex => 
        ex.name.toLowerCase().includes(search.toLowerCase()) || 
        (ex.muscle_group && ex.muscle_group.toLowerCase().includes(search.toLowerCase()))
    );

    const breadcrumbs = [
        { title: 'Catalogo Esercizi', href: '/pt/exercises/catalog' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catalogo Tecnico Esercizi" />

            <div className="flex h-full flex-col gap-8 p-6 md:p-10">
                
                {/* Header Section */}
               <HeaderNew 
                    title="CATALOGO ESERCIZI"
                    subtitle="Database tecnico degli esercizi disponibili"
                    icon={Dumbbell}
                    actions={
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input 
                                placeholder="FILTRA PER NOME O MUSCOLO..." 
                                className="pl-12 bg-sidebar border-sidebar-border rounded-2xl h-14 uppercase italic font-black text-[10px] tracking-widest focus:ring-foreground/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    }
                />

                {/* Grid/List Section */}
                <div className="grid gap-4">
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