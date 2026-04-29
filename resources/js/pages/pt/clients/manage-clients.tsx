import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { UserPlus, Users, UserX } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { ResourceList } from '@/components/custom/resource-list';
import { EmptyState } from '@/components/custom/empty-state';
import AntdPagination from '@/components/custom/pagination';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface Props {
    // Laravel Paginate restituisce questa struttura esatta
    clients: {
        data: Client[];
        current_page: number;
        total: number;
        per_page: number;
    };
    stats: {
        my_clients_count: number;
    };
}

export default function MyClients({ clients, stats }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Clienti', href: '#' }]}>
            <Head title="I Miei Atleti" />
            
            <div className="p-6 md:p-10 flex flex-col gap-10 w-full max-w-7xl mx-auto"> 
                
                <HeaderNew 
                    title="I Miei Atleti" 
                    subtitle={`Visualizzazione dei tuoi ${stats.my_clients_count} atleti associati.`} 
                    icon={Users} 
                    buttonText="Associa Cliente" 
                    buttonHref="/pt/clients/assign" 
                    buttonIcon={<UserPlus size={16} />} 
                />

                <div className="w-full">
                    {/* Verifichiamo la presenza di dati nell'array paginato */}
                    {clients.data.length > 0 ? (
                        <>
                            <ResourceList items={clients.data} type="clients"  />
                           {/* Paginazione con componente */}
                            <AntdPagination 
                                meta={{
                                    current_page: clients.current_page,
                                    total: clients.total,
                                    per_page: clients.per_page
                                }} 
                                // Se non hai filtri attivi, queryParams può restare vuoto
                                queryParams={{}} 
                            />
                        </>
                    ) : (
                        <EmptyState  message="Nessun atleta associato al tuo profilo" icon={UserX} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}