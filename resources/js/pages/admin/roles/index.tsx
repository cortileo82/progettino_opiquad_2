import React, { useState } from 'react';
import { ShieldCheck, Plus } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { ResourceList } from '@/components/custom/resource-list';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import AntdPagination from '@/components/custom/pagination';

// ARCHITETTURA FIX: Importiamo il modale di conferma per allinearci al Design System
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface RoleIndexProps {
    roles: {
        data: any[];
        current_page: number;
        total: number;
        per_page: number;
    };
    protectedRoles: string[];
}

export default function RoleIndex({ roles, protectedRoles }: RoleIndexProps) {
    // ARCHITETTURA FIX: Aggiungiamo lo stato per gestire l'apertura/chiusura del modale
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<{ id: number, name: string } | null>(null);
    const [processing, setProcessing] = useState(false);

    const formattedRoles = roles.data.map(role => ({
        ...role,
        description: role.permissions.length > 0
            ? role.permissions.map((p: any) => p.name).join(', ')
            : 'Nessun permesso assegnato a questo ruolo.',
        isProtected: protectedRoles.includes(role.name.toLowerCase()),
        hideActions: protectedRoles.includes(role.name.toLowerCase())
    }));

    // ARCHITETTURA FIX: Fase 1 - Preparazione. Troviamo il ruolo cliccato e apriamo il modale.
    const handleDeleteClick = (id: number) => {
        const role = roles.data.find(r => r.id === id);
        if (role) {
            setRoleToDelete({ id: role.id, name: role.name });
            setIsDeleteOpen(true);
        }
    };

    // ARCHITETTURA FIX: Fase 2 - Esecuzione. Chiamata al server con gestione dei caricamenti.
    const handleConfirmDelete = () => {
        if (!roleToDelete) return;
        
        router.delete(`/admin/roles/${roleToDelete.id}`, {
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setIsDeleteOpen(false);
                setRoleToDelete(null);
            },
            preserveScroll: true
        });
    };

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
                    {/* Sostituiamo onDelete con la nuova funzione che apre il modale */}
                    <ResourceList 
                        items={formattedRoles} 
                        type="roles" 
                        editBaseUrl="/admin/roles" 
                        onDelete={handleDeleteClick} 
                    />
                    
                    <AntdPagination 
                        meta={{
                            current_page: roles.current_page,
                            total: roles.total,
                            per_page: roles.per_page
                        }} 
                    />
                </div>
            </div>

            {/* Il Modale per l'eliminazione. Resta invisibile finché isDeleteOpen non diventa true */}
            <ConfirmationModal 
                isOpen={isDeleteOpen} 
                onClose={() => setIsDeleteOpen(false)} 
                onConfirm={handleConfirmDelete} 
                loading={processing} 
                title="Elimina Ruolo" 
                description={`Stai per eliminare in modo definitivo il ruolo "${roleToDelete?.name.toUpperCase()}". Questa azione è irreversibile.`} 
                confirmText="Sì, Elimina" 
            />
        </AppLayout>
    );
}