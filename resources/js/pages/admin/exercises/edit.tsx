import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Exercise {
    id: number;
    name: string;
    description?: string;
    muscle_group?: string; // Allineato con il database
}

interface Props {
    exercise: Exercise;
}

export default function EditExercise({ exercise }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: exercise.name,
        description: exercise.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/exercises/${exercise.id}`); 
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Esercizi', href: '/admin/exercises' }, 
            { title: 'Modifica', href: '#' }
        ]}>
            <Head title={`Modifica ${exercise.name}`} />

            <div className="w-full p-6 md:p-10 italic uppercase">
                
                {/* HEADER UNIFORMATO */}
                <div className="mb-8 border-b border-sidebar-border pb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tighter text-foreground flex items-center gap-3">
                                <Dumbbell className="text-foreground shrink-0" size={28} />
                                Modifica Esercizio
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium mt-1 normal-case not-italic">
                                Stai aggiornando: <span className="font-black italic uppercase tracking-tight text-foreground">{exercise.name}</span>
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
                    <div className="grid grid-cols-1 gap-8 p-8 rounded-2xl border border-sidebar-border bg-sidebar shadow-sm">
                        
                        {/* NOME ESERCIZIO */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1">
                                Nome dell'Esercizio
                            </label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                className={`w-full rounded-xl border bg-background p-4 focus:border-foreground focus:ring-1 focus:ring-foreground transition-all font-bold text-sm outline-none italic ${
                                    errors.name ? 'border-red-500' : 'border-sidebar-border'
                                }`}
                                placeholder="ES. PANCA PIANA" 
                                required 
                            />
                            {errors.name && <p className="text-[10px] text-red-500 font-black tracking-widest mt-1">{errors.name}</p>}
                        </div>

                        {/* DESCRIZIONE / NOTE */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1">
                                Descrizione o Note Tecniche
                            </label>
                            <textarea 
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                                className={`w-full rounded-xl border bg-background p-4 focus:border-foreground focus:ring-1 focus:ring-foreground transition-all font-bold text-sm outline-none italic resize-none min-h-[150px] ${
                                    errors.description ? 'border-red-500' : 'border-sidebar-border'
                                }`}
                                placeholder="INSERISCI DETTAGLI SULL'ESECUZIONE..."
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
                                {processing ? 'Salvataggio...' : 'Salva Modifiche'}
                            </span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}