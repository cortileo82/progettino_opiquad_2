import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Dumbbell, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { HeaderNew } from '@/components/custom/header-new';
import { ResourceList } from '@/components/custom/resource-list';

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

interface Props {
    exercises: Exercise[];
}

export default function ExerciseIndex({ exercises = [] }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState<{ id: number, name: string } | null>(null);
    const [processing, setProcessing] = useState(false);

    /**
     * Gestisce l'apertura della modale di eliminazione
     * Riceve l'ID dal componente ResourceList
     */
    const handleDeleteClick = (id: number) => {
        const exercise = exercises.find(ex => ex.id === id);
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

            <div className="w-full p-6 md:p-10 max-w-5xl mx-auto">   
                
                <HeaderNew 
                    title="Gestione Esercizi"
                    subtitle="Gestione completa degli esercizi e parametri tecnici."
                    icon={Dumbbell}
                    buttonText="Nuovo Esercizio"
                    buttonHref="/admin/exercises/create"
                    buttonIcon={<Plus size={16} />} 
                />

                <div className="mt-6">
                    {exercises && exercises.length > 0 ? (
                        <ResourceList 
                            items={exercises}
                            type="exercises"
                            onDelete={handleDeleteClick}
                            // Assicurati che questo URL corrisponda esattamente a php artisan route:list
                            editBaseUrl="/admin/exercises"
                        />
                    ) : (
                        <div className="text-center py-32 bg-sidebar border-2 border-dashed border-sidebar-border rounded-[3rem]">
                            <Dumbbell size={48} className="mx-auto text-muted-foreground/20 mb-6" />
                            <p className="text-muted-foreground uppercase italic text-[10px] font-black tracking-[0.4em]"> 
                                Database Esercizi Vuoto 
                            </p>
                        </div>
                    )}
                </div>
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
            />
        </AppLayout>
    );
}