import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { UserPlus, Users, UserX, Search } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { ResourceList } from '@/components/custom/resource-list';
import { EmptyState } from '@/components/custom/empty-state'; // Importato correttamente
import AntdPagination from '@/components/custom/pagination';
import { Input } from '@/components/ui/input';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface Props {
    clients: {
        data: Client[];
        current_page: number;
        total: number;
        per_page: number;
    };
    stats: {
        my_clients_count: number;
    };
    filters: { search?: string };
}

export default function MyClients({ clients, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

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

    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Clienti', href: '#' }]}>
            <Head title="I Miei Atleti" />
            
            <div className="p-6 md:p-10 flex flex-col gap-10 w-full max-w-7xl mx-auto"> 
                
                {/* Header con componente */}

                <HeaderNew 
                    title="I Miei Atleti" 
                    subtitle={`Visualizzazione dei tuoi ${stats.my_clients_count} atleti associati.`} 
                    icon={Users} 
                    actions={
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input 
                                placeholder="CERCA ATLETA" 
                                className="pl-12 bg-sidebar border-sidebar-border rounded-2xl h-14 uppercase italic font-black text-[10px] tracking-widest w-full md:w-[300px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    }
                    buttonText="Associa Cliente" 
                    buttonHref="/pt/clients/assign" 
                    buttonIcon={<UserPlus size={16} />} 
                />

                <div className="w-full">
                    {/* Visualizza solo se presenti altrimenti EmptyState */}
                    {clients.data.length > 0 ? (
                        <div className="space-y-6">
                            <ResourceList items={clients.data} type="clients" />
                            
                            <AntdPagination 
                                meta={{
                                    current_page: clients.current_page,
                                    total: clients.total,
                                    per_page: clients.per_page
                                }} 
                                queryParams={{ search }} 
                            />
                        </div>
                    ) : (
                        /* EmptyState con componente */
                        <EmptyState message={search ? `Nessun risultato trovato per "${search.toUpperCase()}"` : "Nessun atleta associato al tuo profilo"} icon={UserX} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}