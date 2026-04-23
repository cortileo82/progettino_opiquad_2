import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import { FormCard } from '@/components/custom/form-card';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { Select } from 'antd';
import { HeaderNew } from '@/components/custom/header-new';

interface MuscleGroup {
    id: number;
    name: string;
}

interface Props {
    // Ricevuti dal controller Laravel (es: 'muscleGroups' => MuscleGroup::all())
    muscleGroups: MuscleGroup[];
}

export default function CreateExercise({ muscleGroups = [] }: Props) {
    // Inizializziamo useForm con i campi necessari per il DB
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        muscle_group_id: '', // Usiamo l'ID per la relazione Foreign Key
        description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Invia i dati alla rotta store del controller
        post('/admin/exercises', {
            onSuccess: () => reset(),
            preserveScroll: true
        });
    };

    return (
        <AppLayout 
            breadcrumbs={[
                { title: 'Esercizi', href: '/admin/exercises' }, 
                { title: 'Nuovo', href: '#' }
            ]}
        >
            <Head title="Aggiungi Nuovo Esercizio" />

            
            
            <div className="w-full p-6 md:p-10 italic uppercase">

                {/*Header con componente*/}
                <HeaderNew 
                        title="Crea nuovo esercizio"
                        subtitle="Inserisci un nuovo esercizio nel database della piattaforma."
                        icon={Dumbbell}
                        buttonText="Annulla"
                        buttonHref="/admin/exercises"
                        buttonIcon={<ArrowLeft size={16} />}
                    />

                {/* Form di creazione con componente */}
                <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                    <FormCard>
                        {/* 1. NOME ESERCIZIO */}
                        <InputGroup 
                            label="Nome Esercizio" 
                            value={data.name} 
                            onChange={(val: string) => setData('name', val)} 
                            error={errors.name} 
                        />

                        {/* 2. GRUPPO MUSCOLARE (Select dinamica dal DB) */}
                        <InputGroup 
                            label="Gruppo Muscolare" 
                            type="select" 
                            value={data.muscle_group_id} 
                            onChange={(val: any) => setData('muscle_group_id', val)}
                            error={errors.muscle_group_id}
                        >
                            {muscleGroups && muscleGroups.map((group) => (
                                <Select.Option key={group.id} value={group.id}>
                                    {group.name.toUpperCase()}
                                </Select.Option>
                            ))}
                        </InputGroup>

                        {/* 3. DESCRIZIONE */}
                        <InputGroup 
                            label="Descrizione (Opzionale)" 
                            type="textarea" 
                            className="md:col-span-2"
                            value={data.description} 
                            onChange={(val: string) => setData('description', val)} 
                            error={errors.description} 
                        />
                    </FormCard>

                    {/* Bottone di invio */}
                    <div className="flex justify-end">
                        <FormButton 
                            processing={processing} 
                            label="Crea Esercizio" 
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}