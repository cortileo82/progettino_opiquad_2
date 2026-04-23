import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, Link } from '@inertiajs/react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
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

                {/* Lista Cards */}
                <div className="space-y-4 mt-6">
                    {users.map((user) => (
                        <div 
                            key={user.id} 
                            className={`bg-sidebar border rounded-[2rem] transition-all duration-300 ${
                                expandedId === user.id 
                                ? 'border-foreground ring-1 ring-foreground/10 shadow-2xl scale-[1.01]' 
                                : 'border-sidebar-border hover:border-foreground/20'
                            } overflow-hidden`}
                        >
                            <div 
                                className="flex items-center justify-between p-6 cursor-pointer" 
                                onClick={() => toggleExpand(user.id)}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-2xl transition-all duration-500 ${expandedId === user.id ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'}`}>
                                        <UserIcon size={22} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black uppercase italic text-lg tracking-tight text-foreground">
                                            {user.name}
                                        </span>
                                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] mt-0.5 ${user.role === 'admin' ? 'text-red-500' : 'text-primary'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 border-r border-sidebar-border pr-5">
                                        {/* LINK ALLA PAGINA EDIT (Sostituisce la modale) */}
                                        <Link 
                                            href={`/admin/accounts/${user.id}/edit`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all"
                                        >
                                            <Pencil size={18} />
                                        </Link>
                                        
                                        {user.id !== auth.user.id && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); openDeleteModal(user.id); }}
                                                className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                    <ChevronDown 
                                        size={20} 
                                        className={`text-muted-foreground transition-transform duration-500 ${expandedId === user.id ? 'rotate-180 text-foreground' : ''}`} 
                                    />
                                </div>
                            </div>

                            {expandedId === user.id && (
                                <div className="px-10 pb-10 pt-2 bg-background/30 border-t border-sidebar-border/50 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                                        <div className="space-y-3">
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block ml-1">
                                                Email di Riferimento
                                            </span>
                                            <div className="flex items-center gap-4 text-sm font-bold text-foreground bg-background rounded-2xl p-4 border border-sidebar-border shadow-inner">
                                                <Mail size={16} className="text-primary" />
                                                {user.email}
                                            </div>
                                        </div>

                                        {user.role === 'client' && (
                                            <div className="space-y-3">
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block ml-1">
                                                    Responsabile Tecnico
                                                </span>
                                                <div className="flex items-center gap-4 text-sm font-bold text-foreground bg-background rounded-2xl p-4 border border-sidebar-border shadow-inner uppercase italic">
                                                    <UserCircle size={16} className="text-primary" />
                                                    {user.trainer ? user.trainer.name : 'DA ASSEGNARE'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
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