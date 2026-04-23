import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { HeaderNew } from '@/components/custom/header-new';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { Select } from 'antd';
import { Save, ArrowLeft, Dumbbell, AlignLeft, Target } from 'lucide-react';

interface MuscleGroup {
    id: number;
    name: string;
}

interface Exercise {
    id: number;
    name: string;
    description?: string;
    muscle_group_id: number | string;
}

interface Props {
    exercise: Exercise;
    muscleGroups: MuscleGroup[];
}

export default function EditExercise({ exercise, muscleGroups }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: exercise.name,
        muscle_group_id: exercise.muscle_group_id,
        description: exercise.description || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Nota: per gli aggiornamenti standard usiamo put (o patch se preferisci)
        put(`/admin/exercises/${exercise.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Esercizi', href: '/admin/exercises' }, { title: 'Modifica', href: '#' }]}>
            <Head title={`Modifica ${exercise.name}`} />
            
            <div className="w-full p-6 md:p-10 italic uppercase">
                
                {/* Header con componente*/}
                <HeaderNew 
                    title="Modifica Esercizio"
                    subtitle={`Stai aggiornando: ${exercise.name}`}
                    icon={Dumbbell}
                    buttonText="Annulla"
                    buttonHref="/admin/exercises"
                    buttonIcon={<ArrowLeft size={16} />}
                />

                {/*Form creato con i componenti*/}

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-[2.5rem] border-2 border-sidebar-border bg-sidebar shadow-sm">
                        
                        {/* NOME ESERCIZIO */}
                        <InputGroup
                            label="Nome dell'Esercizio"
                            value={data.name}
                            onChange={(val: string) => setData('name', val)}
                            error={errors.name}
                            required
                        />

                        {/* GRUPPO MUSCOLARE */}
                        <InputGroup
                            label="Gruppo Muscolare"
                            type="select"
                            value={data.muscle_group_id}
                            onChange={(val: string | number) => setData('muscle_group_id', val)}
                            error={errors.muscle_group_id}
                        >
                            <Select.Option value="" disabled>SELEZIONA GRUPPO...</Select.Option>
                            {muscleGroups.map((group) => (
                                <Select.Option key={group.id} value={group.id}>
                                    {group.name.toUpperCase()}
                                </Select.Option>
                            ))}
                        </InputGroup>

                        {/* DESCRIZIONE */}
                        <div className="md:col-span-2">
                            <InputGroup
                                label="Descrizione (Opzionale)"
                                type="textarea"
                                value={data.description}
                                onChange={(val: string) => setData('description', val)}
                                error={errors.description}
                                rows={5}
                            />
                        </div>
                    </div>

                    {/* BOTTONE SALVATAGGIO */}
                    <FormButton 
                        processing={processing} 
                        label="Salva Modifiche" 
                        icon={Save}
                    />
                </form>
            </div>
        </AppLayout>
    );
}