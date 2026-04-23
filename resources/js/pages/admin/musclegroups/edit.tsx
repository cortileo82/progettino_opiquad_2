import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { HeaderNew } from '@/components/custom/header-new';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { Save, ArrowLeft, BicepsFlexed } from 'lucide-react';

interface MuscleGroup {
    id: number;
    name: string;
}

interface Props {
    // Aggiungiamo il controllo opzionale qui per sicurezza
    muscleGroup?: MuscleGroup; 
}

export default function EditMuscleGroup({ muscleGroup }: Props) {
    // PROTEZIONE CRUCIALE: Se il controller passa un nome diverso (es. 'group') 
    // o se l'oggetto è nullo, evitiamo il crash.
    const groupData = muscleGroup;

    const { data, setData, put, processing, errors } = useForm({
        name: groupData?.name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupData?.id) return;
        put(`/admin/muscle-groups/${groupData.id}`);
    };

    // Se muscleGroup è nullo, mostriamo uno stato di caricamento o torniamo nulla invece di crashare
    if (!groupData) {
        return <div className="p-10 text-white">Caricamento dati...</div>;
    }

    return (
        <AppLayout 
            breadcrumbs={[
                { title: 'Gruppi Muscolari', href: '/admin/muscle-groups' }, 
                { title: 'Modifica', href: '#' }
            ]}
        >
            {/* Usiamo l'optional chaining ?. anche qui */}
            <Head title={`Modifica ${groupData?.name || 'Gruppo'}`} />
            
            <div className="w-full p-6 md:p-10 italic uppercase max-w-4xl mx-auto">
                
                <HeaderNew 
                    title="Modifica Gruppo"
                    subtitle={`Stai aggiornando: ${groupData?.name || '---'}`}
                    icon={BicepsFlexed}
                    buttonText="Annulla"
                    buttonHref="/admin/muscle-groups"
                    buttonIcon={<ArrowLeft size={16} />}
                />

                <form onSubmit={handleSubmit} className="space-y-8 mt-10">
                    <div className="p-8 rounded-[2.5rem] border-2 border-sidebar-border bg-sidebar shadow-sm">
                        
                        <InputGroup
                            label="Nome della Categoria"
                            icon={BicepsFlexed}
                            value={data.name}
                            onChange={(val: string) => setData('name', val)}
                            error={errors.name}
                            placeholder="ES. PETTORALI, DORSI..."
                            required
                        />

                    </div>

                    <div className="flex justify-end">
                        <FormButton 
                            processing={processing} 
                            label="Salva Modifiche" 
                            icon={Save}
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}