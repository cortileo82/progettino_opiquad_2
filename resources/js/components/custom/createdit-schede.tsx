import React from 'react';
import { useForm } from '@inertiajs/react';
import { Plus, Trash2, Save, Dumbbell, ListChecks } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Exercise { id: number; name: string; }
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
    num_weeks: number | "";
    exercises: ExerciseFormRow[];
}

interface Props {
    initialData: PlanFormState;
    exercises_list: Exercise[];
    onSubmit: (data: any) => void;
    processing: boolean;
    submitText: string;
}

export function CreateEditSchede({ initialData, exercises_list, onSubmit, processing, submitText }: Props) {
    const { data, setData, errors } = useForm<PlanFormState>(initialData);

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
        const isStrictPositiveField = ['sets', 'reps', 'rest_time', 'week_number'].includes(field);
        if (isStrictPositiveField && val !== '' && parseInt(val) < 1) val = '1';
        updated[i] = { ...updated[i], [field]: val };
        setData('exercises', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
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
                            onChange={e => setData('num_weeks', e.target.value === '' ? 1 : parseInt(e.target.value))}
                            onBlur={() => (!data.num_weeks || data.num_weeks < 1) && setData('num_weeks', 1)}
                            className="h-14 bg-background border-sidebar-border rounded-2xl px-6 font-bold" 
                            min="1" required 
                        />
                    </div>
                </div>
            </div>

            {/* LISTA ESERCIZI */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pl-4">
                    <Dumbbell size={20} className="text-primary" />
                    <h3 className="font-black uppercase italic text-sm tracking-widest">Protocollo Esercizi</h3>
                </div>

                <div className="grid gap-4">
                    {data.exercises.map((row, i) => (
                        <div key={i} className="bg-sidebar border border-sidebar-border rounded-[2.5rem] p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end shadow-sm hover:border-primary/50 transition-all group relative overflow-hidden">
                            <div className="md:col-span-1">
                                <Label className="text-[9px] font-black uppercase italic mb-2 block text-center opacity-50">Sett.</Label>
                                <select 
                                    value={row.week_number} 
                                    onChange={e => updateRow(i, 'week_number', parseInt(e.target.value))} 
                                    className="w-full h-12 bg-background border-none rounded-xl text-xs font-black text-center focus:ring-2 focus:ring-black appearance-none"
                                >
                                    {[...Array(Math.max(1, Number(data.num_weeks) || 1))].map((_, idx) => (
                                        <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                                    ))}
                                </select>
                            </div>

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

                            <div className="md:col-span-3">
                                <Label className="text-[9px] font-black uppercase italic mb-2 block ml-2 opacity-50">Esercizio</Label>
                                <select 
                                    value={row.exercise_id} 
                                    onChange={e => updateRow(i, 'exercise_id', e.target.value)} 
                                    className="w-full h-12 bg-background border-none rounded-xl text-[11px] font-black uppercase italic focus:ring-2 focus:ring-black px-2" 
                                    required
                                >
                                    <option value="">Scegli...</option>
                                    {exercises_list.map(ex => <option key={ex.id} value={ex.id}>{ex.name.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="md:col-span-5 grid grid-cols-3 gap-3">
                                <div><Label className="text-[9px] font-black uppercase italic mb-2 block text-center opacity-50">Serie</Label>
                                <Input type="number" value={row.sets} onChange={e => updateRow(i, 'sets', e.target.value)} className="h-12 bg-background border-none rounded-xl text-center font-black" required /></div>
                                <div><Label className="text-[9px] font-black uppercase italic mb-2 block text-center opacity-50">Reps</Label>
                                <Input type="number" value={row.reps} onChange={e => updateRow(i, 'reps', e.target.value)} className="h-12 bg-background border-none rounded-xl text-center font-black" /></div>
                                <div><Label className="text-[9px] font-black uppercase italic mb-2 block text-center opacity-50">Rest (s)</Label>
                                <Input type="number" value={row.rest_time} onChange={e => updateRow(i, 'rest_time', e.target.value)} className="h-12 bg-background border-none rounded-xl text-center font-black" /></div>
                            </div>

                            <div className="md:col-span-1 flex justify-center pb-1">
                                <button type="button" onClick={() => removeRow(i)} className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                    <Trash2 size={20}/>
                                </button>
                            </div>
                            <div className="absolute -right-2 -bottom-4 text-primary/5 font-black italic text-6xl select-none pointer-events-none group-hover:text-primary/10 transition-colors">
                                {i + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-sidebar-border mt-10">
                <button 
                    type="button" 
                    onClick={addRow} 
                    className="group flex items-center justify-center gap-3 w-full md:w-auto h-16 px-10 bg-background border-2 border-sidebar-border rounded-2xl hover:border-primary/50 transition-all shadow-sm"
                >
                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                        <Plus size={18} />
                    </div>
                    <span className="text-[11px] font-black uppercase italic tracking-[0.2em] text-foreground">Aggiungi Esercizio</span>
                </button>
                
                <button 
                    type="submit" 
                    disabled={processing} 
                    className="relative flex items-center justify-center gap-3 w-full md:w-auto h-16 px-16 bg-foreground text-background rounded-2xl font-black uppercase italic text-sm tracking-widest shadow-2xl hover:bg-foreground/90 transition-all disabled:opacity-50 group overflow-hidden"
                >
                    {processing ? (
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            <span>Salvataggio...</span>
                        </div>
                    ) : (
                        <>
                            <Save size={18} className="group-hover:scale-110 transition-transform" /> 
                            <span>{submitText}</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}