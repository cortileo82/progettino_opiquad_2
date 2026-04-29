import React from 'react';
import { ShieldCheck, Plus } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new'; 
import { ResourceList } from '@/components/custom/resource-list'; 
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AntdPagination from '@/components/custom/pagination'; // Importiamo la paginazione

interface RoleIndexProps {
    // Ora roles è l'oggetto paginato di Laravel
    roles: {
        data: any[];
        current_page: number;
        total: number;
        per_page: number;
    };
}

export default function RoleIndex({ roles }: RoleIndexProps) {
    const protectedRoles = ['admin', 'pt', 'client'];

    // Manteniamo la tua logica di formattazione applicandola a roles.data
    const formattedRoles = roles.data.map(role => ({
        ...role,
        description: role.permissions.length > 0 
            ? role.permissions.map((p: any) => p.name).join(', ') 
            : 'Nessun permesso assegnato a questo ruolo.',
        isProtected: protectedRoles.includes(role.name.toLowerCase())
    }));

    return (
        <AppLayout breadcrumbs={[{ title: 'Ruoli', href: '/admin/roles' }]}>
            <Head title="Gestione Ruoli" />
            <div className="w-full p-6 md:p-10 flex flex-col gap-8">

                <HeaderNew 
                    title="GESTIONE RUOLI" 
                    subtitle="Configurazione permessi e livelli di accesso"
                    icon={ShieldCheck}
                    buttonText="NUOVO RUOLO"
                    buttonHref="/admin/roles/create"
                    buttonIcon={<Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />}
                />

                <div className="w-full space-y-6">
                    {/* Usiamo formattedRoles che deriva da roles.data */}
                    <ResourceList 
                        items={formattedRoles} 
                        type="roles" 
                        readOnly={true} 
                    />

                    {/* Aggiungiamo la paginazione in fondo */}
                    <AntdPagination 
                        meta={{
                            current_page: roles.current_page,
                            total: roles.total,
                            per_page: roles.per_page
                        }} 
                    />
                </div>
            </div>
        </AppLayout>
    );
}