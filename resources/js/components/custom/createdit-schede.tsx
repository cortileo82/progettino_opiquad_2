import React, { useState, useEffect, useMemo } from 'react';
import { Form, ConfigProvider, theme } from 'antd';
import { WeekBlock } from '@/components/custom/week-block';
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
    const numWeeks = Form.useWatch('num_weeks', form) || initialValues.num_weeks || 1;
    const exercisesWatch = Form.useWatch('exercises', form) || [];

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkTheme = () => document.documentElement.classList.contains('dark');
        setIsDarkMode(checkTheme());
        
        const observer = new MutationObserver(() => setIsDarkMode(checkTheme()));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        
        return () => observer.disconnect();
    }, []);

    // Preparazione Dropdown Options
    const weekOptions = Array.from({ length: Math.max(1, numWeeks) }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
    const dayOptions = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'].map(d => ({ label: d.toUpperCase(), value: d }));
    const exerciseOptions = exercises_list.map(ex => ({ label: ex.name.toUpperCase(), value: ex.id }));
    const transformNumber = (v: any) => (v === '' || v === null || v === undefined) ? undefined : Number(v);

    // Calcolo delle settimane attive (previene che un calo in "numWeeks" faccia sparire misteriosamente i campi)
    const activeWeeksToRender = useMemo(() => {
        const requiredWeeks = Array.from({ length: Math.max(1, numWeeks) }, (_, i) => i + 1);
        const usedWeeks = exercisesWatch.map((ex: any) => ex?.week_number).filter((w: any) => typeof w === 'number');
        return Array.from(new Set([...requiredWeeks, ...usedWeeks])).sort((a, b) => a - b);
    }, [numWeeks, exercisesWatch]);

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    borderRadius: 12,
                    colorPrimary: isDarkMode ? '#ffffff' : '#09090b',
                    colorBgContainer: 'transparent',
                    colorBorder: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                }
            }}
        >
            <Form form={form} onFinish={onSubmit} layout="vertical" autoComplete="off" initialValues={initialValues}>
                <FormCard className="mb-8">
                    <Form.Item name="name" rules={[{ required: true, message: 'Obbligatorio' }]} className="mb-0">
                        <InputGroup label="Nome Programma" />
                    </Form.Item>
                    <Form.Item name="num_weeks" validateFirst rules={[{ required: true, message: 'Obbligatorio' }, { type: 'number', transform: transformNumber, min: 1, message: 'Minimo 1' }]} className="mb-0">
                        <InputGroup label="Settimane Totali" type="number" min={1} placeholder="ES. 4" />
                    </Form.Item>
                </FormCard>

                <div className="space-y-6">
                    <Form.List name="exercises">
                        {(fields, { add, remove }) => (
                            <div className="flex flex-col gap-6">
                                {activeWeeksToRender.map(weekNum => {
                                    // Filtra dinamicamente i fields che appartengono a questo blocco settimana
                                    const weekFields = fields.filter(field => {
                                        const ex = exercisesWatch[field.name];
                                        return (ex?.week_number || 1) === weekNum;
                                    });

                                    return (
                                        <WeekBlock 
                                            key={weekNum}
                                            weekNum={weekNum}
                                            weekFields={weekFields}
                                            add={add}
                                            remove={remove}
                                            weekOptions={weekOptions}
                                            dayOptions={dayOptions}
                                            exercisesList={exercises_list} 
                                            transformNumber={transformNumber}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </Form.List>
                </div>

                <div className="mt-8">
                    <FormButton label={submitText} processing={loading} />
                </div>
            </Form>
        </ConfigProvider>
    );
}