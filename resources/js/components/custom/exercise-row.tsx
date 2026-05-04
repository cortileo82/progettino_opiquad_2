import React from 'react';
import { Form, Select, Input } from 'antd'; 
import { Trash2 } from 'lucide-react';

interface ExerciseRowProps {
    field: any; 
    remove: (name: number) => void;
    weekOptions: { label: string; value: number }[];
    dayOptions: { label: string; value: string }[];
    exercisesList: any[];
    transformNumber: (v: any) => number | undefined;
}

export function ExerciseRow({ 
    field, 
    remove, 
    weekOptions, 
    dayOptions, 
    exercisesList,
    transformNumber 
}: ExerciseRowProps) {
    // Estraiamo name (l'indice) e restField (key e altri dati di AntD)
    const { name, ...restField } = field;

    return (
        <div className="bg-sidebar border border-sidebar-border rounded-2xl p-4 shadow-sm mb-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                
                {/* SETTIMANA */}
                <div className="md:col-span-1">
                    <label className="text-[10px] font-bold uppercase opacity-50 ml-1">Sett.</label>
                    <Form.Item {...restField} name={[name, 'week_number']} className="mb-0">
                        <Select options={weekOptions} className="h-10 font-bold italic" />
                    </Form.Item>
                </div>

                {/* GIORNO */}
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold uppercase opacity-50 ml-1">Giorno</label>
                    <Form.Item {...restField} name={[name, 'day_of_week']} className="mb-0">
                        <Select options={dayOptions} className="h-10 font-bold italic" />
                    </Form.Item>
                </div>
                
                {/* ESERCIZIO */}
                <div className="md:col-span-3">
                    <label className="text-[10px] font-bold uppercase opacity-50 ml-1">Esercizio</label>
                    <Form.Item {...restField} name={[name, 'exercise_id']} className="mb-0">
                        <Select 
                            showSearch
                            optionFilterProp="label"
                            options={exercisesList.map(ex => ({ label: ex.name.toUpperCase(), value: ex.id }))} 
                            className="w-full h-10 font-bold italic" 
                        />
                    </Form.Item>
                </div>

                {/* SETS */}
                <div className="md:col-span-1">
                    <label className="text-[10px] font-bold uppercase opacity-50 ml-1">Sets</label>
                    <Form.Item {...restField} name={[name, 'sets']} className="mb-0">
                        <Input className="h-10 font-bold italic text-center" />
                    </Form.Item>
                </div>

                {/* REPS */}
                <div className="md:col-span-1">
                    <label className="text-[10px] font-bold uppercase opacity-50 ml-1">Reps</label>
                    <Form.Item {...restField} name={[name, 'reps']} className="mb-0">
                        <Input className="h-10 font-bold italic text-center" />
                    </Form.Item>
                </div>

                {/* KG */}
                <div className="md:col-span-1">
                    <label className="text-[10px] font-bold uppercase opacity-50 ml-1">Kg</label>
                    <Form.Item {...restField} name={[name, 'weight_kg']} className="mb-0">
                        <Input className="h-10 font-bold italic text-center" />
                    </Form.Item>
                </div>

                {/* REST */}
                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold uppercase opacity-50 ml-1">Rest</label>
                    <Form.Item {...restField} name={[name, 'rest_time']} className="mb-0">
                        <Input className="h-10 font-bold italic text-center" />
                    </Form.Item>
                </div>

                {/* CESTINO */}
                <div className="md:col-span-1">
                    <button 
                        type="button" 
                        onClick={() => remove(name)} 
                        className="w-full h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}