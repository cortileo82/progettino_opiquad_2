import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmationModal } from '@/components/ui/confirmation-modal'; // Import del nuovo modal
import { 
    Pencil, 
    Trash2, 
    ChevronDown, 
    User as UserIcon, 
    Mail, 
    Plus,
    UserCircle,
    ShieldCheck
} from 'lucide-react';

import { 
    Dialog, 
    DialogContent, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';

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

export default function Index({ users = [], personalTrainers = [], auth }: Props) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const { data, setData, patch, processing, reset, errors } = useForm({
        name: '',
        email: '',
        trainer_id: '' as string | number,
        password: '',
        role: '',
    });

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Gestione Modale Modifica
    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'client',
            trainer_id: user.trainer_id ? user.trainer_id.toString() : 'none',
            password: '',
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        patch(`/admin/accounts/${selectedUser.id}`, {
            onSuccess: () => { setIsEditOpen(false); reset(); },
            preserveScroll: true,
        });
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
            onSuccess: () => setIsDeleteOpen(false),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Account', href: '/admin/accounts' }]}>
            <Head title="Gestione Account" />

            <div className="w-full p-6 md:p-10">
                
                {/* Header Uniformato */}
                <div className="mb-10 border-b border-sidebar-border pb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground leading-none">
                                Gestione Account
                            </h1>
                            <p className="text-muted-foreground text-[10px] font-bold mt-2 uppercase tracking-[0.2em] opacity-70">
                                Controllo accessi, ruoli e anagrafica di sistema.
                            </p>
                        </div>
                        
                        <Link href="/admin/accounts/create">
                            <Button className="bg-zinc-950 hover:bg-zinc-900 text-white rounded-2xl px-8 py-6 h-auto flex items-center gap-4 transition-all shadow-2xl active:scale-95 group border border-white/5">
                                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                                <span className="font-black uppercase italic tracking-[0.2em] text-xs">
                                    Nuovo Utente
                                </span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Lista Cards */}
                <div className="space-y-4">
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
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); openEditModal(user); }}
                                            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        
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

            {/* MODALE ELIMINAZIONE (Il tuo nuovo ConfirmationModal) */}
            <ConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={processing}
                title="Elimina Account"
                description="Sei sicuro? Questa azione cancellerà l'utente e tutti i piani di allenamento associati. Non potrai tornare indietro."
                confirmText="Sì, Elimina Definitivamente"
            />

            {/* Modale Modifica */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="rounded-[2.5rem] border-2 border-sidebar-border bg-sidebar p-8 shadow-2xl max-w-md">
                    <DialogHeader className="mb-6 text-center sm:text-left">
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                            <ShieldCheck className="text-primary" size={28} />
                            Modifica Account
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1">Nome Utente</Label>
                            <Input 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                className="rounded-xl border-sidebar-border bg-background h-12 font-bold uppercase italic focus:ring-2 focus:ring-primary/20 transition-all" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1">Email</Label>
                            <Input 
                                type="email"
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                                className="rounded-xl border-sidebar-border bg-background h-12 font-bold focus:ring-2 focus:ring-primary/20 transition-all" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1">Ruolo</Label>
                                <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                                    <SelectTrigger className="rounded-xl border-sidebar-border bg-background h-12 font-black uppercase italic text-[10px] tracking-widest">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-sidebar border-sidebar-border rounded-xl">
                                        <SelectItem value="admin" className="font-black italic uppercase text-[10px] p-3">ADMIN</SelectItem>
                                        <SelectItem value="pt" className="font-black italic uppercase text-[10px] p-3">PT</SelectItem>
                                        <SelectItem value="client" className="font-black italic uppercase text-[10px] p-3">CLIENT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {data.role === 'client' && (
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1">Personal Trainer</Label>
                                    <Select value={data.trainer_id.toString()} onValueChange={(v) => setData('trainer_id', v)}>
                                        <SelectTrigger className="rounded-xl border-sidebar-border bg-background h-12 font-black uppercase italic text-[10px] tracking-widest">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-sidebar border-sidebar-border rounded-xl">
                                            <SelectItem value="none" className="font-black italic uppercase text-[10px] p-3 italic">LIBERO</SelectItem>
                                            {personalTrainers?.map((pt) => (
                                                <SelectItem key={pt.id} value={pt.id.toString()} className="font-black italic uppercase text-[10px] p-3">
                                                    {pt.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        <DialogFooter className="gap-3 mt-6 sm:flex-row flex-col">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsEditOpen(false)}
                                className="h-12 flex-1 rounded-xl border-sidebar-border font-black uppercase italic text-[10px] tracking-widest"
                            >
                                Annulla
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="h-12 flex-1 bg-zinc-950 text-white rounded-xl font-black uppercase italic text-[10px] tracking-widest shadow-xl hover:bg-zinc-900"
                            >
                                {processing ? 'Salvataggio...' : 'Aggiorna'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}