import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Target, Plus, BicepsFlexed } from 'lucide-react'; // Usiamo Target o BicepsFlexed per i gruppi
import AppLayout from '@/layouts/app-layout';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { HeaderNew } from '@/components/custom/header-new';
import { ResourceList } from '@/components/custom/resource-list';

interface MuscleGroup {
    id: number;
    name: string;
}

interface Props {
    // La prop deve chiamarsi come quella inviata dal Controller Laravel
    muscleGroups: MuscleGroup[]; 
}

export default function MuscleGroupIndex({ muscleGroups = [] }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<{ id: number, name: string } | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleDeleteClick = (id: number) => {
        // Qui usiamo muscleGroups, NON exercises!
        const group = muscleGroups.find(g => g.id === id);
        if (group) {
            setGroupToDelete({ id: group.id, name: group.name });
            setIsDeleteOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (!groupToDelete) return;
        
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

            <div className="w-full p-6 md:p-10 max-w-5xl mx-auto">   
                
                {/*Header con componente*/}
                <HeaderNew 
                    title="Gruppi Muscolari"
                    subtitle="Gestione delle categorie muscolari per gli esercizi."
                    icon={BicepsFlexed}
                    buttonText="Nuovo Gruppo"
                    buttonHref="/admin/muscle-groups/create"
                    buttonIcon={<Plus size={16} />} 
                />

                {/*Lista gruppi con componente */}
                <div className="mt-6">
                    {muscleGroups.length > 0 ? (
                        <ResourceList 
                            items={muscleGroups} // <--- Passiamo muscleGroups
                            type="muscle-groups"
                            onDelete={handleDeleteClick}
                            editBaseUrl="/admin/muscle-groups"
                        />
                    ) : (
                        <div className="text-center py-32 bg-sidebar border-2 border-dashed border-sidebar-border rounded-[3rem]">
                            <Target size={48} className="mx-auto text-muted-foreground/20 mb-6" />
                            <p className="text-muted-foreground uppercase italic text-[10px] font-black tracking-[0.4em]"> 
                                Nessun gruppo muscolare trovato 
                            </p>
                        </div>
                    )}
                </div>
            </div>

                    {/*Modale per eliminare gruppo */}
            <ConfirmationModal 
                isOpen={isDeleteOpen} 
                onClose={() => setIsDeleteOpen(false)} 
                onConfirm={handleConfirmDelete} 
                loading={processing} 
                title="Elimina Gruppo" 
                description={`Stai per eliminare "${groupToDelete?.name.toUpperCase()}". Il gruppo verrà eliminato solo se non ci sono esercizi associati ad esso.`} 
                confirmText="Sì, Elimina" 
            />
        </AppLayout>
    );
}