import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

            <div className="w-full p-6 md:p-10 italic uppercase">
                
                {/* HEADER */}
                <div className="mb-8 border-b border-sidebar-border pb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tighter text-foreground">
                                Crea Nuovo Account
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium mt-1 normal-case not-italic">
                                Registra un nuovo profilo nel sistema gestionale.
                            </p>
                        </div>
                        
                        <Link href="/admin/accounts">
                            <Button variant="outline" className="border-sidebar-border rounded-lg px-6 py-2.5 h-auto flex items-center gap-3 transition-all active:scale-95">
                                <ArrowLeft size={14} />
                                <span className="font-black tracking-[0.2em] text-[10px]">
                                    Annulla
                                </span>
                            </Button>
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-2xl border border-sidebar-border bg-sidebar shadow-sm">
                        
                        {/* NOME */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-[0.2em] text-primary block ml-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                className="w-full rounded-xl border border-sidebar-border bg-background p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm outline-none italic"
                            />
                        </div>

                        {/* COGNOME */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-[0.2em] text-primary block ml-1">
                                Cognome
                            </label>
                            <input
                                type="text"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                className="w-full rounded-xl border border-sidebar-border bg-background p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm outline-none italic"
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full rounded-xl border border-sidebar-border bg-background p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm outline-none italic lowercase"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full rounded-xl border border-sidebar-border bg-background p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm outline-none italic"
                                placeholder="MIN. 8 CARATTERI"
                            />
                        </div>

                        {/* RUOLO CON INDICATORE TENDINA */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1">
                                Ruolo
                            </label>
                            <div className="relative">
                                <select
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    className="w-full rounded-xl border border-sidebar-border bg-background p-4 pr-10 focus:border-primary focus:ring-1 focus:ring-primary font-black text-xs transition-all outline-none italic appearance-none cursor-pointer"
                                >
                                    <option value="client">CLIENTE</option>
                                    <option value="pt">PERSONAL TRAINER</option>
                                    <option value="admin">ADMIN</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        {/* ASSOCIAZIONE PT - LOGICA REATTIVA MIGLIORATA */}
                        <div className={`space-y-3 transition-all duration-300 ${data.role === 'client' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none h-0 md:h-auto overflow-hidden'}`}>
                            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1">
                                Assegna a Personal Trainer
                            </label>
                            <div className="relative">
                                <select
                                    value={data.pt_id}
                                    onChange={e => setData('pt_id', e.target.value)}
                                    className="w-full rounded-xl border border-sidebar-border bg-background p-4 pr-10 focus:border-primary focus:ring-1 focus:ring-primary font-black text-xs transition-all outline-none italic appearance-none cursor-pointer"
                                >
                                    <option value="">NON ASSEGNATO</option>
                                    {personalTrainers.map(pt => (
                                        <option key={pt.id} value={pt.id}>{pt.name.toUpperCase()}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl px-8 py-4 h-auto flex items-center gap-3 transition-all shadow-lg active:scale-95 disabled:opacity-50 group"
                        >
                            <Save size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="font-black uppercase italic tracking-[0.2em] text-[11px]">
                                {processing ? 'Salvataggio...' : 'Salva Utente'}
                            </span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}