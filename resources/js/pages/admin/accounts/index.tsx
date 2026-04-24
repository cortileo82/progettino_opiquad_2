import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, Link } from '@inertiajs/react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { ResourceList } from '@/components/custom/resource-list';
import { HeaderNew } from '@/components/custom/header-new';
import { 
    Pencil, 
    Trash2, 
    ChevronDown, 
    User as UserIcon, 
    Mail, 
    Plus,
    UserCircle,
    UserPlus
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    trainer_id: number | null;
    trainer?: { id: number; name: string; };
}

interface Props {
    users: User[];
    personalTrainers: { id: number; name: string }[];
    auth: { user: User };
}

export default function Index({ users = [], auth }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Gestione Modale Eliminazione
    const openDeleteModal = (id: number) => {
        setUserToDelete(id);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!userToDelete) return;
        
        router.delete(`/admin/accounts/${userToDelete}`, {
            preserveScroll: true,
            onBefore: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setIsDeleteOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Account', href: '/admin/accounts' }]}>
            <Head title="Gestione Account" />

            <div className="w-full p-6 md:p-10">
                
                {/* Header con componente */}
                <HeaderNew 
                    title="Gestione Utenti"
                    subtitle="Gestione completa degli utenti del sistema."
                    icon={UserPlus}
                    buttonText="Nuovo utente"
                    buttonHref="/admin/accounts/create"
                    buttonIcon={<Plus size={16} />} 
                />


                {/*Lista utenti con componente*/}
                <ResourceList 
                    items={users} 
                    type="users" 
                    onDelete={openDeleteModal} 
                    editBaseUrl="/admin/accounts"
                    authUserId={auth.user.id}
                />

            </div>

            {/* MODALE ELIMINAZIONE */}
            <ConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={processing}
                title="Elimina Account"
                description="Sei sicuro? Questa azione cancellerà l'utente e tutti i dati associati. L'operazione è irreversibile."
                confirmText="Sì, Elimina Definitivamente"
            />
        </AppLayout>
    );
}