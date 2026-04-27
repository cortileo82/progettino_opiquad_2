import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { ResourceList } from '@/components/custom/resource-list';
import { HeaderNew } from '@/components/custom/header-new';
import { UserPlus, Plus } from 'lucide-react';

interface User { id: number; name: string; email: string; roles: { name: string }[]; trainer_id: number | null; trainer?: { id: number; name: string } }
interface Props { users: User[]; auth: { user: User }; }

export default function Index({ users = [], auth }: Props) {
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
            onFinish: () => { setProcessing(false); setIsDeleteOpen(false); }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Account', href: '/admin/users' }]}>
            <Head title="Gestione Account" />

            <div className="w-full p-6 md:p-10">
                <HeaderNew 
                    title="Gestione Utenti" 
                    subtitle="Gestione completa degli utenti del sistema." 
                    icon={UserPlus} 
                    buttonText="Nuovo utente" 
                    buttonHref="/admin/users/create"
                    buttonIcon={<Plus size={18} />}
                />
                
                <ResourceList 
                    items={users} 
                    type="users" 
                    onDelete={openDeleteModal} 
                    editBaseUrl="/admin/users"
                    authUserId={auth.user.id} 
                />
            
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