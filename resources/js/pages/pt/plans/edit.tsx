import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, Save, ChevronLeft, Dumbbell, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Exercise { id: number; name: string; }
interface Client { id: number; name: string; }
interface Props { 
    client: Client; 
    exercises_list: Exercise[]; 
    plan: any; 
}

export default function EditPlan({ client, exercises_list, plan }: Props) {

    interface ExerciseFormRow {
        exercise_id: string | number;
        week_number: number;
        day_of_week: string;
        sets: string | number;
        reps: string | number;
        rest_time: string;
    }

    interface PlanFormState {
        user_id: number;
        name: string;
        num_weeks: number | ""; // Si permette il vuoto temporaneo per una UX fluida
        exercises: ExerciseFormRow[];
    }

    const { data, setData, put, processing, errors } = useForm<PlanFormState>({
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
        { exercise_id: '', week_number: 1, day_of_week: 'Lunedì', sets: '1', reps: '', rest_time: '' }
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
            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                
                {/* HEADER SEZIONE */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-sidebar-border pb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                            Modifica <span className="text-primary">Scheda</span>
                        </h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 opacity-70">
                            Destinatario: <span className="text-foreground">{client?.name}</span>
                        </p>
                    </div>

                    <Link 
                        href={`/pt/clients/${plan.user_id}/plans`} 
                        className="group flex items-center gap-2 text-[10px] font-black uppercase italic text-zinc-400 hover:text-black transition-all tracking-widest"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Annulla
                    </Link>
                </div>

                {/* LOGICA PUT ORIGINALE */}
                <form onSubmit={(e) => { e.preventDefault(); put(`/pt/plans/${plan.id}`); }} className="space-y-10">
                    
                    {/* CARD DATI GENERALI */}
                    <div className="bg-sidebar border border-sidebar-border rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 border-b border-sidebar-border pb-4">
                            <ListChecks size={20} className="text-primary" />
                            <h2 className="font-black uppercase italic text-sm tracking-widest">Info Programma</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase italic tracking-widest ml-4 text-zinc-400">Nome Programma</Label>
                                <Input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    className="h-14 bg-background border-sidebar-border rounded-2xl px-6 font-bold uppercase italic focus:ring-2 focus:ring-black" 
                                    required 
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label className="text-[10px] font-black uppercase italic tracking-widest ml-4 text-zinc-400">Durata Ciclo (Settimane)</Label>
                                <Input 
                                    type="number" 
                                    value={data.num_weeks} 
                                    onChange={e => {
                                        const val = e.target.value;         
                                        // Se l'utente cancella tutto, si salva la stringa vuota per non bloccarlo
                                        setData('num_weeks', val === '' ? 1 : parseInt(val));
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
                            </div>
                        </div>
                    </div>

                    {/* LISTA ESERCIZI DINAMICA */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pl-4">
                            <Dumbbell size={20} className="text-primary" />
                            <h3 className="font-black uppercase italic text-sm tracking-widest">Protocollo Esercizi</h3>
                        </div>

                        <div className="grid gap-4">
                            {data.exercises.map((row: any, i: number) => (
                                <div key={i} className="bg-sidebar border border-sidebar-border rounded-[2.5rem] p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end shadow-sm hover:border-primary/50 transition-all group">
                                    
                                    {/* SETTIMANA */}
                                    <div className="md:col-span-1">
                                        <Label className="text-[9px] font-black uppercase italic mb-2 block text-center opacity-50">Sett.</Label>
                                        <select 
                                            value={row.week_number} 
                                            onChange={e => updateRow(i, 'week_number', parseInt(e.target.value))} 
                                            className="w-full h-12 bg-background border-none rounded-xl text-xs font-black text-center focus:ring-2 focus:ring-black appearance-none"
                                        >
                                            {[...Array(Math.max(1, Number(data.num_weeks) || 1))].map((_, idx) => (
                                                <option key={idx + 1} value={idx + 1}> {idx + 1}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* GIORNO */}
                                    <div className="md:col-span-2">
                                        <Label className="text-[9px] font-black uppercase italic mb-2 block text-center opacity-50">Giorno</Label>
                                        <select 
                                            value={row.day_of_week} 
                                            onChange={e => updateRow(i, 'day_of_week', e.target.value)} 
                                            className="w-full h-12 bg-background border-none rounded-xl text-xs font-black uppercase italic focus:ring-2 focus:ring-black"
                                        >
                                            {['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'].map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>

                                    {/* SELEZIONE ESERCIZIO */}
                                    <div className="md:col-span-3">
                                        <Label className="text-[9px] font-black uppercase italic mb-2 block ml-2 opacity-50 tracking-tighter">Esercizio</Label>
                                        <select 
                                            value={row.exercise_id} 
                                            onChange={e => updateRow(i, 'exercise_id', e.target.value)} 
                                            className="w-full h-12 bg-background border-none rounded-xl text-[11px] font-black uppercase italic focus:ring-2 focus:ring-black" 
                                            required
                                        >
                                            <option value="">Scegli...</option>
                                            {exercises_list.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                                        </select>
                                    </div>

                                    {/* STATS TECNICHE */}
                                    <div className="md:col-span-5 grid grid-cols-3 gap-3">
                                        <div>
                                            <Label className="text-[9px] font-black uppercase italic mb-2 block text-center opacity-50">Serie</Label>
                                            <Input type="number" min="1" value={row.sets} onChange={e => updateRow(i, 'sets', e.target.value)} className="h-12 bg-background border-none rounded-xl text-center font-black" required />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase italic mb-2 block text-center text-muted-foreground">Reps</label>
                                            <input type="number" value={row.reps} onChange={e => updateRow(i, 'reps', e.target.value)} className="w-full h-12 bg-background border-none rounded-xl text-xs font-black text-center focus:ring-2 focus:ring-orange-500" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase italic mb-2 block text-center text-muted-foreground">Rest</label>
                                            <input type="number" value={row.rest_time} onChange={e => updateRow(i, 'rest_time', e.target.value)} className="w-full h-12 bg-background border-none rounded-xl text-xs font-black text-center focus:ring-2 focus:ring-orange-500" />
                                        </div>
                                    </div>

                                    {/* CANCELLA RIGA */}
                                    <div className="md:col-span-1 flex justify-center pb-1">
                                        <button 
                                            type="button" 
                                            onClick={() => removeRow(i)} 
                                            className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FOOTER ACTIONS */}
                    <div className="flex flex-col md:flex-row gap-6 pt-10 border-t border-sidebar-border">
                        <Button 
                            type="button" 
                            onClick={addRow} 
                            variant="outline"
                            className="h-16 flex-1 md:flex-none md:px-10 border-2 border-zinc-200 rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-zinc-100 transition-all shadow-sm"
                        >
                            <Plus size={18} className="mr-2" /> Aggiungi Esercizio
                        </Button>
                        
                        <Button 
                            type="submit" 
                            disabled={processing} 
                            className="h-16 md:ml-auto md:px-16 bg-black text-white rounded-2xl font-black uppercase italic text-sm tracking-widest shadow-2xl hover:bg-zinc-800 transition-all disabled:opacity-50"
                        >
                            <Save size={18} className="mr-2" /> {processing ? 'Salvataggio...' : 'Aggiorna Scheda'}
                        </Button>
                    </div>
                </form>

                <p className="text-center text-[9px] font-black uppercase italic opacity-20 tracking-[0.5em] mt-10">
                    TEMPRA Performance Lab - Sistema di Revisione
                </p>
            </div>
    );
}