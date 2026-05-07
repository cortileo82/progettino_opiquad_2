import React, { useEffect, useMemo } from 'react';
import { Form, Input, InputNumber, Card } from 'antd';
import { Save } from 'lucide-react';
import { FormButton } from '@/components/custom/form-button';
import { WeekBlock } from './week-block';

export function CreateEditSchede({ initialValues, exercises_list, onSubmit, loading, submitText }: any) {
    const [form] = Form.useForm();
    const watchedWeeks = Form.useWatch('num_weeks', form);

    useEffect(() => {
        if (initialValues) form.setFieldsValue(initialValues);
    }, [initialValues, form]);

    const totalWeeks = useMemo(() => Number(watchedWeeks) || 1, [watchedWeeks]);
    const weeksArray = Array.from({ length: totalWeeks }, (_, i) => i + 1);

    return (
        <div className="w-full max-w-5xl mx-auto">
            <Form form={form} onFinish={onSubmit} layout="vertical" autoComplete="off" requiredMark={false}>
                {/* CONFIGURAZIONE SCHEDA */}
                <Card className="mb-10 rounded-3xl shadow-sm border-sidebar-border bg-card/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <Form.Item 
                                label={<span className="font-black uppercase italic text-[10px] opacity-60 dark:text-zinc-300">Nome Scheda</span>}
                                name="name" 
                                rules={[{ required: true, message: 'Inserisci un nome' }]}
                            >
                                <Input size="large" placeholder="ES: TOTAL BODY FORZA" className="h-12 font-bold uppercase italic" />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item 
                                label={<span className="font-black uppercase italic text-[10px] opacity-60 dark:text-zinc-300">Durata (Settimane)</span>}
                                name="num_weeks" 
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={1} max={12} size="large" className="w-full h-12 font-bold" />
                            </Form.Item>
                        </div>
                    </div>
                </Card>

                {/* LISTA ESERCIZI RAGGRUPPATI PER SETTIMANA */}
                <Form.List name="exercises">
                    {(fields, { add, remove }) => (
                        <div className="space-y-6">
                            {weeksArray.map((wNum) => {
                                // Si filtrano visivamente i campi per questa settimana
                                const weekFields = fields.filter(field => {
                                    const val = form.getFieldValue(['exercises', field.name]);
                                    return val?.week_number === wNum;
                                });

                                return (
                                    <WeekBlock
                                        key={wNum}
                                        weekNum={wNum}
                                        weekFields={weekFields}
                                        remove={remove}
                                        add={add}
                                        exercisesList={exercises_list}
                                    />
                                );
                            })}
                        </div>
                    )}
                </Form.List>

                {/* BOTTONE SALVATAGGIO */}
                <div className="mt-12 mb-20 flex justify-end">
                    <FormButton processing={loading} label={submitText} icon={Save} />
                </div>
            </Form>
        </div>
    );
}