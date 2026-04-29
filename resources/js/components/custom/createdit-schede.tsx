import React, { useEffect } from 'react';
// Importiamo il theme da antd per poter gestire il dark mode
import { Form, ConfigProvider, theme } from 'antd';
import { Plus, Trash2, Dumbbell } from 'lucide-react';
import { FormCard } from '@/components/custom/form-card';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';

interface Props {
    initialValues: any;
    exercises_list: any[];
    onSubmit: (values: any) => void;
    loading: boolean;
    submitText: string;
}

export function CreateEditSchede({ initialValues, exercises_list, onSubmit, loading, submitText }: Props) {
    const [form] = Form.useForm();
    const numWeeks = Form.useWatch('num_weeks', form);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);

    const weekOptions = Array.from({ length: Math.max(1, numWeeks || 1) }, (_, i) => ({
        label: `${i + 1}`, value: i + 1
    }));

    const dayOptions = [
        { label: 'LUNEDÌ', value: 'Lunedì' },
        { label: 'MARTEDÌ', value: 'Martedì' },
        { label: 'MERCOLEDÌ', value: 'Mercoledì' },
        { label: 'GIOVEDÌ', value: 'Giovedì' },
        { label: 'VENERDÌ', value: 'Venerdì' },
        { label: 'SABATO', value: 'Sabato' },
        { label: 'DOMENICA', value: 'Domenica' }
    ];

    const exerciseOptions = exercises_list.map(ex => ({
        label: ex.name.toUpperCase(), value: ex.id
    }));

    return (
        <ConfigProvider 
            theme={{ 
                token: { 
                    colorPrimary: '#09090b', 
                    borderRadius: 12,
                    // Si dice ad AntD di rendere gli input trasparenti in modo che
                    // prendano il colore di sfondo dettato da Tailwind (Dark Mode fix)
                    colorBgContainer: 'transparent',
                    colorText: 'inherit',
                    colorTextPlaceholder: 'gray',
                    colorBorder: 'rgba(128, 128, 128, 0.2)'
                } 
            }}
        >
            <Form form={form} onFinish={onSubmit} layout="vertical" autoComplete="off">
                
                <FormCard className="mb-8">
                    <Form.Item name="name" rules={[{ required: true, message: 'Obbligatorio' }]} className="mb-0">
                        <InputGroup label="Nome Programma" />
                    </Form.Item>
                    <Form.Item 
                        name="num_weeks" 
                        rules={[
                            { required: true, message: 'Obbligatorio' },
                            { type: 'number', transform: (value) => Number(value), min: 1, message: 'Minimo 1' }
                        ]} 
                        className="mb-0"
                    >
                        <InputGroup label="Settimane Totali" type="number" min={1} placeholder="ES. 4" />
                    </Form.Item>
                </FormCard>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 pl-2">
                        <Dumbbell size={18} className="text-primary" />
                        <h3 className="font-black uppercase italic text-xs tracking-widest text-foreground/70"> Protocollo Esercizi </h3>
                    </div>
                    
                    <Form.List name="exercises">
                        {(fields, { add, remove }) => (
                            <div className="flex flex-col gap-3">
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="bg-sidebar border border-sidebar-border rounded-2xl p-4 shadow-sm hover:border-primary/20 transition-colors">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                            
                                            <div className="md:col-span-1">
                                                <Form.Item {...restField} name={[name, 'week_number']} rules={[{ required: true, message: 'Obbligatorio' }]} className="mb-0">
                                                    <InputGroup label="Sett." type="select" options={weekOptions} />
                                                </Form.Item>
                                            </div>
                                            
                                            <div className="md:col-span-2">
                                                <Form.Item {...restField} name={[name, 'day_of_week']} rules={[{ required: true, message: 'Req' }]} className="mb-0">
                                                    <InputGroup label="Giorno" type="select" options={dayOptions} />
                                                </Form.Item>
                                            </div>
                                            
                                            <div className="md:col-span-3">
                                                <Form.Item {...restField} name={[name, 'exercise_id']} rules={[{ required: true, message: 'Obbligatorio' }]} className="mb-0">
                                                    <InputGroup label="Esercizio" type="select" placeholder="SCEGLI..." options={exerciseOptions} showSearch optionFilterProp="label" />
                                                </Form.Item>
                                            </div>
                                            
                                            {/* ARCHITETTURA FIX 3: Validazione per Sets (Minimo 1) */}
                                            <div className="md:col-span-1">
                                                <Form.Item {...restField} name={[name, 'sets']} rules={[{ required: true, message: 'Req' }, { type: 'number', transform: (v) => Number(v), min: 1, message: '>0' }]} className="mb-0">
                                                    <InputGroup label="Sets" type="number" min={1} placeholder="0" />
                                                </Form.Item>
                                            </div>
                                            
                                            {/* ARCHITETTURA FIX 4: Validazione per Reps (Minimo 1) */}
                                            <div className="md:col-span-1">
                                                <Form.Item {...restField} name={[name, 'reps']} rules={[{ required: true, message: 'Req' }, { type: 'number', transform: (v) => Number(v), min: 1, message: '>0' }]} className="mb-0">
                                                    <InputGroup label="Reps" type="number" min={1} placeholder="0" />
                                                </Form.Item>
                                            </div>

                                            {/* ARCHITETTURA FIX 5: Validazione per Kg (Minimo 0) */}
                                            <div className="md:col-span-1">
                                                <Form.Item {...restField} name={[name, 'weight_kg']} rules={[{ type: 'number', transform: (v) => Number(v), min: 0, message: 'Min 0' }]} className="mb-0">
                                                    <InputGroup label="Kg" type="number" min={0} step="0.5" placeholder="0" />
                                                </Form.Item>
                                            </div>
                                            
                                            <div className="md:col-span-2">
                                                <Form.Item {...restField} name={[name, 'rest_time']} className="mb-0">
                                                    <InputGroup label="Rest" type="number" min={0} placeholder="60" />
                                                </Form.Item>
                                            </div>
                                            
                                            <div className="md:col-span-1">
                                                <button type="button" onClick={() => remove(name)} className="w-full h-[54px] mt-[26px] flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-500/20">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            
                                        </div>
                                    </div>
                                ))}
                                <div className="pl-2 mt-2">
                                    <button type="button" onClick={() => add({ week_number: 1, day_of_week: 'Lunedì', sets: 1, reps: 10, weight_kg: '', rest_time: 60 })} className="flex items-center gap-4 p-2 pr-8 rounded-2xl border-2 border-sidebar-border bg-sidebar hover:border-primary/50 transition-all group w-fit">
                                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg group-hover:rotate-90 transition-transform duration-300">
                                            <Plus size={20} strokeWidth={3} />
                                        </div>
                                        <span className="font-black uppercase italic tracking-widest text-[10px] text-foreground"> Aggiungi Esercizio </span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </Form.List>
                </div>
                
                <FormButton label={submitText} processing={loading} />
            </Form>
        </ConfigProvider>
    );
}