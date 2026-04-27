import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { UserPlus, Users } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { ResourceList } from '@/components/custom/resource-list';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface Props {
    clients: Client[];
}

export default function MyClients({ clients = [] }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Clienti', href: '/pt/clients/manage-clients' }]}>
            <Head title="Associa Nuovi Clienti" />
            <div className="p-6 md:p-10 flex flex-col gap-10 w-full"> 
                <HeaderNew 
                    title="I Miei Atleti" 
                    subtitle="Gestione della lista atleti associati e monitoraggio performance." 
                    icon={Users} 
                    buttonText="Associa Cliente" 
                    buttonHref="/pt/clients/assign" 
                    buttonIcon={<UserPlus size={16} />} 
                />

                <div className="w-full">
                    {/* Passiamo il tipo "clients". 
                        Il componente ResourceList si occuperà di renderizzare le card 
                        con i tasti "Nuova Scheda" e "Visualizza Schede".
                    */}
                    <ResourceList 
                        items={clients} 
                        type="clients" 
                    />
                </div>
            </div>
            </AppLayout>
    );
}