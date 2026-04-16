import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Pencil, Trash2, ChevronDown, Dumbbell, Info } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Exercise {
    id: number;
    name: string;
    muscle_group: string;
    description?: string;
}

interface Props {
    exercises: Exercise[];
}

export default function ExerciseIndex({ exercises = [] }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Gestione permesso cancellazione una alla volta
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Sei sicuro di voler eliminare "${name}"?`)) {
            router.delete(`/admin/exercises/${id}`, {
                // 1. Quando parte la richiesta di cancellazione, si memorizza l'id di chi si vuole cancellare,
                //    con l'obiettivo finale di non permettere una sua cancellazione più di una volta
                onStart: () => setDeletingId(id),

                // 2. Quando la richiesta è stata risposta, si resetta la costante per evitare più cancellazione
                onFinish: () => setDeletingId(null),

                // 3. Si fa scorrere la barra di caricamento in alto
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Esercizi', href: '#' }]}>
            <div className="w-full p-6 md:p-10">
                
                <div className="mb-8 border-b border-sidebar-border pb-6">
                    <h1 className="text-3xl font-extrabold tracking-tighter uppercase italic text-foreground">
                        Gestione Esercizi
                    </h1>
                    <p className="text-muted-foreground text-base font-medium mt-1">
                        Consultazione, modifica ed eliminazione dell'anagrafica esercizi.
                    </p>
                </div>

                <div className="space-y-4">
                    {exercises && exercises.length > 0 ? (
                        exercises.map((ex) => {
                            // Si stabilisce se tale esercizio deve ancora essere eliminato o meno
                            const isThisRowDeleting = deletingId === ex.id;

                            return (
                                <div 
                                    key={ex.id} 
                                    className={`bg-sidebar border rounded-2xl transition-all duration-300 ${
                                        expandedId === ex.id 
                                        ? 'border-orange-500/50 ring-1 ring-orange-500/20 shadow-xl' 
                                        : 'border-sidebar-border hover:border-orange-500/30'
                                    } overflow-hidden`}
                                >
                                    <div 
                                        className="flex items-center justify-between p-5 cursor-pointer" 
                                        onClick={() => toggleExpand(ex.id)}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`p-3 rounded-xl transition-colors ${expandedId === ex.id ? 'bg-orange-500 text-white' : 'bg-background text-muted-foreground'}`}>
                                                <Dumbbell size={20} />
                                            </div>
                                            <span className="font-extrabold uppercase text-base tracking-widest text-foreground">
                                                {ex.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 border-r border-sidebar-border pr-4">
                                                <Link 
                                                    href={`/admin/exercises/${ex.id}/edit`}
                                                    className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Pencil size={18} />
                                                </Link>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(ex.id, ex.name);
                                                    }}
                                                    className="p-2.5 rounded-xl transition-all duration-200 
                                                            text-muted-foreground hover:text-red-500 hover:bg-red-500/10
                                                            disabled:opacity-50 disabled:cursor-wait disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                                                >
                                                    <Trash2 size={18} />
                                                    {isThisRowDeleting ? 'Eliminazione...' : 'Elimina'}
                                                </button>
                                            </div>
                                            <ChevronDown 
                                                size={24} 
                                                className={`text-muted-foreground transition-transform duration-300 ml-1 ${expandedId === ex.id ? 'rotate-180 text-orange-500' : ''}`} 
                                            />
                                        </div>
                                    </div>

                                    {expandedId === ex.id && (
                                        <div className="px-8 pb-8 pt-4 bg-background/20 border-t border-sidebar-border/50 animate-in fade-in slide-in-from-top-2">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                                                <div className="space-y-2 col-span-1">
                                                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-500 block">
                                                        Gruppo Muscolare
                                                    </span>
                                                    <p className="text-base font-bold italic text-foreground bg-background rounded-xl p-4 border border-sidebar-border">
                                                        {ex.muscle_group}
                                                    </p>
                                                </div>

                                                <div className="space-y-2 col-span-1 md:col-span-2">
                                                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground block">
                                                        Descrizione
                                                    </span>
                                                    <div className="flex gap-3 text-sm text-muted-foreground leading-relaxed italic bg-background rounded-xl p-4 border border-sidebar-border">
                                                        <Info size={16} className="shrink-0 mt-1 opacity-60 text-orange-500" />
                                                        <p>{ex.description || "Nessuna descrizione o nota tecnica inserita."}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-24 bg-sidebar border border-dashed border-sidebar-border rounded-2xl w-full">
                            <Dumbbell size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground uppercase text-xs font-bold tracking-widest italic">
                                Nessun esercizio trovato nell'archivio.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}