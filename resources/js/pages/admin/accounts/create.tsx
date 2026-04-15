import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { UserPlus, Save, ArrowLeft, ShieldCheck, User, Mail, Lock, Dumbbell } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface PT {
    id: number;
    name: string;
}

interface Props {
    personalTrainers: PT[];
}

export default function Create({ personalTrainers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'client',
        pt_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/accounts');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Utenti', href: '/admin/accounts' }, { title: 'Nuovo Utente', href: '#' }]}>
            <Head title="Inserisci Nuovo Utente" />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-foreground flex items-center gap-3">
                            <UserPlus className="text-orange-500" size={32} />
                            Crea Nuovo Account
                        </h1>
                        <p className="text-muted-foreground">Registra un nuovo Admin, PT o Cliente nel sistema.</p>
                    </div>
                    <Link href="/admin/accounts" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={16} /> Annulla
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border border-sidebar-border bg-sidebar shadow-sm">
                        
                        {/* NOME */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <User size={14} /> Nome
                            </label>
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                className="w-full rounded-xl border-sidebar-border bg-background p-3 focus:border-orange-500 focus:ring-orange-500"
                                placeholder="Es: Mario"
                            />
                            {errors.first_name && <p className="text-xs text-red-500 font-bold">{errors.first_name}</p>}
                        </div>

                        {/* COGNOME */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <User size={14} /> Cognome
                            </label>
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                className="w-full rounded-xl border-sidebar-border bg-background p-3 focus:border-orange-500 focus:ring-orange-500"
                                placeholder="Es: Rossi"
                            />
                            {errors.last_name && <p className="text-xs text-red-500 font-bold">{errors.last_name}</p>}
                        </div>

                        {/* EMAIL */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <Mail size={14} /> Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full rounded-xl border-sidebar-border bg-background p-3 focus:border-orange-500 focus:ring-orange-500"
                                placeholder="mario.rossi@esempio.com"
                            />
                            {errors.email && <p className="text-xs text-red-500 font-bold">{errors.email}</p>}
                        </div>

                        {/* PASSWORD */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <Lock size={14} /> Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full rounded-xl border-sidebar-border bg-background p-3 focus:border-orange-500 focus:ring-orange-500"
                                placeholder="Minimo 8 caratteri"
                            />
                            {errors.password && <p className="text-xs text-red-500 font-bold">{errors.password}</p>}
                        </div>

                        {/* RUOLO */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <ShieldCheck size={14} /> Ruolo Sistema
                            </label>
                            <select
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                className="w-full rounded-xl border-sidebar-border bg-background p-3 focus:border-orange-500 focus:ring-orange-500 font-bold text-sm"
                            >
                                <option value="client">CLIENTE (Atleta)</option>
                                <option value="pt">PERSONAL TRAINER</option>
                                <option value="admin">ADMIN (Gestore)</option>
                            </select>
                            {errors.role && <p className="text-xs text-red-500 font-bold">{errors.role}</p>}
                        </div>

                        {/* ASSOCIAZIONE PT (CONDIZIONALE) */}
                        {data.role === 'client' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                                    <Dumbbell size={14} /> Assegna a Personal Trainer
                                </label>
                                <select
                                    value={data.pt_id}
                                    onChange={e => setData('pt_id', e.target.value)}
                                    className="w-full rounded-xl border-orange-500/30 bg-background p-3 focus:border-orange-500 focus:ring-orange-500 font-bold text-sm"
                                >
                                    <option value="">Nessun PT (Libero)</option>
                                    {personalTrainers.map(pt => (
                                        <option key={pt.id} value={pt.id}>{pt.name}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-muted-foreground italic">Opzionale: puoi assegnare il cliente in seguito.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-xl bg-orange-600 px-8 py-4 font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-orange-700 disabled:opacity-50"
                        >
                            <Save size={20} />
                            {processing ? 'Creazione...' : 'Salva Account'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}