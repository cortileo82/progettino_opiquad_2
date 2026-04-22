import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2, ChevronDown, Dumbbell, Info, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface MuscleGroup {
    id: number;
    name: string;
}

interface Exercise {
    id: number;
    name: string;
    description?: string;
    muscle_group: MuscleGroup | null; // Ora è una Relazione!
}

interface Props {
    exercises: Exercise[];
}

export default function ExerciseIndex({ exercises = [] }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState<{ id: number, name: string } | null>(null);
    const [processing, setProcessing] = useState(false);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const openDeleteModal = (id: number, name: string) => {
        setExerciseToDelete({ id, name });
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!exerciseToDelete) return;
        router.delete(`/admin/exercises/${exerciseToDelete.id}`, {
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setIsDeleteOpen(false);
                setExerciseToDelete(null);
            },
            preserveScroll: true
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Esercizi', href: '/admin/exercises' }]}>
            <Head title="Gestione Esercizi" />
            <div className="w-full p-6 md:p-10">
                
                <div className="mb-10 border-b border-sidebar-border pb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground leading-none"> Gestione Esercizi </h1>
                            <p className="text-muted-foreground text-[10px] font-bold mt-2 uppercase tracking-[0.2em] opacity-70"> Archivio tecnico e modifiche degli esercizi disponibili. </p>
                        </div>
                        <Link href="/admin/exercises/create">
                            <Button className="bg-zinc-950 hover:bg-zinc-900 text-white rounded-2xl px-8 py-6 h-auto flex items-center gap-4 transition-all shadow-2xl active:scale-95 group border border-white/5">
                                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                <span className="font-black uppercase italic tracking-[0.2em] text-xs"> Nuovo Esercizio </span>
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="space-y-4">
                    {exercises && exercises.length > 0 ? (
                        exercises.map((ex) => (
                            <div key={ex.id} className={`bg-sidebar border rounded-[2rem] transition-all duration-300 ${expandedId === ex.id ? 'border-foreground ring-1 ring-foreground/10 shadow-2xl scale-[1.01]' : 'border-sidebar-border hover:border-foreground/20'} overflow-hidden`}>
                                <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => toggleExpand(ex.id)}>
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl transition-all duration-500 ${expandedId === ex.id ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'}`}>
                                            <Dumbbell size={22} />
                                        </div>
                                        <span className="font-black uppercase italic text-lg tracking-tight text-foreground"> {ex.name} </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 border-r border-sidebar-border pr-5">
                                            <Link href={`/admin/exercises/${ex.id}/edit`} className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all" onClick={(e) => e.stopPropagation()}>
                                                <Pencil size={18} />
                                            </Link>
                                            <button onClick={(e) => { e.stopPropagation(); openDeleteModal(ex.id, ex.name) }} className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <ChevronDown size={20} className={`text-muted-foreground transition-transform duration-500 ${expandedId === ex.id ? 'rotate-180 text-foreground' : ''}`} />
                                    </div>
                                </div>
                                {expandedId === ex.id && (
                                    <div className="px-10 pb-10 pt-2 bg-background/30 border-t border-sidebar-border/50 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                                            <div className="space-y-3">
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block ml-1"> Target Muscolare </span>
                                                <p className="text-xs font-black italic uppercase text-white bg-zinc-950 inline-block px-5 py-2.5 rounded-xl shadow-lg border border-white/5">
                                                    {ex.muscle_group?.name || 'SENZA CATEGORIA'}
                                                </p>
                                            </div>
                                            <div className="space-y-3 md:col-span-2">
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block ml-1"> Dettagli Tecnici </span>
                                                <div className="flex gap-4 text-sm text-foreground/80 leading-relaxed bg-background/50 rounded-2xl p-5 border border-sidebar-border shadow-inner">
                                                    <Info size={18} className="shrink-0 mt-0.5 text-primary" />
                                                    <p className="font-bold uppercase italic text-[11px] tracking-tight">
                                                        {ex.description || "Nessuna specifica tecnica disponibile per questo esercizio."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-32 bg-sidebar border-2 border-dashed border-sidebar-border rounded-[3rem]">
                            <Dumbbell size={48} className="mx-auto text-muted-foreground/20 mb-6" />
                            <p className="text-muted-foreground uppercase italic text-[10px] font-black tracking-[0.4em]"> Database Esercizi Vuoto </p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal 
                isOpen={isDeleteOpen} 
                onClose={() => setIsDeleteOpen(false)} 
                onConfirm={handleConfirmDelete} 
                loading={processing} 
                title="Elimina Esercizio" 
                description={`Stai per rimuovere "${exerciseToDelete?.name.toUpperCase()}" dal database. Questa azione potrebbe influenzare le schede di allenamento esistenti.`} 
                confirmText="Sì, Rimuovi Esercizio" 
            />
        </AppLayout>
    );
}