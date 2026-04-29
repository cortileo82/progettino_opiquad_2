import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { ResourceList } from '@/components/custom/resource-list';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state'; 
import AntdPagination from '@/components/custom/pagination'; 
import { UserPlus, Plus, UserX } from 'lucide-react';

interface User { 
    id: number; 
    name: string; 
    email: string; 
    roles: { name: string }[]; 
    trainer_id: number | null; 
    trainer?: { id: number; name: string } 
}

interface Props { 
    // Aggiornato per riflettere la paginazione di Laravel
    users: {
        data: User[];
        current_page: number;
        total: number;
        per_page: number;
    }; 
    auth: { user: User }; 
}

export default function Index({ users, auth }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const openDeleteModal = (id: number) => {
        setUserToDelete(id);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!userToDelete) return;
        router.delete(`/admin/users/${userToDelete}`, {
            preserveScroll: true,
            onBefore: () => setProcessing(true),
            onFinish: () => { 
                setProcessing(false); 
                setIsDeleteOpen(false); 
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Account', href: '/admin/users' }]}>
            <Head title="Gestione Account" />

            <div className="w-full p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto">
                <HeaderNew 
                    title="Gestione Utenti" 
                    subtitle="Gestione completa degli utenti del sistema." 
                    icon={UserPlus} 
                    buttonText="Nuovo utente" 
                    buttonHref="/admin/users/create"
                    buttonIcon={<Plus size={18} />}
                />
                
                <div className="w-full">
                    {users.data.length > 0 ? (
                        <>
                            <ResourceList 
                                items={users.data} // Usiamo .data
                                type="users" 
                                onDelete={openDeleteModal} 
                                editBaseUrl="/admin/users"
                                authUserId={auth.user.id} 
                            />

                            {/* Componente Paginazione */}
                            <AntdPagination 
                                meta={{
                                    current_page: users.current_page,
                                    total: users.total,
                                    per_page: users.per_page
                                }} 
                            />
                        </>
                    ) : (
                        <EmptyState message="Nessun utente trovato nel sistema" icon={UserX} />
                    )}
                </div>
            
                <ConfirmationModal 
                    isOpen={isDeleteOpen} 
                    onClose={() => setIsDeleteOpen(false)} 
                    onConfirm={handleConfirmDelete} 
                    loading={processing} 
                    title="Elimina Account" 
                    description="Sei sicuro? Questa azione cancellerà l'utente e tutti i dati associati. L'operazione è irreversibile." 
                    confirmText="Sì, Elimina Definitivamente" 
                />
            </div>
        </AppLayout>
    );
}