import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Dumbbell, Plus } from 'lucide-react';
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

interface Exercise {
    id: number;
    name: string;
    description?: string;
    muscle_group: MuscleGroup | null; 
}

// Struttura dati paginata da Laravel
interface PaginatedExercises {
    data: Exercise[];
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
}

interface Props {
    exercises: PaginatedExercises;
}

export default function ExerciseIndex({ exercises }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState<{ id: number, name: string } | null>(null);
    const [processing, setProcessing] = useState(false);

    // Estraiamo l'array di esercizi dai dati paginati
    const exerciseList = exercises.data || [];

    /**
     * Gestisce l'apertura della modale di eliminazione
     */
    const handleDeleteClick = (id: number) => {
        const exercise = exerciseList.find(ex => ex.id === id);
        if (exercise) {
            setExerciseToDelete({ id: exercise.id, name: exercise.name });
            setIsDeleteOpen(true);
        }
    };

    /**
     * Esegue la richiesta DELETE al server
     */
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
                
                <HeaderNew 
                    title="Gestione Esercizi"
                    subtitle="Gestione completa degli esercizi e parametri tecnici."
                    icon={Dumbbell}
                    buttonText="Nuovo Esercizio"
                    buttonHref="/admin/exercises/create"
                    buttonIcon={<Plus size={16} />} 
                />

                <div className="mt-6">
                    {exerciseList.length > 0 ? (
                        <div className="space-y-6">
                            <ResourceList 
                                items={exerciseList}
                                type="exercises"
                                onDelete={handleDeleteClick}
                                editBaseUrl="/admin/exercises"
                            />
                            
                            <Pagination 
                                meta={{
                                    current_page: exercises.current_page,
                                    total: exercises.total,
                                    per_page: exercises.per_page
                                }} 
                            />
                        </div>
                    ) : (
                        <EmptyState 
                            message="Database Esercizi Vuoto" 
                            icon={Dumbbell} 
                        />
                    )}
                </div>
            

            {/* Modale di conferma eliminazione */}
            <ConfirmationModal 
                isOpen={isDeleteOpen} 
                onClose={() => setIsDeleteOpen(false)} 
                onConfirm={handleConfirmDelete} 
                loading={processing} 
                title="Elimina Esercizio" 
                description={`Stai per rimuovere definitivamente "${exerciseToDelete?.name.toUpperCase()}". Questa azione non può essere annullata.`} 
                confirmText="Sì, Rimuovi Esercizio" 
            /></div>
            </AppLayout>
    );
}