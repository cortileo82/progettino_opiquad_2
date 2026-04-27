import React, { useEffect } from 'react';
// ARCHITETTURA FIX: Importiamo Select da antd per poter usare Select.Option
import { Form, ConfigProvider, Select } from 'antd'; 
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

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#09090b', borderRadius: 12 } }}>
            <Form form={form} onFinish={onSubmit} layout="vertical" autoComplete="off">
                
                <FormCard className="mb-8">
                    <Form.Item name="name" rules={[{ required: true, message: 'Obbligatorio' }]} className="mb-0">
                        <InputGroup label="Nome Programma" placeholder="ES. MASSA" />
                    </Form.Item>
                    <Form.Item name="num_weeks" rules={[{ required: true, message: 'Obbligatorio' }]} className="mb-0">
                        <InputGroup label="Settimane" placeholder="ES. 4" />
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
                                                <Form.Item {...restField} name={[name, 'week_number']} className="mb-0">
                                                    <InputGroup label="Sett." type="select">
                                                        {/* FIX: Uso di Select.Option invece di option */}
                                                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                                                            <Select.Option key={n} value={n}>{n}</Select.Option>
                                                        ))}
                                                    </InputGroup>
                                                </Form.Item>
                                            </div>
                                            
                                            <div className="md:col-span-2">
                                                <Form.Item {...restField} name={[name, 'day_of_week']} className="mb-0">
                                                    <InputGroup label="Giorno" type="select">
                                                        {/* FIX: Uso di Select.Option invece di option */}
                                                        {['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'].map(d => (
                                                            <Select.Option key={d} value={d}>{d.toUpperCase()}</Select.Option>
                                                        ))}
                                                    </InputGroup>
                                                </Form.Item>
                                            </div>
                                            
                                            <div className="md:col-span-3">
                                                <Form.Item {...restField} name={[name, 'exercise_id']} rules={[{ required: true }]} className="mb-0">
                                                    <InputGroup label="Esercizio" type="select">
                                                        {/* FIX: Uso di Select.Option invece di option */}
                                                        <Select.Option value="">SCEGLI...</Select.Option>
                                                        {exercises_list.map(ex => (
                                                            <Select.Option key={ex.id} value={ex.id}>{ex.name.toUpperCase()}</Select.Option>
                                                        ))}
                                                    </InputGroup>
                                                </Form.Item>
                                            </div>
                                            
                                            <div className="md:col-span-1">
                                                <Form.Item {...restField} name={[name, 'sets']} className="mb-0">
                                                    <InputGroup label="Sets" placeholder="0" />
                                                </Form.Item>
                                            </div>
                                            
                                            <div className="md:col-span-1">
                                                <Form.Item {...restField} name={[name, 'reps']} className="mb-0">
                                                    <InputGroup label="Reps" placeholder="0" />
                                                </Form.Item>
                                            </div>

                                            <div className="md:col-span-1">
                                                <Form.Item {...restField} name={[name, 'weight_kg']} className="mb-0">
                                                    <InputGroup label="Kg" placeholder="20" />
                                                </Form.Item>
                                            </div>
                                            
                                            <div className="md:col-span-2">
                                                <Form.Item {...restField} name={[name, 'rest_time']} className="mb-0">
                                                    <InputGroup label="Rest (sec)" placeholder="60" />
                                                </Form.Item>
                                            </div>
                                            
                                            <div className="md:col-span-1">
                                                <button type="button" onClick={() => remove(name)} className="w-full h-[44px] mt-[26px] flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-500/20">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            
                                        </div>
                                    </div>
                                ))}
                                <div className="pl-2 mt-2">
                                    <button type="button" onClick={() => add({ week_number: 1, day_of_week: 'Lunedì' })} className="flex items-center gap-4 p-2 pr-8 rounded-2xl border-2 border-sidebar-border bg-sidebar hover:border-primary/50 transition-all group w-fit">
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