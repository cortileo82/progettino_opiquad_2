import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Dumbbell, Save } from 'lucide-react';
import { FormCard } from '@/components/custom/form-card';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { HeaderNew } from '@/components/custom/header-new';

// IMPORTA TUTTO DA ANTD PER EVITARE CONFLITTI
import { Input, Select } from 'antd';

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
    muscleGroups?: MuscleGroup[];
    muscle_groups?: MuscleGroup[]; 
}

export default function ExerciseForm({ exercise, muscleGroups, muscle_groups }: Props) {
    const isEdit = !!exercise?.id;
    const availableMuscleGroups = muscleGroups || muscle_groups || [];

    // Mappiamo i gruppi muscolari per la Select di Ant Design
    const muscleOptions = availableMuscleGroups.map(group => ({
        label: group.name.toUpperCase(),
        value: group.id
    }));

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

    const pageTitle = isEdit ? "Modifica Esercizio" : "Crea Nuovo Esercizio";
    const pageSubtitle = isEdit 
        ? `Stai aggiornando: ${exercise.name}` 
        : "Inserisci un nuovo esercizio nel database della piattaforma.";

    return (
        <AppLayout 
            breadcrumbs={[
                { title: 'Esercizi', href: '/admin/exercises' }, 
                { title: isEdit ? 'Modifica' : 'Nuovo', href: '#' }
            ]}
        >
            <Head title={pageTitle} />

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
                        
                        {/* NOME ESERCIZIO - Utilizza il tuo stile InputGroup */}
                        <InputGroup label="Nome Esercizio" error={errors.name} icon={Dumbbell}>
                            <Input 
                                value={data.name} 
                                onChange={(e) => setData('name', e.target.value)} 
                                placeholder="Panca Piana"
                                // Applichiamo qui lo stile specifico dell'input interno
                                className="h-8 w-full rounded-md border border-input bg-transparent px-3 font-bold italic shadow-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                        </InputGroup>
                        
                        {/* GRUPPO MUSCOLARE */}
                        <InputGroup label="Gruppo Muscolare" error={errors.muscle_group_id}>
                            <Select 
                                value={data.muscle_group_id} 
                                onChange={(val) => setData('muscle_group_id', val)} 
                                options={muscleOptions}
                                placeholder="Seleziona..."
                                className="w-full h-8 font-bold italic"
                                // Ant Design richiede style per l'altezza precisa
                                style={{ height: '32px' }}
                            />
                        </InputGroup>
                        
                        {/* DESCRIZIONE - Finalmente grande e con il tuo stile */}
                        <div className="col-span-full">
                            <InputGroup label="Descrizione" error={errors.description}>
                                <Input.TextArea 
                                    value={data.description} 
                                    onChange={(e) => setData('description', e.target.value)} 
                                    placeholder="Note..."
                                    autoSize={{ minRows: 4, maxRows: 6 }}
                                    // Usiamo le stesse classi dell'input ma senza altezza fissa
                                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 font-bold italic shadow-sm focus:ring-1 focus:ring-primary outline-none"
                                />
                            </InputGroup>
                        </div>

                    </FormCard>
                    
                    <div className="flex justify-end pt-4">
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