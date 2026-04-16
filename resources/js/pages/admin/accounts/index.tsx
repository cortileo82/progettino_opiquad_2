import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Pencil, 
    Trash2, 
    ChevronDown, 
    User as UserIcon, 
    Mail, 
    Plus,
    UserCircle
} from 'lucide-react';

// UI Components
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
    trainer?: {
        id: number;
        name: string;
    };
}

interface Props {
    users: User[];
    personalTrainers: { id: number; name: string }[];
    auth: { user: User };
}

export default function Index({ users = [], personalTrainers = [], auth }: Props) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

    useEffect(() => {
        if (data.role !== 'client' && data.trainer_id !== 'none') {
            setData('trainer_id', 'none');
        }
    }, [data.role]);

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
            onSuccess: () => {
                setIsEditOpen(false);
                reset();
            },
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('ELIMINARE DEFINITIVAMENTE L\'ACCOUNT?')) {
            router.delete(`/admin/accounts/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Account', href: '/admin/accounts' }]}>
            <Head title="Gestione Account" />

            <div className="w-full p-6 md:p-10">
                
                {/* Header con Titolo e Pulsante "Lungo" Nero */}
                <div className="mb-8 border-b border-sidebar-border pb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tighter uppercase italic text-foreground">
                                Gestione Account
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium mt-1">
                                Controllo accessi e anagrafica utenti.
                            </p>
                        </div>
                        
                        <Link href="/admin/accounts/create">
                            <Button className="bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg px-8 py-2.5 h-auto flex items-center gap-3 transition-all shadow-md active:scale-95 group">
                                <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                                <span className="font-black uppercase italic tracking-[0.2em] text-[10px]">
                                    Nuovo Utente
                                </span>
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="space-y-4">
                    {users.map((user) => (
                        <div 
                            key={user.id} 
                            className={`bg-sidebar border rounded-2xl transition-all duration-300 ${
                                expandedId === user.id 
                                ? 'border-primary/50 ring-1 ring-primary/20 shadow-xl' 
                                : 'border-sidebar-border hover:border-primary/30'
                            } overflow-hidden`}
                        >
                            <div 
                                className="flex items-center justify-between p-5 cursor-pointer" 
                                onClick={() => toggleExpand(user.id)}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`p-3 rounded-xl transition-colors ${expandedId === user.id ? 'bg-zinc-950 text-white' : 'bg-background text-muted-foreground'}`}>
                                        <UserIcon size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-extrabold uppercase text-base tracking-widest text-foreground italic">
                                            {user.name}
                                        </span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${user.role === 'admin' ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 border-r border-sidebar-border pr-4">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditModal(user);
                                            }}
                                            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-all"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        
                                        {user.id !== auth.user.id && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(user.id);
                                                }}
                                                className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <ChevronDown 
                                        size={20} 
                                        className={`text-muted-foreground transition-transform duration-300 ml-1 ${expandedId === user.id ? 'rotate-180 text-primary' : ''}`} 
                                    />
                                </div>
                            </div>

                            {expandedId === user.id && (
                                <div className="px-8 pb-8 pt-4 bg-background/20 border-t border-sidebar-border/50 animate-in fade-in slide-in-from-top-2 italic uppercase">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary block">
                                                Email Contatto
                                            </span>
                                            <div className="flex items-center gap-3 text-sm font-bold text-foreground bg-background rounded-xl p-3 border border-sidebar-border lowercase">
                                                <Mail size={14} className="text-primary" />
                                                {user.email}
                                            </div>
                                        </div>

                                        {/* Mostra PT solo se l'utente è Client */}
                                        {user.role === 'client' && (
                                            <div className="space-y-2">
                                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground block">
                                                    Personal Trainer
                                                </span>
                                                <div className="flex items-center gap-3 text-sm font-bold text-foreground bg-background rounded-xl p-3 border border-sidebar-border">
                                                    <UserCircle size={14} className="text-muted-foreground" />
                                                    {user.trainer ? user.trainer.name : 'LIBERO / NON ASSEGNATO'}
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

            {/* Modale Modifica */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="rounded-xl border border-sidebar-border bg-sidebar p-6 shadow-lg italic uppercase">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">Modifica Account</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" className="text-[10px] font-black tracking-widest">Nome Completo</Label>
                            <Input 
                                id="edit-name"
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                className="rounded-md border-sidebar-border bg-background italic font-bold" 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-email" className="text-[10px] font-black tracking-widest">Email</Label>
                            <Input 
                                id="edit-email"
                                type="email"
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                                className="rounded-md border-sidebar-border bg-background font-bold" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black tracking-widest">Ruolo</Label>
                                <Select value={data.role} onValueChange={(v) => setData('role', v)}>
                                    <SelectTrigger className="rounded-md border-sidebar-border uppercase font-bold text-xs h-10 bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="italic uppercase font-bold">
                                        <SelectItem value="admin">ADMIN</SelectItem>
                                        <SelectItem value="pt">PT</SelectItem>
                                        <SelectItem value="client">CLIENT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {data.role === 'client' && (
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black tracking-widest">Trainer</Label>
                                    <Select value={data.trainer_id.toString()} onValueChange={(v) => setData('trainer_id', v)}>
                                        <SelectTrigger className="rounded-md border-sidebar-border uppercase font-bold text-xs h-10 bg-background">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="italic uppercase font-bold">
                                            <SelectItem value="none">NESSUNO / LIBERO</SelectItem>
                                            {personalTrainers?.map((pt) => (
                                                <SelectItem key={pt.id} value={pt.id.toString()}>
                                                    {pt.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 pt-2 border-t border-sidebar-border">
                            <Label htmlFor="edit-pass" className="text-primary text-[10px] font-black">Password (Solo se vuoi cambiarla)</Label>
                            <Input 
                                id="edit-pass"
                                type="password" 
                                placeholder="********" 
                                className="rounded-md border-sidebar-border h-10 bg-background" 
                                onChange={e => setData('password', e.target.value)} 
                            />
                        </div>

                        <DialogFooter className="gap-2 pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsEditOpen(false)}
                                className="h-10 italic font-bold uppercase text-xs tracking-widest"
                            >
                                Annulla
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing} 
                                className="bg-zinc-950 text-white hover:bg-zinc-800 h-10 italic font-bold uppercase text-xs tracking-widest px-6"
                            >
                                {processing ? 'Salvataggio...' : 'Aggiorna Account'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}