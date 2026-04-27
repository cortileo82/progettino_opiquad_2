import React from 'react';
import { ShieldCheck, Plus, Lock } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new'; 
import { ResourceList } from '@/components/custom/resource-list'; 
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface RoleIndexProps {
    roles: any[];
}

export default function RoleIndex({ roles }: RoleIndexProps) {
    const protectedRoles = ['admin', 'pt', 'client'];
    const formattedRoles = roles.map(role => ({
        ...role,
        description: role.permissions.length > 0 
            ? role.permissions.map((p: any) => p.name).join(', ') 
            : 'Nessun permesso assegnato a questo ruolo.',
        isProtected: protectedRoles.includes(role.name.toLowerCase())
    }));

    return (
        <AppLayout breadcrumbs={[{ title: 'Ruoli', href: '/admin/rules' }]}>
            <Head title="Gestione Ruoli" />
        <div className="w-full p-6 md:p-10">

            {/* Header con componente */}
            <HeaderNew 
                title="GESTIONE RUOLI" 
                subtitle="Configurazione permessi e livelli di accesso"
                icon={ShieldCheck}
                buttonText="NUOVO RUOLO"
                buttonHref="/admin/roles/create"
                buttonIcon={<Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />}
            />

            {/* Lista utilizzando componente */}
            <ResourceList 
                items={roles} 
                type="roles" 
                readOnly={true} 
            />
        </div>
        </AppLayout>
    );
}