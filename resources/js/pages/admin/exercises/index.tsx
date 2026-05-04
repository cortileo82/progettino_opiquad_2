import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Dumbbell, Plus, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { ResourceList } from '@/components/custom/resource-list';
import { HeaderNew } from '@/components/custom/header-new';
import AntdPagination from '@/components/custom/pagination';
import { EmptyState } from '@/components/custom/empty-state';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface Props {
    exercises: {
        data: any[];
        current_page: number;
        total: number;
        per_page: number;
    };
    filters: { search?: string };
}

export default function ExerciseIndex({ exercises, filters }: Props) {
    // 1. Stato ricerca
    const [search, setSearch] = useState(filters.search || '');

    // 2. Stati di eliminazione
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState<{ id: number, name: string } | null>(null);
    const [processing, setProcessing] = useState(false);

    // 3. Effect per la ricerca (Debounce)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    window.location.pathname,
                    { search: search },
                    { preserveState: true, replace: true, preserveScroll: true }
                );
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // 4. Handlers per l'eliminazione
    const openDeleteModal = (id: number) => {
        const exercise = exercises.data.find(ex => ex.id === id);
        if (exercise) {
            setExerciseToDelete({ id: exercise.id, name: exercise.name });
            setIsDeleteOpen(true);
        }
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

    // 5. Meta paginazione
    const paginationMeta = {
        current_page: exercises?.current_page || 1,
        total: exercises?.total || 0,
        per_page: exercises?.per_page || 10
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Esercizi', href: '/admin/exercises' }]}>
            <Head title="Gestione Esercizi" />

            <div className="flex h-full flex-col gap-8 p-6 md:p-10">
                <HeaderNew 
                    title="GESTIONE ESERCIZI"
                    subtitle="Amministrazione database tecnico esercizi"
                    icon={Dumbbell}
                    actions={
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input 
                                placeholder="CERCA ESERCIZIO" 
                                className="pl-12 bg-sidebar border-sidebar-border rounded-2xl h-14 uppercase italic font-black text-[10px] tracking-widest w-full md:w-[300px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    }
                    buttonText="Nuovo Esercizio"
                    buttonHref="/admin/exercises/create"
                    buttonIcon={<Plus size={16} />} 
                />

                <div className="w-full">
                    {exercises?.data?.length > 0 ? (
                        <>
                            <ResourceList 
                                items={exercises.data} 
                                type="exercises" 
                                onDelete={openDeleteModal}
                                editBaseUrl="/admin/exercises"
                            />
                            <AntdPagination meta={paginationMeta} queryParams={{ search }} />
                        </>
                    ) : (
                        <EmptyState message={search ? "Nessun risultato trovato" : "Database esercizi vuoto"} icon={Dumbbell} />
                    )}
                </div>

                <ConfirmationModal 
                    isOpen={isDeleteOpen} 
                    onClose={() => setIsDeleteOpen(false)} 
                    onConfirm={handleConfirmDelete} 
                    loading={processing} 
                    title="Elimina Esercizio" 
                    description={`Stai per rimuovere definitivamente "${exerciseToDelete?.name.toUpperCase()}".`} 
                    confirmText="Sì, Rimuovi" 
                />
            </div>
        </AppLayout>
    );
}