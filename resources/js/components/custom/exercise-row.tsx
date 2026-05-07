import React from 'react';
import { Form, Select, InputNumber, Button } from 'antd';
import { ExercisePicker } from './exercise-picker';
import { Trash2 } from 'lucide-react';

const giorniSettimana = [
    { label: 'Lun', value: 'Lunedì' },
    { label: 'Mar', value: 'Martedì' },
    { label: 'Mer', value: 'Mercoledì' },
    { label: 'Gio', value: 'Giovedì' },
    { label: 'Ven', value: 'Venerdì' },
    { label: 'Sab', value: 'Sabato' },
    { label: 'Dom', value: 'Domenica' },
];

export function ExerciseRow({ field, remove, exercisesList }: any) {
    const { name, ...restField } = field;
    
    return (
        <div className="bg-sidebar/30 border border-border/50 rounded-2xl p-4 mb-2 shadow-sm">
            <div className="grid grid-cols-12 gap-4 items-end">
                
                {/* GIORNO */}
                <div className="col-span-4 md:col-span-2">
                    <Form.Item {...restField} label={<span className="text-[10px] font-black uppercase italic opacity-50">Giorno</span>} name={[name, 'day_of_week']} rules={[{ required: true, message: '!' }]} className="mb-0">
                        <Select options={giorniSettimana} placeholder="Giorno" className="h-10 w-full" />
                    </Form.Item>
                </div>
                
                {/* ESERCIZIO */}
                <div className="col-span-8 md:col-span-4">
                    <Form.Item {...restField} label={<span className="text-[10px] font-black uppercase italic opacity-60 dark:text-zinc-300">Esercizio</span>} name={[name, 'exercise_id']} rules={[{ required: true, message: '!' }]} className="mb-0">
                        <ExercisePicker exercisesList={exercisesList} />
                    </Form.Item>
                </div>
                
                {/* METRICHE */}
                <div className="col-span-11 md:col-span-5 grid grid-cols-4 gap-2">
                    <div>
                        <Form.Item {...restField} name={[name, 'sets']} label={<span className="text-[10px] font-black italic opacity-50 uppercase block text-center">Sets</span>} className="mb-0">
                            <InputNumber min={1} className="w-full h-10 font-bold text-center" />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item {...restField} name={[name, 'reps']} label={<span className="text-[10px] font-black italic opacity-50 uppercase block text-center">Reps</span>} className="mb-0">
                            <InputNumber min={1} className="w-full h-10 font-bold text-center" />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item {...restField} name={[name, 'weight_kg']} label={<span className="text-[10px] font-black italic opacity-50 uppercase block text-center">Kg</span>} className="mb-0">
                            <InputNumber min={0} step={0.5} className="w-full h-10 font-bold text-center" />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item {...restField} name={[name, 'rest_time']} label={<span className="text-[10px] font-black italic opacity-50 uppercase block text-center">Rest</span>} className="mb-0">
                            <InputNumber min={0} className="w-full h-10 font-bold text-center" />
                        </Form.Item>
                    </div>
                </div>
                
                {/* BOTTONE ELIMINA (ORA ALLINEATO) */}
                <div className="col-span-1 md:col-span-1">
                    <Form.Item 
                        label={<span className="text-[10px] font-black uppercase italic opacity-0 block">Del</span>} 
                        className="mb-0"
                    >
                        <div className="flex justify-end">
                            <Button 
                                danger 
                                type="text" 
                                icon={<Trash2 size={18} />} 
                                onClick={() => remove(name)} 
                                className="hover:bg-red-500/10 h-10 w-10 flex items-center justify-center rounded-xl" 
                            />
                        </div>
                    </Form.Item>
                </div>
            </div>
            
            <Form.Item {...restField} name={[name, 'week_number']} noStyle>
                <input type="hidden" />
            </Form.Item>
        </div>
    );
}