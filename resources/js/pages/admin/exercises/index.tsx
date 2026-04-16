import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Pencil, Trash2, ChevronDown, Dumbbell, Info, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

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
        <AppLayout breadcrumbs={[{ title: 'Gestione Esercizi', href: '/admin/exercises' }]}>
            <div className="w-full p-6 md:p-10 italic uppercase">
                
                {/* Header con Titolo e Pulsante Nuovo */}
                <div className="mb-8 border-b border-sidebar-border pb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tighter text-foreground">
                                Gestione Esercizi
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium mt-1 normal-case not-italic">
                                Archivio tecnico degli esercizi disponibili.
                            </p>
                        </div>
                        
                        <Link href="/admin/exercises/create">
                            <Button className="bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl px-6 py-3 h-auto flex items-center gap-3 transition-all shadow-xl active:scale-95 group">
                                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                                <span className="font-black tracking-[0.2em] text-[11px]">
                                    Nuovo Esercizio
                                </span>
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="space-y-4">
                    {exercises && exercises.length > 0 ? (
                        exercises.map((ex) => (
                            <div 
                                key={ex.id} 
                                className={`bg-sidebar border rounded-2xl transition-all duration-300 ${
                                    expandedId === ex.id 
                                    ? 'border-foreground ring-1 ring-foreground/10 shadow-lg' 
                                    : 'border-sidebar-border hover:border-foreground/30'
                                } overflow-hidden`}
                            >
                                <div 
                                    className="flex items-center justify-between p-5 cursor-pointer" 
                                    onClick={() => toggleExpand(ex.id)}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3 rounded-xl transition-colors ${expandedId === ex.id ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'}`}>
                                            <Dumbbell size={20} />
                                        </div>
                                        <span className="font-extrabold text-base tracking-widest text-foreground">
                                            {ex.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 border-r border-sidebar-border pr-4">
                                            <Link 
                                                href={`/admin/exercises/${ex.id}/edit`}
                                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-all"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(ex.id, ex.name);
                                                }}
                                                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <ChevronDown 
                                            size={20} 
                                            className={`text-muted-foreground transition-transform duration-300 ml-1 ${expandedId === ex.id ? 'rotate-180 text-foreground' : ''}`} 
                                        />
                                    </div>
                                </div>

                                {expandedId === ex.id && (
                                    <div className="px-8 pb-8 pt-4 bg-background/20 border-t border-sidebar-border/50 animate-in fade-in slide-in-from-top-2">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                                            <div className="space-y-2 col-span-1">
                                                <span className="text-[10px] font-black tracking-[0.25em] text-foreground block">
                                                    Gruppo Muscolare
                                                </span>
                                                <p className="text-sm font-bold italic text-foreground bg-background rounded-xl p-3 border border-sidebar-border shadow-inner">
                                                    {ex.muscle_group}
                                                </p>
                                            </div>

                                            <div className="space-y-2 col-span-1 md:col-span-2">
                                                <span className="text-[10px] font-black tracking-[0.25em] text-muted-foreground block">
                                                    Descrizione Tecnica
                                                </span>
                                                <div className="flex gap-3 text-sm text-muted-foreground leading-relaxed italic bg-background rounded-xl p-3 border border-sidebar-border">
                                                    <Info size={14} className="shrink-0 mt-1 opacity-60 text-foreground" />
                                                    <p className="normal-case not-italic">{ex.description || "Nessuna descrizione inserita."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-sidebar border border-dashed border-sidebar-border rounded-2xl w-full">
                            <Dumbbell size={40} className="mx-auto text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest italic">
                                Archivio vuoto.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}