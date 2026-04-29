import React from 'react';
import { Form } from 'antd';
import { Trash2 } from 'lucide-react';
import { InputGroup } from '@/components/custom/input-group'; 

interface ExerciseRowProps {
    field: any; // Ant Design injecta key e name qui
    remove: (name: number) => void;
    weekOptions: { label: string; value: number }[];
    dayOptions: { label: string; value: string }[];
    exerciseOptions: { label: string; value: string }[];
    transformNumber: (v: any) => number | undefined;
}

export function ExerciseRow({ 
    field, 
    remove, 
    weekOptions, 
    dayOptions, 
    exerciseOptions, 
    transformNumber 
}: ExerciseRowProps) {
    const { key, name, ...restField } = field;

    return (
        <div className="bg-sidebar border border-sidebar-border rounded-2xl p-4 shadow-sm hover:border-primary/30 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                {/* SETTIMANA */}
                <div className="md:col-span-1">
                    <Form.Item {...restField} name={[name, 'week_number']} rules={[{ required: true, message: 'Richiesto' }]} className="mb-0">
                        <InputGroup label="Sett." type="select" options={weekOptions} />
                    </Form.Item>
                </div>
                
                <div className="md:col-span-2">
                    <Form.Item {...restField} name={[name, 'day_of_week']} rules={[{ required: true, message: 'Richiesto' }]} className="mb-0">
                        <InputGroup label="Giorno" type="select" options={dayOptions} />
                    </Form.Item>
                </div>
                <div className="md:col-span-3">
                    <Form.Item {...restField} name={[name, 'exercise_id']} rules={[{ required: true, message: 'Richiesto' }]} className="mb-0">
                        <InputGroup label="Esercizio" type="select" placeholder="SCEGLI..." options={exerciseOptions} showSearch optionFilterProp="label" />
                    </Form.Item>
                </div>
                <div className="md:col-span-1">
                    <Form.Item {...restField} name={[name, 'sets']} validateFirst rules={[{ required: true, message: 'Req' }, { type: 'number', transform: transformNumber, min: 1, message: 'Minimo 1' }]} className="mb-0">
                        <InputGroup label="Sets" type="number" min={1} placeholder="0" />
                    </Form.Item>
                </div>
                <div className="md:col-span-1">
                    <Form.Item {...restField} name={[name, 'reps']} validateFirst rules={[{ required: true, message: 'Req' }, { type: 'number', transform: transformNumber, min: 1, message: 'Minimo 1' }]} className="mb-0">
                        <InputGroup label="Reps" type="number" min={1} placeholder="0" />
                    </Form.Item>
                </div>
                <div className="md:col-span-1">
                    <Form.Item {...restField} name={[name, 'weight_kg']} validateFirst rules={[{ type: 'number', transform: transformNumber, min: 0, message: 'Min 0' }]} className="mb-0">
                        <InputGroup label="Kg" type="number" min={0} step="0.5" placeholder="0" />
                    </Form.Item>
                </div>
                <div className="md:col-span-2">
                    <Form.Item {...restField} name={[name, 'rest_time']} validateFirst rules={[{ required: true, message: 'Req' }, { type: 'number', transform: transformNumber, min: 0, message: 'Min 0' }]} className="mb-0">
                        <InputGroup label="Rest" type="number" min={0} placeholder="60" />
                    </Form.Item>
                </div>

                {/* CESTINO */}
                <div className="md:col-span-1">
                    <button type="button" onClick={() => remove(name)} className="w-full h-[54px] mt-[26px] flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-500/20">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}