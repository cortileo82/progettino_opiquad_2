import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dumbbell, Save } from 'lucide-react';
import { FormCard } from '@/components/custom/form-card';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { Select } from 'antd';
import { HeaderNew } from '@/components/custom/header-new';

interface MuscleGroup {
    id: number;
    name: string;
}

interface Exercise {
    id: number;
    name: string;
    description?: string;
    muscle_group_id: number | string | null;
}

interface Props {
    exercise?: Exercise;
    // Accettiamo entrambe le nomenclature per evitare bug di idratazione da Laravel
    muscleGroups?: MuscleGroup[];
    muscle_groups?: MuscleGroup[]; 
}

export default function ExerciseForm({ exercise, muscleGroups, muscle_groups }: Props) {
    // Capiamo se siamo in modalità modifica
    const isEdit = !!exercise?.id;
    
    // Normalizziamo i gruppi muscolari
    const availableMuscleGroups = muscleGroups || muscle_groups || [];

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: exercise?.name || '',
        muscle_group_id: exercise?.muscle_group_id ?? '',
        description: exercise?.description || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/exercises/${exercise.id}`, { preserveScroll: true });
        } else {
            post('/admin/exercises', {
                onSuccess: () => reset(),
                preserveScroll: true
            });
        }
    };

    // Variabili dinamiche per la UI
    const pageTitle = isEdit ? "Modifica Esercizio" : "Crea Nuovo Esercizio";
    const pageSubtitle = isEdit 
        ? `Stai aggiornando: ${exercise.name}` 
        : "Inserisci un nuovo esercizio nel database della piattaforma.";
    const breadcrumbTitle = isEdit ? "Modifica" : "Nuovo";

    return (
         <AppLayout 
            breadcrumbs={[
                { title: 'Esercizi', href: '/admin/exercises' }, 
                { title: 'Nuovo', href: '#' }
            ]}
        >
            <Head title="Aggiungi Nuovo Esercizio" />

            <div className="w-full p-6 md:p-10">
                
                <HeaderNew 
                    title={pageTitle} 
                    subtitle={pageSubtitle} 
                    icon={Dumbbell} 
                    buttonText="Annulla" 
                    buttonHref="/admin/exercises" 
                    buttonIcon={<ArrowLeft size={16} />} 
                />
                
                <form onSubmit={handleSubmit} className="w-full space-y-8 mt-10">
                    <FormCard>
                        <InputGroup 
                            label="Nome Esercizio" 
                            value={data.name} 
                            onChange={(val: string) => setData('name', val)} 
                            error={errors.name} 
                            required
                        />
                        
                        <InputGroup 
                            label="Gruppo Muscolare" 
                            type="select" 
                            value={data.muscle_group_id} 
                            onChange={(val: any) => setData('muscle_group_id', val)} 
                            error={errors.muscle_group_id}
                        >
                            <Select.Option value="">SELEZIONA GRUPPO...</Select.Option>
                            {availableMuscleGroups.map((group) => (
                                <Select.Option key={group.id} value={group.id}>
                                    {group.name?.toUpperCase() || 'SENZA NOME'}
                                </Select.Option>
                            ))}
                        </InputGroup>
                        
                        <InputGroup 
                            label="Descrizione (Opzionale)" 
                            type="textarea" 
                            className="md:col-span-2" 
                            value={data.description} 
                            onChange={(val: string) => setData('description', val)} 
                            error={errors.description} 
                            rows={5}
                        />
                    </FormCard>
                    
                    <div className="flex justify-end">
                        <FormButton 
                            processing={processing} 
                            label={isEdit ? "Salva Modifiche" : "Crea Esercizio"} 
                            icon={Save}
                        />
                    </div>
                </form>
            </div>
            </AppLayout>
    );
}