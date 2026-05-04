import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { HeaderNew } from '@/components/custom/header-new';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { ArrowLeft, BicepsFlexed, Save } from 'lucide-react';

interface MuscleGroup {
    id: number;
    name: string;
}

interface Props {
    // Si accettano sia camelCase che snake_case per evitare problemi di idratazione con Laravel
    muscleGroup?: MuscleGroup;
    muscle_group?: MuscleGroup; 
}

export default function MuscleGroupForm({ muscleGroup, muscle_group }: Props) {
    // Si normalizzano i dati (si prende quello che Laravel ha inviato)
    const currentGroup = muscleGroup || muscle_group;
    
    // Si capisce se si è in creazione o in modifica
    const isEdit = !!currentGroup?.id;

    const { data, setData, post, put, processing, errors } = useForm({
        name: currentGroup?.name || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/muscle-groups/${currentGroup.id}`);
        } else {
            post('/admin/muscle-groups');
        }
    };

    // Variabili dinamiche per la UI
    const pageTitle = isEdit ? "Modifica Gruppo" : "Nuovo Gruppo";
    const pageSubtitle = isEdit 
        ? `Stai aggiornando: ${currentGroup.name}` 
        : "Inserisci una nuova categoria muscolare nel database.";
    const breadcrumbTitle = isEdit ? "Modifica" : "Nuovo";

    return (
        <AppLayout 
            breadcrumbs={[
                { title: 'Gruppi Muscolari', href: '/admin/muscle-groups' }, 
                { title: 'Nuovo', href: '#' }
            ]}
        >
            <Head title="Nuovo Gruppo Muscolare" />
            <div className="w-full p-6 md:p-10">
                
                <HeaderNew 
                    title={pageTitle} 
                    subtitle={pageSubtitle} 
                    icon={BicepsFlexed} 
                    buttonText="Annulla" 
                    buttonHref="/admin/muscle-groups" 
                    buttonIcon={<ArrowLeft size={16} />} 
                />
                
                <form onSubmit={handleSubmit} className="space-y-8 mt-10">
                    <div className="p-8 rounded-[2.5rem] border-2 border-sidebar-border bg-sidebar shadow-sm">
                        <InputGroup label="Nome della Categoria" error={errors.name} >
                            <input type='text' value={data.name} placeholder="ES. PETTORALI, DORSI, GAMBE..." onChange={(e) => setData('name', e.target.value)} className="h-8 w-full rounded-md border border-input bg-transparent px-3 font-bold italic shadow-sm focus:ring-1 focus:ring-primary outline-none text-sm"/>
                        </InputGroup>
                    </div>
                    
                    <div className="flex justify-end">
                        <FormButton 
                            processing={processing} 
                            label={isEdit ? "Salva Modifiche" : "Crea Gruppo Muscolare"} 
                            icon={Save} 
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}