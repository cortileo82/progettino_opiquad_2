import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, Info } from 'lucide-react';

// Definiamo la struttura dell'esercizio che riceviamo dal Controller
interface Exercise {
    id: number;
    name: string;
    description?: string;
    category?: string;
}

interface Props {
    exercise: Exercise;
}

export default function EditExercise({ exercise }: Props) {
    // Inizializziamo il form con i dati esistenti dell'esercizio
    const { data, setData, put, processing, errors } = useForm({
        name: exercise.name,
        description: exercise.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // CORREZIONE 1: Usiamo l'URL statico con il prefisso 'admin'
        put(`/admin/exercises/${exercise.id}`); 
    };

    return (
        <AppLayout breadcrumbs={[
            // CORREZIONE 2: URL statico nel breadcrumb
            { title: 'Esercizi', href: '/admin/exercises' }, 
            { title: 'Modifica Esercizio', href: '#' }
        ]}>
            <Head title={`Modifica ${exercise.name}`} />

            <div className="p-4 md:p-8 max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight uppercase italic">
                            Modifica Esercizio
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Stai modificando: <span className="text-orange-500 font-bold">{exercise.name}</span>
                        </p>
                    </div>
                    {/* CORREZIONE 3: URL statico nel tasto Annulla */}
                    <Link 
                        href="/admin/exercises" 
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={14} /> Annulla
                    </Link>
                </div>

                {/* Form di Modifica */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-sidebar p-6 rounded-2xl border border-sidebar-border shadow-sm space-y-6">
                        
                        {/* Nome Esercizio */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                Nome dell'Esercizio
                            </label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                className={`w-full bg-background border-sidebar-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 transition-all ${errors.name ? 'border-red-500' : ''}`}
                                placeholder="es. Panca Piana" 
                                required 
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Descrizione / Note */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                Descrizione o Note Tecniche
                            </label>
                            <textarea 
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                                className="w-full bg-background border-sidebar-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 min-h-[120px] transition-all border-sidebar-border focus:border-orange-500"
                                placeholder="Inserisci dettagli sull'esecuzione..."
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Pulsante Salva */}
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={processing} 
                            className="flex items-center gap-2 bg-foreground text-background px-10 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
                        >
                            {processing ? (
                                'Salvataggio...'
                            ) : (
                                <>
                                    <Save size={16} /> Salva Modifiche
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}