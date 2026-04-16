import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

interface Exercise { id: number; name: string; }
interface Props { client: { id: number; name: string }; exercises_list: Exercise[]; }

export default function CreatePlan({ client, exercises_list }: Props) {

    const { data, setData, post, processing, errors } = useForm({
        user_id: client.id,
        name: '',
        num_weeks: 4,
        exercises: [{ exercise_id: '', week_number: 1, day_of_week: 'Lunedì', sets: '', reps: '', rest_time: '' }]
    });

    // Stampa nella console di eventuali errori passati da backend
    // console.log("🛑 ERRORI DAL DOGANIERE:", errors);

    const addRow = () => setData('exercises', [
        ...data.exercises, 
        { exercise_id: '', week_number: 1, day_of_week: 'Lunedì', sets: '', reps: '', rest_time: '' }
    ]);
    
    const removeRow = (i: number) => {
        const updated = [...data.exercises];
        updated.splice(i, 1);
        setData('exercises', updated);
    };

    const updateRow = (i: number, field: string, val: any) => {
        const updated = [...data.exercises];
        updated[i] = { ...updated[i], [field]: val };
        setData('exercises', updated);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'I Miei Atleti', href: '/pt/dashboard' }, { title: 'Nuova Scheda', href: '#' }]}>
            <Head title="Crea Scheda" />
            
            <div className="p-4 md:p-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight uppercase italic">Compila Nuova Scheda</h1>
                        <p className="text-muted-foreground text-sm">Destinatario: <span className="text-orange-500 font-bold">{client.name}</span></p>
                    </div>
                    <Link href="/pt/dashboard" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
                        <ArrowLeft size={14}/> Dashboard
                    </Link>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); post('/pt/plans/store'); }} className="space-y-6">
                    {/* Dati Generali */}
                    <div className="bg-sidebar p-6 rounded-2xl border border-sidebar-border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nome Programma</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-background border-sidebar-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500" placeholder="es. Ipertrofia Push/Pull" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Durata Totale (Settimane)</label>
                            <input type="number" value={data.num_weeks} onChange={e => setData('num_weeks', parseInt(e.target.value))} className="w-full bg-background border-sidebar-border rounded-xl px-4 py-2" min="1" />
                        </div>
                    </div>

                    {/* Lista Esercizi Dinamica */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 pl-1">Esercizi e Programmazione</h3>
                        {data.exercises.map((row, i) => (
                            <div key={i} className="bg-sidebar p-5 rounded-2xl border border-sidebar-border grid grid-cols-1 md:grid-cols-12 gap-4 items-end shadow-sm hover:border-orange-500/30 transition-colors">
                                
                                {/* SETTIMANA - NUOVO CAMPO */}
                                <div className="md:col-span-1">
                                    <label className="text-[10px] font-bold uppercase mb-1 block">Sett.</label>
                                    <select 
                                        value={row.week_number} 
                                        onChange={e => updateRow(i, 'week_number', parseInt(e.target.value))} 
                                        className="w-full bg-background border-sidebar-border rounded-lg text-sm border-none focus:ring-1 focus:ring-orange-500"
                                    >
                                        {[...Array(data.num_weeks)].map((_, idx) => (
                                            <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase mb-1 block">Giorno</label>
                                    <select value={row.day_of_week} onChange={e => updateRow(i, 'day_of_week', e.target.value)} className="w-full bg-background border-sidebar-border rounded-lg text-sm border-none focus:ring-1 focus:ring-orange-500">
                                        {['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>

                                <div className="md:col-span-3">
                                    <label className="text-[10px] font-bold uppercase mb-1 block">Esercizio</label>
                                    <select value={row.exercise_id} onChange={e => updateRow(i, 'exercise_id', e.target.value)} className="w-full bg-background border-sidebar-border rounded-lg text-sm border-none focus:ring-1 focus:ring-orange-500" required>
                                        <option value="">Scegli...</option>
                                        {exercises_list.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                                    </select>
                                </div>

                                <div className="md:col-span-5 grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase mb-1 block text-center text-muted-foreground">Serie</label>
                                        <input type="number" value={row.sets} onChange={e => updateRow(i, 'sets', e.target.value)} placeholder="0" className="w-full bg-background border-sidebar-border rounded-lg text-sm p-2 text-center border-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase mb-1 block text-center text-muted-foreground">Reps</label>
                                        <input type="text" value={row.reps} onChange={e => updateRow(i, 'reps', e.target.value)} placeholder="es. 10" className="w-full bg-background border-sidebar-border rounded-lg text-sm p-2 text-center border-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase mb-1 block text-center text-muted-foreground">Recupero</label>
                                        <input type="text" value={row.rest_time} onChange={e => updateRow(i, 'rest_time', e.target.value)} placeholder="90''" className="w-full bg-background border-sidebar-border rounded-lg text-sm p-2 text-center border-none" />
                                    </div>
                                </div>

                                <div className="md:col-span-1 flex justify-end">
                                    <button type="button" onClick={() => removeRow(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all">
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pulsanti Azione */}
                    <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-sidebar-border">
                        <button type="button" onClick={addRow} className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-sidebar-border hover:brightness-110">
                            <Plus size={16}/> Aggiungi Esercizio
                        </button>
                        <button type="submit" disabled={processing} className="md:ml-auto flex items-center justify-center gap-2 bg-white text-black px-12 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            <Save size={16}/> {processing ? 'Salvataggio...' : 'Conferma Scheda'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}