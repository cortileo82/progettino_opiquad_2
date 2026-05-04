import React, { useState, useEffect } from 'react'; 
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { ResourceList } from '@/components/custom/resource-list';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state'; 
import AntdPagination from '@/components/custom/pagination'; 
import { UserPlus, Plus, UserX, Search } from 'lucide-react'; 
import { Input } from '@/components/ui/input'; 

interface User { 
    id: number; 
    name: string; 
    email: string; 
    roles: { name: string }[]; 
    trainer_id: number | null; 
    trainer?: { id: number; name: string } 
}

interface Props { 
    users: {
        data: User[];
        current_page: number;
        total: number;
        per_page: number;
    }; 
    auth: { user: User }; 
    filters: { search?: string }; 
}

export default function Index({ users, auth, filters }: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    // Stato per la ricerca
    const [search, setSearch] = useState(filters.search || '');

    //  Logica per la ricerca
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

            <div className="w-full p-6 md:p-10"> 
                <HeaderNew 
                    title="Gestione Utenti" 
                    subtitle="Gestione completa degli utenti del sistema." 
                    icon={UserPlus} 
                    actions={
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input 
                                placeholder="CERCA UTENTE" 
                                className="pl-12 bg-sidebar border-sidebar-border rounded-2xl h-14 uppercase italic font-black text-[10px] tracking-widest w-full md:w-[300px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    }
                    buttonText="Nuovo utente" 
                    buttonHref="/admin/users/create"
                    buttonIcon={<Plus size={18} />}
                />
                
                <div className="w-full">
                    {users.data.length > 0 ? (
                        <>
                            <ResourceList 
                                items={users.data} 
                                type="users" 
                                onDelete={openDeleteModal} 
                                editBaseUrl="/admin/users"
                                authUserId={auth.user.id} 
                            />

                            <AntdPagination 
                                meta={{
                                    current_page: users.current_page,
                                    total: users.total,
                                    per_page: users.per_page
                                }} 
                                // Manteniamo la ricerca durante il cambio pagina
                                queryParams={{ search }}
                            />
                        </>
                    ) : (
                        <EmptyState message={search ? "Nessun utente corrisponde ai criteri di ricerca" : "Nessun utente trovato nel sistema"} icon={UserX} />
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