import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Target, Plus, BicepsFlexed } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { HeaderNew } from '@/components/custom/header-new';
import { ResourceList } from '@/components/custom/resource-list';
import Pagination from '@/components/custom/pagination';
import { EmptyState } from '@/components/custom/empty-state';

interface MuscleGroup {
    id: number;
    name: string;
}

// Interfaccia per i dati paginati da Laravel
interface PaginatedMuscleGroups {
    data: MuscleGroup[];
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
}

interface Props {
    // La prop riflette la struttura paginata
    muscleGroups: PaginatedMuscleGroups; 
}

export default function MuscleGroupIndex({ muscleGroups }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<{ id: number, name: string } | null>(null);
    const [processing, setProcessing] = useState(false);

    // Estraiamo la lista effettiva dei gruppi
    const groupList = muscleGroups.data || [];

    /**
     * Gestisce l'apertura della modale di eliminazione
     */
    const handleDeleteClick = (id: number) => {
        const group = groupList.find(g => g.id === id);
        if (group) {
            setGroupToDelete({ id: group.id, name: group.name });
            setIsDeleteOpen(true);
        }
    };

    /**
     * Esegue la richiesta DELETE al server
     */
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
            <div className="w-full p-6 md:p-10">   
                
                {/* Header con componente */}
                <HeaderNew 
                    title="Gruppi Muscolari"
                    subtitle="Gestione delle categorie muscolari per gli esercizi."
                    icon={BicepsFlexed}
                    buttonText="Nuovo Gruppo"
                    buttonHref="/admin/muscle-groups/create"
                    buttonIcon={<Plus size={16} />} 
                />

                <div className="mt-6">
                    {groupList.length > 0 ? (
                        <div className="space-y-6">
                            {/* Lista gruppi */}
                            <ResourceList 
                                items={groupList}
                                type="muscle-groups"
                                onDelete={handleDeleteClick}
                                editBaseUrl="/admin/muscle-groups"
                            />

                            {/* Paginazione */}
                            <Pagination 
                                meta={{
                                    current_page: muscleGroups.current_page,
                                    total: muscleGroups.total,
                                    per_page: muscleGroups.per_page
                                }} 
                            />
                        </div>
                    ) : (
                        /* Stato vuoto con componente dedicato */
                        <EmptyState 
                            message="Nessun gruppo muscolare trovato" 
                            icon={Target} 
                        />
                    )}
                </div>

            {/* Modale per eliminare gruppo */}
            <ConfirmationModal 
                isOpen={isDeleteOpen} 
                onClose={() => setIsDeleteOpen(false)} 
                onConfirm={handleConfirmDelete} 
                loading={processing} 
                title="Elimina Gruppo" 
                description={`Stai per eliminare "${groupToDelete?.name.toUpperCase()}". Il gruppo verrà eliminato solo se non ci sono esercizi associati ad esso.`} 
                confirmText="Sì, Elimina" 
            />
        </div>
        </AppLayout>
    );
}