import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Dumbbell, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { ResourceList } from '@/components/custom/resource-list';
import { HeaderNew } from '@/components/custom/header-new';
import AntdPagination from '@/components/custom/pagination';
import { EmptyState } from '@/components/custom/empty-state';

interface Props {
    exercises: {
        data: any[];
        current_page: number;
        total: number;
        per_page: number;
    };
    filters: { search?: string };
}

export default function ExerciseCatalog({ exercises, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Controlliamo che la ricerca sia effettivamente cambiata rispetto ai filtri attuali
            if (search !== (filters.search || '')) {
                router.get(
                    window.location.pathname,
                    { search: search }, 
                    { 
                        preserveState: true, 
                        replace: true, 
                        preserveScroll: true 
                    }
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // Calcolo dei metadati per la paginazione
    const paginationMeta = {
        current_page: exercises?.current_page || 1,
        total: exercises?.total || 0,
        per_page: exercises?.per_page || 12
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Catalogo Esercizi', href: '#' }]}>
            <Head title="Catalogo Tecnico Esercizi" />

            <div className="flex h-full flex-col gap-8 p-6 md:p-10">
                <HeaderNew 
                    title="CATALOGO ESERCIZI"
                    subtitle="Database tecnico degli esercizi disponibili"
                    icon={Dumbbell}
                    actions={
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input 
                                placeholder="Cerca esercizio" 
                                className="pl-12 bg-sidebar border-sidebar-border rounded-2xl h-14 uppercase italic font-black text-[10px] tracking-widest w-full md:w-[300px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    }
                />

                <div className="w-full">
                    {exercises?.data?.length > 0 ? (
                        <>
                            <ResourceList items={exercises.data} type="exercises" readOnly={true} />

                            <AntdPagination meta={paginationMeta} queryParams={{ search }} />
                        </>
                    ) : (
                        /* Componente EmptyState per db vuoto */
                        <EmptyState message="Nessun esercizio trovato" icon={Dumbbell} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}