import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { UserPlus, Save, ArrowLeft } from 'lucide-react';

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
        <AppLayout breadcrumbs={[{ title: 'Gestione Account', href: '/admin/accounts' }, { title: 'Nuovo Utente', href: '#' }]}>
            <Head title="Crea Nuovo Account" />

            <div className="p-6 max-w-4xl mx-auto">
                {/* HEADER */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-foreground flex items-center gap-3">
                            <UserPlus className="text-orange-500" size={36} />
                            Crea Nuovo Account
                        </h1>
                        <p className="text-muted-foreground mt-1 font-medium">Registra un nuovo profilo nel sistema gestionale.</p>
                    </div>
                    <Link 
                        href="/admin/accounts" 
                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-orange-500 transition-colors"
                    >
                        <ArrowLeft size={16} /> Annulla
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* CONTAINER PRINCIPALE CON BORDO LEGGERO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-2xl border border-sidebar-border bg-sidebar shadow-sm">
                        
                        {/* NOME */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-tight text-foreground">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                className="w-full rounded-xl border border-sidebar-border bg-background p-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium outline-none"
                            />
                            {errors.first_name && <p className="text-xs text-red-500 font-bold italic">{errors.first_name}</p>}
                        </div>

                        {/* COGNOME */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-tight text-foreground">
                                Cognome
                            </label>
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                className="w-full rounded-xl border border-sidebar-border bg-background p-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium outline-none"
                            />
                            {errors.last_name && <p className="text-xs text-red-500 font-bold italic">{errors.last_name}</p>}
                        </div>

                        {/* EMAIL */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-tight text-foreground">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full rounded-xl border border-sidebar-border bg-background p-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium outline-none"
                            />
                            {errors.email && <p className="text-xs text-red-500 font-bold italic">{errors.email}</p>}
                        </div>

                        {/* PASSWORD */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-tight text-foreground">
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full rounded-xl border border-sidebar-border bg-background p-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium outline-none"
                                placeholder="Minimo 8 caratteri"
                            />
                            {errors.password && <p className="text-xs text-red-500 font-bold italic">{errors.password}</p>}
                        </div>

                        {/* RUOLO */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-tight text-foreground">
                                Ruolo Sistema
                            </label>
                            <select
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                className="w-full rounded-xl border border-sidebar-border bg-background p-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-bold text-sm transition-all outline-none"
                            >
                                <option value="client">CLIENTE (Atleta)</option>
                                <option value="pt">PERSONAL TRAINER</option>
                                <option value="admin">ADMIN (Gestore)</option>
                            </select>
                            {errors.role && <p className="text-xs text-red-500 font-bold italic">{errors.role}</p>}
                        </div>

                        {/* ASSOCIAZIONE PT (CONDIZIONALE) */}
                        {data.role === 'client' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm font-bold uppercase tracking-tight text-foreground">
                                    Assegna a Personal Trainer
                                </label>
                                <select
                                    value={data.pt_id}
                                    onChange={e => setData('pt_id', e.target.value)}
                                    className="w-full rounded-xl border border-sidebar-border bg-background p-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-bold text-sm transition-all outline-none"
                                >
                                    <option value="">Personal Trainer non assegnato</option>
                                    {personalTrainers.map(pt => (
                                        <option key={pt.id} value={pt.id}>{pt.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* AZIONE DI SALVATAGGIO */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-3 rounded-xl bg-orange-600 px-10 py-4 font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-orange-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                        >
                            <Save size={20} />
                            {processing ? 'Salvataggio...' : 'Salva Utente'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}