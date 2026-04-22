import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MuscleGroup {
    id: number;
    name: string;
}

interface Props {
    // Il ? significa che in fase di "Create" questa prop non arriverà, e va bene così.
    muscleGroup?: MuscleGroup; 
}

export default function MuscleGroupForm({ muscleGroup }: Props) {
    // Capiamo se siamo in "Edit" controllando se la prop esiste e ha un ID valido
    const isEditing = !!muscleGroup?.id;

    // Inizializziamo il form. Se è Edit, usa il nome dal DB. Se è Create, stringa vuota.
    const { data, setData, post, put, processing, errors } = useForm({
        name: muscleGroup?.name || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing && muscleGroup?.id) {
            // ROTTA CON TRATTINO PER L'UPDATE
            put(`/admin/muscle-groups/${muscleGroup.id}`);
        } else {
            // ROTTA CON TRATTINO PER IL CREATE
            post('/admin/muscle-groups');
        }
    };

    return (
        <AppLayout 
            breadcrumbs={[
                { title: 'Gruppi Muscolari', href: '/admin/muscle-groups' }, 
                { title: isEditing ? 'Modifica' : 'Nuovo', href: '#' }
            ]}
        >
            <Head title={isEditing ? `Modifica ${muscleGroup?.name}` : 'Nuovo Gruppo Muscolare'} />
            
            <div className="w-full p-6 md:p-10 italic uppercase">
                <div className="mb-8 border-b border-sidebar-border pb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tighter text-foreground flex items-center gap-3">
                                <Dumbbell className="text-primary shrink-0" size={28} />
                                {isEditing ? 'Modifica Gruppo' : 'Nuovo Gruppo'}
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium mt-1 normal-case not-italic">
                                {isEditing 
                                    ? <>Stai aggiornando: <span className="font-black italic uppercase tracking-tight text-foreground">{muscleGroup?.name}</span></>
                                    : 'Inserisci un nuovo gruppo muscolare nel database.'
                                }
                            </p>
                        </div>
                        <Link href="/admin/muscle-groups">
                            <Button variant="outline" className="border-sidebar-border rounded-lg px-6 py-2.5 h-auto flex items-center gap-3 transition-all active:scale-95">
                                <ArrowLeft size={14} /> 
                                <span className="font-black tracking-[0.2em] text-[10px]"> Annulla </span>
                            </Button>
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                    <div className="grid grid-cols-1 gap-8 p-8 rounded-2xl border border-sidebar-border bg-sidebar shadow-sm">
                        
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1">
                                Nome Categoria
                            </label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                className={`w-full rounded-xl border bg-background p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm outline-none italic ${errors.name ? 'border-red-500' : 'border-sidebar-border'}`} 
                                placeholder="ES. PETTORALI" 
                                required
                            />
                            {errors.name && (
                                <p className="text-[10px] text-red-500 font-black tracking-widest mt-1">
                                    {errors.name}
                                </p>
                            )}
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
                                {processing ? 'Salvataggio...' : (isEditing ? 'Salva Modifiche' : 'Crea Gruppo')}
                            </span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}