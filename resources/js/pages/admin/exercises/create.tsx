import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Dumbbell } from 'lucide-react';

interface MuscleGroup {
    id?: number;
    name: string;
}

interface Props {
    // IMPORTANTE: deve chiamarsi muscleGroup per coincidere con il Controller
    muscleGroup?: MuscleGroup; 
}

export default function MuscleGroupForm({ muscleGroup }: Props) {
    // isEditing è true solo se muscleGroup esiste E ha un id
    const isEditing = !!muscleGroup?.id; 

    const { data, setData, post, put, processing, errors } = useForm({
        // Idratazione: prende il nome dal DB, o stringa vuota se stiamo creando
        name: muscleGroup?.name || '', 
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing) {
            // SICUREZZA ASSOLUTA: Se per qualche motivo manca l'ID, fermati e avvisa.
            if (!muscleGroup?.id) {
                console.error("ERRORE CRITICO: ID Gruppo Muscolare mancante durante l'update.");
                return; 
            }
            // Ora siamo matematicamente certi che manderà un numero (es. /16)
            put(`/admin/musclegroups/${muscleGroup.id}`);
        } else {
            post('/admin/musclegroups');
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gruppi Muscolari', href: '/admin/musclegroups' }, { title: isEditing ? 'Modifica' : 'Nuovo', href: '#' }]}>
            <Head title={isEditing ? `Modifica ${muscleGroup?.name}` : "Nuovo Gruppo Muscolare"} />
            
            <div className="w-full p-6 md:p-10 italic uppercase">
                <div className="mb-8 border-b border-sidebar-border pb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tighter text-foreground flex items-center gap-3">
                                <Dumbbell className="text-primary shrink-0" size={28} /> 
                                {isEditing ? 'Modifica Gruppo Muscolare' : 'Nuovo Gruppo Muscolare'}
                            </h1>
                        </div>
                        <Link href="/admin/musclegroups">
                            <Button variant="outline" className="border-sidebar-border rounded-lg px-6 py-2.5 h-auto flex items-center gap-3 transition-all active:scale-95">
                                <ArrowLeft size={14} /> <span className="font-black tracking-[0.2em] text-[10px]"> Annulla </span>
                            </Button>
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
                    <div className="p-8 rounded-2xl border border-sidebar-border bg-sidebar shadow-sm space-y-3">
                        <label className="text-[10px] font-black tracking-[0.2em] text-primary block ml-1"> Nome Gruppo Muscolare </label>
                        <input 
                            type="text" 
                            value={data.name} 
                            onChange={e => setData('name', e.target.value)} 
                            className={`w-full rounded-xl border bg-background p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm outline-none italic ${errors.name ? 'border-red-500' : 'border-sidebar-border'}`} 
                            placeholder="ES. PETTO" 
                            required
                        />
                        {errors.name && <p className="text-[10px] text-red-500 font-black tracking-widest mt-1">{errors.name}</p>}
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={processing} className="bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl px-8 py-4 h-auto flex items-center gap-3 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                            <Save size={16} className="mr-2"/>
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