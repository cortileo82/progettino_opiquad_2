import React, { useState, useEffect } from 'react'; 
import { Head, router } from '@inertiajs/react';
import { Target, Plus, BicepsFlexed, Search } from 'lucide-react'; 
import AppLayout from '@/layouts/app-layout';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { HeaderNew } from '@/components/custom/header-new';
import { ResourceList } from '@/components/custom/resource-list';
import Pagination from '@/components/custom/pagination';
import { EmptyState } from '@/components/custom/empty-state';
import { Input } from '@/components/ui/input'; 

interface MuscleGroup {
    id: number;
    name: string;
}

interface PaginatedMuscleGroups {
    data: MuscleGroup[];
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
}

interface Props {
    muscleGroups: PaginatedMuscleGroups;
    filters: { search?: string }; // Aggiunta prop filters
}

export default function MuscleGroupIndex({ muscleGroups, filters }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<{ id: number, name: string } | null>(null);
    const [processing, setProcessing] = useState(false);

    // 1. Stato per la ricerca inizializzato dai filtri URL
    const [search, setSearch] = useState(filters.search || '');

    const groupList = muscleGroups.data || [];

    // 2. Logica di Debounce per la ricerca
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

    const handleDeleteClick = (id: number) => {
        const group = groupList.find(g => g.id === id);
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
            <div className="w-full p-6 md:p-10">   
                
                <HeaderNew 
                    title="Gruppi Muscolari"
                    subtitle="Gestione delle categorie muscolari per gli esercizi."
                    icon={BicepsFlexed}
                    actions={
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input 
                                placeholder="CERCA GRUPPO MUSCOLARE" 
                                className="pl-12 bg-sidebar border-sidebar-border rounded-2xl h-14 uppercase italic font-black text-[10px] tracking-widest w-full md:w-[300px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    }
                    buttonText="Nuovo Gruppo"
                    buttonHref="/admin/muscle-groups/create"
                    buttonIcon={<Plus size={16} />} 
                />

                <div className="mt-6">
                    {groupList.length > 0 ? (
                        <div className="space-y-6">
                            <ResourceList 
                                items={groupList}
                                type="muscle-groups"
                                onDelete={handleDeleteClick}
                                editBaseUrl="/admin/muscle-groups"
                            />

                            <Pagination 
                                meta={{
                                    current_page: muscleGroups.current_page,
                                    total: muscleGroups.total,
                                    per_page: muscleGroups.per_page
                                }} 
                                // 4. Passiamo il parametro search alla paginazione
                                queryParams={{ search }}
                            />
                        </div>
                    ) : (
                        <EmptyState message={search ? "Nessun gruppo muscolare corrisponde alla ricerca" : "Nessun gruppo muscolare trovato"} icon={Target} />
                    )}
                </div>

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