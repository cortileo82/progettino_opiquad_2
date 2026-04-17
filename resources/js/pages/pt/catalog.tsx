import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { ChevronDown, Dumbbell, Info, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';

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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sidebar-border pb-8">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic text-foreground">
                            CATALOGO ESERCIZI
                        </h1>
                        <p className="text-muted-foreground text-[10px] font-bold mt-2 uppercase tracking-[0.3em] opacity-70">
                            Database tecnico per Personal Trainer
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input 
                            placeholder="FILTRA PER NOME O MUSCOLO..." 
                            className="pl-12 bg-sidebar border-sidebar-border rounded-xl h-14 uppercase italic font-black text-xs tracking-widest focus:ring-foreground/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid/List Section */}
                <div className="grid gap-4">
                    {filteredExercises.length > 0 ? (
                        filteredExercises.map((ex) => (
                            <div 
                                key={ex.id} 
                                className={`group bg-sidebar border transition-all duration-300 rounded-2xl overflow-hidden ${
                                    expandedId === ex.id 
                                    ? 'border-foreground ring-1 ring-foreground/10' 
                                    : 'border-sidebar-border hover:border-foreground/30'
                                }`}
                            >
                                <div 
                                    className="flex items-center justify-between p-6 cursor-pointer select-none" 
                                    onClick={() => toggleExpand(ex.id)}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-xl transition-all duration-500 ${
                                            expandedId === ex.id 
                                            ? 'bg-foreground text-background scale-110' 
                                            : 'bg-background text-muted-foreground group-hover:text-foreground'
                                        }`}>
                                            <Dumbbell size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black uppercase italic text-xl tracking-tight text-foreground">
                                                {ex.name}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mt-0.5">
                                                Gruppo muscolare: <span className="text-foreground">{ex.muscle_group}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <ChevronDown 
                                            size={20} 
                                            className={`text-muted-foreground transition-transform duration-500 ${expandedId === ex.id ? 'rotate-180 text-foreground' : ''}`} 
                                        />
                                    </div>
                                </div>

                                {expandedId === ex.id && (
                                    <div className="px-6 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="grid gap-4 bg-background/40 rounded-xl p-6 border border-sidebar-border/50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Info size={14} className="text-muted-foreground" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    Descrizione
                                                </span>
                                            </div>
                                            <p className="text-sm text-foreground/90 leading-relaxed font-medium italic">
                                                {ex.description || "Nessuna descrizione tecnica presente per questo esercizio."}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-sidebar-border rounded-3xl opacity-50">
                            <Dumbbell size={40} className="mb-4 text-muted-foreground" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Nessun esercizio trovato</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}