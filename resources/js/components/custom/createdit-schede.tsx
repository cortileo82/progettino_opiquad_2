import React, { useEffect } from 'react';
import { Form, ConfigProvider } from 'antd';
import { Plus, Trash2, Dumbbell, PlayCircle } from 'lucide-react';
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
    
    // Osserva il numero di settimane per validare il dropdown
    const numWeeks = Form.useWatch('num_weeks', form);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);

    // Genera opzioni per la settimana
    const weekOptions = Array.from({ length: Math.max(1, numWeeks || 1) }, (_, i) => ({
        label: `${i + 1}`,
        value: i + 1
    }));

    // Opzioni per i giorni
    const dayOptions = [
        { label: 'LUNEDÌ', value: 'Lunedì' },
        { label: 'MARTEDÌ', value: 'Martedì' },
        { label: 'MERCOLEDÌ', value: 'Mercoledì' },
        { label: 'GIOVEDÌ', value: 'Giovedì' },
        { label: 'VENERDÌ', value: 'Venerdì' },
        { label: 'SABATO', value: 'Sabato' },
        { label: 'DOMENICA', value: 'Domenica' },
    ];

    // Opzioni esercizi
    const exerciseOptions = exercises_list.map(ex => ({
        label: ex.name.toUpperCase(),
        value: ex.id
    }));

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#09090b',
                    borderRadius: 12,
                },
            }}
        >
            <Form
                form={form}
                onFinish={onSubmit}
                layout="vertical"
                autoComplete="off"
            >
                {/* 1. INFO GENERALI */}
                <FormCard className="mb-8">
                    <Form.Item name="name" rules={[{ required: true, message: 'Obbligatorio' }]} className="mb-0">
                        <InputGroup label="Nome Programma" />
                    </Form.Item>

                    <Form.Item name="num_weeks" rules={[{ required: true, message: 'Obbligatorio' }]} className="mb-0">
                        <InputGroup 
                            label="Settimane Totali" 
                            type="text" // InputGroup usa Input di AntD, gestiamo il min/max tramite rules o props native
                            min={1}
                            placeholder="ES. 4" 
                        />
                    </Form.Item>
                </FormCard>

                {/* 2. PROTOCOLLO ESERCIZI */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 pl-2">
                        <Dumbbell size={18} className="text-primary" />
                        <h3 className="font-black uppercase italic text-xs tracking-widest text-foreground/70">
                            Protocollo Esercizi
                        </h3>
                    </div>

                    <Form.List name="exercises">
                        {(fields, { add, remove }) => (
                            <div className="flex flex-col gap-3">
                                {fields.map(({ key, name, ...restField }) => (
                                    <div 
                                        key={key} 
                                        className="bg-sidebar border border-sidebar-border rounded-2xl p-4 shadow-sm hover:border-primary/20 transition-colors"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                            
                                            {/* SETTIMANA */}
                                            <div className="md:col-span-1">
                                                <Form.Item {...restField} name={[name, 'week_number']} className="mb-0">
                                                    <InputGroup 
                                                        label="Sett." 
                                                        type="select" 
                                                        options={weekOptions} // Passiamo options invece di children per compatibilità Select AntD
                                                    />
                                                </Form.Item>
                                            </div>

                                            {/* GIORNO */}
                                            <div className="md:col-span-2">
                                                <Form.Item {...restField} name={[name, 'day_of_week']} className="mb-0">
                                                    <InputGroup 
                                                        label="Giorno" 
                                                        type="select" 
                                                        options={dayOptions}
                                                    />
                                                </Form.Item>
                                            </div>

                                            {/* ESERCIZIO */}
                                            <div className="md:col-span-3">
                                                <Form.Item {...restField} name={[name, 'exercise_id']} rules={[{ required: true }]} className="mb-0">
                                                    <InputGroup 
                                                        label="Esercizio" 
                                                        type="select" 
                                                        placeholder="SCEGLI..."
                                                        options={exerciseOptions}
                                                        showSearch
                                                        optionFilterProp="label"
                                                    />
                                                </Form.Item>
                                            </div>

                                            {/* PARAMETRI */}
                                            <div className="md:col-span-1">
                                                <Form.Item {...restField} name={[name, 'sets']} className="mb-0">
                                                    <InputGroup label="Sets" min={0} placeholder="0" />
                                                </Form.Item>
                                            </div>
                                            <div className="md:col-span-1">
                                                <Form.Item {...restField} name={[name, 'reps']} className="mb-0">
                                                    <InputGroup label="Reps" min={0} placeholder="0" />
                                                </Form.Item>
                                            </div>
                                            <div className="md:col-span-1">
                                                <Form.Item {...restField} name={[name, 'weight_kg']} className="mb-0">
                                                    <InputGroup label="Kg" min={0} placeholder="0" />
                                                </Form.Item>
                                            </div>
                                            <div className="md:col-span-2">
                                                <Form.Item {...restField} name={[name, 'rest_time']} className="mb-0">
                                                    <InputGroup label="Rest (sec)" min={0} placeholder="60" />
                                                </Form.Item>
                                            </div>

                                            {/* CESTINO ALLINEATO - mt calcolato per pareggiare InputGroup senza icona */}
                                            <div className="md:col-span-1">
                                                <button 
                                                    type="button" 
                                                    onClick={() => remove(name)}
                                                    className="w-full h-[54px] mt-[26px] flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-500/20"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="pl-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => add({ week_number: 1, day_of_week: 'Lunedì', sets: 0, reps: 0, weight_kg: 0, rest_time: 60 })}
                                        className="flex items-center gap-4 p-2 pr-8 rounded-2xl border-2 border-sidebar-border bg-sidebar hover:border-primary/50 transition-all group w-fit"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg group-hover:rotate-90 transition-transform duration-300">
                                            <Plus size={20} strokeWidth={3} />
                                        </div>
                                        <span className="font-black uppercase italic tracking-widest text-[10px] text-foreground">
                                            Aggiungi Esercizio
                                        </span>
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