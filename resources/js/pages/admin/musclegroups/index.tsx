import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2, Dumbbell, Plus, Info } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface MuscleGroup {
    id: number;
    name: string;
}

interface Props {
    muscleGroups: MuscleGroup[];
}

export default function MuscleGroupIndex({ muscleGroups = [] }: Props) {
    const { flash } = usePage().props as any;

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<MuscleGroup | null>(null);
    const [processing, setProcessing] = useState(false);

    const openDeleteModal = (group: MuscleGroup) => {
        setGroupToDelete(group);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!groupToDelete) return;
        
        // ROTTA CON TRATTINO PER IL DELETE
        router.delete(`/admin/muscle-groups/${groupToDelete.id}`, {
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setIsDeleteOpen(false);
                setGroupToDelete(null);
            },
            preserveScroll: true
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gruppi Muscolari', href: '/admin/muscle-groups' }]}>
            <Head title="Gestione Gruppi Muscolari" />
            <div className="w-full p-6 md:p-10">
                
                <div className="mb-10 border-b border-sidebar-border pb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground leading-none"> 
                                Gruppi Muscolari 
                            </h1>
                            <p className="text-muted-foreground text-[10px] font-bold mt-2 uppercase tracking-[0.2em] opacity-70"> 
                                Gestione categorie muscolari 
                            </p>
                        </div>
                        
                        {/* ROTTA CON TRATTINO PER IL CREATE */}
                        <Link href="/admin/muscle-groups/create">
                            <Button className="bg-zinc-950 hover:bg-zinc-900 text-white rounded-2xl px-8 py-6 h-auto flex items-center gap-4 transition-all shadow-2xl active:scale-95 border border-white/5 group">
                                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                <span className="font-black uppercase italic tracking-[0.2em] text-xs"> Nuovo Gruppo </span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* --- SEZIONE FLASH MESSAGES --- */}
                {flash.error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl flex items-center gap-3">
                        <Info size={20} />
                        <span className="font-bold text-sm tracking-wide uppercase">{flash.error}</span>
                    </div>
                )}
                
                {flash.success && (
                    <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-500 px-6 py-4 rounded-xl flex items-center gap-3">
                        <Info size={20} />
                        <span className="font-bold text-sm tracking-wide uppercase">{flash.success}</span>
                    </div>
                )}
                {/* ------------------------------ */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {muscleGroups.length > 0 ? (
                        muscleGroups.map((group) => (
                            <div key={group.id} className="bg-sidebar border border-sidebar-border rounded-[2rem] p-6 flex items-center justify-between shadow-sm hover:border-foreground/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-background text-muted-foreground rounded-xl">
                                        <Dumbbell size={20} />
                                    </div>
                                    <span className="font-black uppercase italic text-lg tracking-tight text-foreground"> 
                                        {group.name} 
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* ROTTA CON TRATTINO PER L'EDIT */}
                                    <Link 
                                        href={`/admin/muscle-groups/${group.id}/edit`} 
                                        className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all"
                                    >
                                        <Pencil size={18} />
                                    </Link>
                                    <button 
                                        onClick={() => openDeleteModal(group)} 
                                        className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-sidebar border-2 border-dashed border-sidebar-border rounded-[3rem]">
                            <p className="text-muted-foreground uppercase italic text-[10px] font-black tracking-[0.4em]"> Nessun gruppo muscolare presente </p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal 
                isOpen={isDeleteOpen} 
                onClose={() => setIsDeleteOpen(false)} 
                onConfirm={handleConfirmDelete} 
                loading={processing} 
                title="Elimina Gruppo Muscolare" 
                description={`Stai per rimuovere "${groupToDelete?.name.toUpperCase()}". Se ci sono esercizi collegati, l'operazione verrà bloccata dal server.`} 
                confirmText="Sì, Rimuovi" 
            />
        </AppLayout>
    );
}