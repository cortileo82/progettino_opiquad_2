import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, ChevronDown, Dumbbell } from 'lucide-react';

interface Props {
    muscleGroups: string[];
}

export default function Create({ muscleGroups }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        muscle_group: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/exercises', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Esercizi', href: '/admin/exercises' }, { title: 'Nuovo', href: '#' }]}>
            <Head title="Aggiungi Nuovo Esercizio" />

            <div className="w-full p-6 md:p-10 italic uppercase">
                
                {/* HEADER UNIFORMATO */}
                <div className="mb-8 border-b border-sidebar-border pb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tighter text-foreground flex items-center gap-3">
                                <Dumbbell className="text-primary shrink-0" size={28} />
                                Nuovo Esercizio
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium mt-1 normal-case not-italic">
                                Inserisci un nuovo esercizio nel database della piattaforma.
                            </p>
                        </div>
                        
                        <Link href="/admin/exercises">
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
                    {/* CONTAINER FORM STYLE SCHEDA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-2xl border border-sidebar-border bg-sidebar shadow-sm">
                        
                        {/* NOME ESERCIZIO */}
                        <div className="space-y-3 md:col-span-1">
                            <label className="text-[10px] font-black tracking-[0.2em] text-primary block ml-1">
                                Nome Esercizio
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={`w-full rounded-xl border bg-background p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm outline-none italic ${
                                    errors.name ? 'border-red-500' : 'border-sidebar-border'
                                }`}
                                placeholder="ES. PANCA PIANA"
                            />
                            {errors.name && <p className="text-[10px] text-red-500 font-black tracking-widest mt-1">{errors.name}</p>}
                        </div>

                        {/* GRUPPO MUSCOLARE (SELECT CON FRECCIA) */}
                        <div className="space-y-3 md:col-span-1">
                            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1">
                                Gruppo Muscolare
                            </label>
                            <div className="relative">
                                <select
                                    value={data.muscle_group}
                                    onChange={e => setData('muscle_group', e.target.value)}
                                    className={`w-full rounded-xl border bg-background p-4 pr-10 focus:border-primary focus:ring-1 focus:ring-primary font-black text-xs transition-all outline-none italic appearance-none cursor-pointer ${
                                        errors.muscle_group ? 'border-red-500' : 'border-sidebar-border'
                                    }`}
                                >
                                    <option value="" disabled>SELEZIONA GRUPPO...</option>
                                    {muscleGroups.map((group) => (
                                        <option key={group} value={group}>
                                            {group.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            </div>
                            {errors.muscle_group && <p className="text-[10px] text-red-500 font-black tracking-widest mt-1">{errors.muscle_group}</p>}
                        </div>

                        {/* DESCRIZIONE (TEXTAREA STYLE) */}
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1">
                                Descrizione (Opzionale)
                            </label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className={`w-full rounded-xl border bg-background p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm outline-none italic resize-none ${
                                    errors.description ? 'border-red-500' : 'border-sidebar-border'
                                }`}
                                placeholder="INSERISCI UNA BREVE SPIEGAZIONE TECNICA..."
                            />
                            {errors.description && <p className="text-[10px] text-red-500 font-black tracking-widest mt-1">{errors.description}</p>}
                        </div>
                    </div>

                    {/* BOTTONE SALVA (STRETTO E NERO) */}
                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl px-8 py-4 h-auto flex items-center gap-3 transition-all shadow-lg active:scale-95 disabled:opacity-50 group"
                        >
                            <Save size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="font-black uppercase italic tracking-[0.2em] text-[11px]">
                                {processing ? 'Salvataggio...' : 'Crea Esercizio'}
                            </span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}