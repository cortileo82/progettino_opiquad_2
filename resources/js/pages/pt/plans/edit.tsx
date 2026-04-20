import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, Save, ArrowLeft, Dumbbell, Calendar, Layout } from 'lucide-react';

interface Exercise { id: number; name: string; }
interface Client { id: number; name: string; }
interface Props { 
    client: Client; 
    exercises_list: Exercise[]; 
    plan: any; 
}

export default function EditPlan({ client, exercises_list, plan }: Props) {

    // 1. HYDRATION: Logica originale preservata al 100%
    const { data, setData, put, processing, errors } = useForm({
        user_id: plan.user_id,
        name: plan.name,
        num_weeks: plan.num_weeks,
        exercises: plan.exercises ? plan.exercises.map((ex: any) => ({
            exercise_id: ex.id,
            week_number: ex.pivot.week_number,
            day_of_week: ex.pivot.day_of_week,
            sets: ex.pivot.sets,
            reps: ex.pivot.reps,
            rest_time: ex.pivot.rest_time || ''
        })) : []
    });

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
        
        // Si controlla che il campo sia uno di quelli strettamente numerici positivi
        const isStrictPositiveField = ['sets', 'reps', 'rest_time', 'week_number'].includes(field);

        if (isStrictPositiveField && val !== '' && parseInt(val) < 1) {
            val = '1';
        }
        
        updated[i] = { ...updated[i], [field]: val };
        setData('exercises', updated);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'I Miei Atleti', href: '/pt/dashboard' }, { title: 'Modifica Scheda', href: '#' }]}>
            <Head title={`Modifica - ${plan.name}`} />
            
            <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
                
                {/* HEADER DI PAGINA */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                            Modifica <span className="text-orange-500">Scheda</span>
                        </h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
                            Atleta: <span className="text-foreground">{client?.name}</span>
                        </p>
                    </div>
                    
                    <Link 
                        href={`/pt/clients/${plan.user_id}/plans`} 
                        className="flex items-center gap-2 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 px-4 py-2 rounded-full border border-sidebar-border"
                    >
                        <ArrowLeft size={14}/> Annulla e torna indietro
                    </Link>
                </div>

                {/* FORM PRINCIPALE */}
                <form onSubmit={(e) => { e.preventDefault(); put(`/pt/plans/${plan.id}`); }} className="space-y-8">
                    
                    {/* SEZIONE 1: DATI GENERALI */}
                    <div className="bg-sidebar border border-sidebar-border rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-sidebar-border pb-4">
                            <Layout size={18} className="text-orange-500" />
                            <h2 className="text-xs font-black uppercase italic tracking-widest">Configurazione Programma</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4">Nome della Scheda</label>
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    className="w-full h-14 bg-background border-sidebar-border rounded-2xl px-6 font-bold uppercase italic focus:ring-2 focus:ring-orange-500 transition-all" 
                                    placeholder="Es: Powerbuilding Phase 1"
                                    required 
                                />
                                {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase ml-4">{errors.name}</p>}
                            </div>
                            
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4">Durata Ciclo (Settimane)</label>
                                <input 
                                    type="number" 
                                    value={data.num_weeks} 
                                    onChange={e => {
                                        const val = e.target.value;         
                                        // Se l'utente cancella tutto, si salva la stringa vuota per non bloccarlo
                                        setData('num_weeks', val === '' ? '' : parseInt(val));
                                    }}
                                    onBlur={() => {
                                        // Quando l'utente clicca fuori, se ha lasciato vuoto o messo 0, forziamo a 1
                                        if (!data.num_weeks || data.num_weeks < 1) {
                                            setData('num_weeks', 1);
                                        }
                                    }}
                                    className="h-14 bg-background border-sidebar-border rounded-2xl px-6 font-bold" 
                                    min="1" 
                                    required 
                                />
                                {errors.num_weeks && <p className="text-red-500 text-[10px] font-bold uppercase ml-4">{errors.num_weeks}</p>}
                            </div>
                        </div>
                    </div>

                    {/* SEZIONE 2: LISTA ESERCIZI */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pl-4">
                            <Dumbbell size={18} className="text-orange-500" />
                            <h3 className="text-xs font-black uppercase italic tracking-widest text-foreground">Programmazione Esercizi</h3>
                        </div>
                        
                        {errors.exercises && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mx-4">
                                <p className="text-red-500 text-[10px] font-bold uppercase text-center">{errors.exercises}</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {data.exercises.map((row: any, i: number) => (
                                <div key={i} className="bg-sidebar p-6 md:p-8 rounded-[2.5rem] border border-sidebar-border grid grid-cols-1 md:grid-cols-12 gap-6 items-end shadow-sm hover:border-orange-500/30 transition-all">
                                    
                                    {/* SETTIMANA */}
                                    <div className="md:col-span-1">
                                        <label className="text-[9px] font-black uppercase mb-2 block text-center text-muted-foreground">Sett.</label>
                                        <select 
                                            value={row.week_number} 
                                            onChange={e => updateRow(i, 'week_number', parseInt(e.target.value))} 
                                            className="w-full h-12 bg-background border-none rounded-xl text-xs font-black text-center focus:ring-2 focus:ring-orange-500 appearance-none"
                                        >
                                            {[...Array(Math.max(1, Number(data.num_weeks) || 1))].map((_, idx) => (
                                                <option key={idx + 1} value={idx + 1}> {idx + 1}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* GIORNO */}
                                    <div className="md:col-span-2">
                                        <label className="text-[9px] font-black uppercase mb-2 block text-center text-muted-foreground">Giorno</label>
                                        <select 
                                            value={row.day_of_week} 
                                            onChange={e => updateRow(i, 'day_of_week', e.target.value)} 
                                            className="w-full h-12 bg-background border-none rounded-xl text-[10px] font-black uppercase italic focus:ring-2 focus:ring-orange-500"
                                        >
                                            {['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'].map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>

                                    {/* ESERCIZIO */}
                                    <div className="md:col-span-3">
                                        <label className="text-[9px] font-black uppercase mb-2 block ml-2 text-muted-foreground">Esercizio</label>
                                        <select 
                                            value={row.exercise_id} 
                                            onChange={e => updateRow(i, 'exercise_id', e.target.value)} 
                                            className="w-full h-12 bg-background border-none rounded-xl text-[10px] font-black uppercase italic focus:ring-2 focus:ring-orange-500" 
                                            required
                                        >
                                            <option value="">Seleziona...</option>
                                            {exercises_list.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                                        </select>
                                    </div>

                                    {/* PARAMETRI (SERIE, REPS, REST) */}
                                    <div className="md:col-span-5 grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-[9px] font-black uppercase mb-2 block text-center text-muted-foreground">Serie</label>
                                            <input type="number" value={row.sets} onChange={e => updateRow(i, 'sets', e.target.value)} className="w-full h-12 bg-background border-none rounded-xl text-xs font-black text-center focus:ring-2 focus:ring-orange-500" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase mb-2 block text-center text-muted-foreground">Reps</label>
                                            <input type="number" value={row.reps} onChange={e => updateRow(i, 'reps', e.target.value)} className="w-full h-12 bg-background border-none rounded-xl text-xs font-black text-center focus:ring-2 focus:ring-orange-500" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase mb-2 block text-center text-muted-foreground">Rest</label>
                                            <input type="number" value={row.rest_time} onChange={e => updateRow(i, 'rest_time', e.target.value)} className="w-full h-12 bg-background border-none rounded-xl text-xs font-black text-center focus:ring-2 focus:ring-orange-500" />
                                        </div>
                                    </div>

                                    {/* AZIONE ELIMINA */}
                                    <div className="md:col-span-1 flex justify-center">
                                        <button 
                                            type="button" 
                                            onClick={() => removeRow(i)} 
                                            className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                                        >
                                            <Trash2 size={20}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AZIONI FINALI */}
                    <div className="flex flex-col md:flex-row gap-6 pt-10 border-t border-sidebar-border">
                        <button 
                            type="button" 
                            onClick={addRow} 
                            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-secondary text-foreground px-8 py-4 rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] hover:bg-secondary/80 transition-all border border-sidebar-border shadow-sm"
                        >
                            <Plus size={18}/> Aggiungi Esercizio
                        </button>
                        
                        <button 
                            type="submit" 
                            disabled={processing} 
                            className="md:ml-auto flex items-center justify-center gap-3 bg-foreground text-background px-16 py-4 rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] shadow-xl hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18}/> {processing ? 'Salvataggio...' : 'Aggiorna Scheda'}
                        </button>
                    </div>
                </form>

                {/* FOOTER DECORATIVO */}
                <div className="mt-10 opacity-20 text-center">
                    <p className="text-[8px] font-black uppercase tracking-[1em]">Tempra Performance System v2.0</p>
                </div>
            </div>
        </AppLayout>
    );
}