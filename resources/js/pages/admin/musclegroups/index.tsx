import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2, Plus, BicepsFlexed, Info } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { HeaderNew } from '@/components/custom/header-new';
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
        
        // URL Corretto senza trattini: /admin/musclegroups/
        router.delete(`/admin/musclegroups/${groupToDelete.id}`, {
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setIsDeleteOpen(false);
                setGroupToDelete(null);
            },
            // Importante: preserveScroll false aiuta a vedere l'aggiornamento della lista
            preserveScroll: false,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gruppi Muscolari', href: '/admin/musclegroups' }]}>
            <Head title="Gestione Gruppi Muscolari" />
            
            <div className="w-full p-6 md:p-10 max-w-4xl mx-auto">
                
                {/* Header Uniformato */}
                <HeaderNew 
                    title="Gruppi Muscolari" 
                    subtitle="Gestione categorie anatomiche del sistema." 
                    icon={BicepsFlexed}
                    buttonText="Nuovo Gruppo"
                    buttonHref="/admin/musclegroups/create"
                    buttonIcon={<Plus size={18} />}
                />

                {/* --- SEZIONE ERRORI (Lasciata solo per blocchi database) --- */}
                <div className="mt-8">
                    {flash.error && (
                        <div className="mb-6 bg-red-500/10 border-2 border-red-500/20 text-red-500 px-6 py-4 rounded-2xl flex items-center gap-3 italic">
                            <Info size={20} />
                            <span className="font-black text-[10px] tracking-widest uppercase">{flash.error}</span>
                        </div>
                    )}
                </div>

                {/* Lista Verticale */}
                <div className="flex flex-col gap-4 mt-4">
                    {muscleGroups.length > 0 ? (
                        muscleGroups.map((group) => (
                            <div 
                                key={group.id} 
                                className="bg-sidebar border-2 border-sidebar-border rounded-[2rem] p-5 flex items-center justify-between shadow-sm hover:border-foreground transition-all group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="p-3.5 bg-background border-2 border-sidebar-border text-muted-foreground rounded-2xl group-hover:border-foreground/20 transition-colors">
                                        <BicepsFlexed size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black uppercase italic text-lg tracking-tighter text-foreground leading-tight"> 
                                            {group.name} 
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Link 
                                        href={`/admin/musclegroups/${group.id}/edit`} 
                                        className="p-3 text-muted-foreground hover:text-foreground hover:bg-background rounded-xl border border-transparent hover:border-sidebar-border transition-all"
                                    >
                                        <Pencil size={18} />
                                    </Link>
                                    <button 
                                        type="button"
                                        onClick={() => openDeleteModal(group)} 
                                        className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-sidebar border-2 border-dashed border-sidebar-border rounded-[3rem]">
                            <BicepsFlexed size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                            <p className="text-muted-foreground uppercase italic text-[11px] font-black tracking-[0.5em]"> 
                                Nessun gruppo muscolare presente 
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modale di Conferma - Collegata correttamente a handleConfirmDelete */}
            <ConfirmationModal 
                isOpen={isDeleteOpen} 
                onClose={() => setIsDeleteOpen(false)} 
                onConfirm={handleConfirmDelete} 
                loading={processing} 
                title="Elimina Gruppo" 
                description={`Sei sicuro di voler rimuovere "${groupToDelete?.name.toUpperCase()}"? L'azione è irreversibile.`} 
                confirmText="Sì, Rimuovi" 
            />
        </AppLayout>
    );
}