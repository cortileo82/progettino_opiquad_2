import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { HeaderNew } from '@/components/custom/header-new';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { ArrowLeft, BicepsFlexed, Save } from 'lucide-react';

export default function CreateMuscleGroup() {
    // Inizializzazione form semplificata per il solo "Create"
    const { data, setData, post, processing, errors } = useForm({
        name: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Utilizzo dell'URL senza trattini come richiesto
        post('/admin/muscle-groups');
    };

    return (
        <AppLayout 
            breadcrumbs={[
                { title: 'Gruppi Muscolari', href: '/admin/musclegroups' }, 
                { title: 'Nuovo', href: '#' }
            ]}
        >
            <Head title="Nuovo Gruppo Muscolare" />
            
            <div className="w-full p-6 md:p-10 max-w-4xl mx-auto">
                
                {/* Header Uniformato */}
                <HeaderNew 
                    title="Nuovo Gruppo"
                    subtitle="Inserisci una nuova categoria anatomica nel database."
                    icon={BicepsFlexed}
                    buttonText="Indietro"
                    buttonHref="/admin/muscle-groups"
                    buttonIcon={<ArrowLeft size={16} />}
                />

                <form onSubmit={handleSubmit} className="space-y-8 mt-10">
                    {/* Contenitore stile "Cattivo" - Bordo 2 e Rounding 2.5 */}
                    <div className="p-8 rounded-[2.5rem] border-2 border-sidebar-border bg-sidebar shadow-sm">
                        
                        <InputGroup
                            label="Nome della Categoria"
                            icon={BicepsFlexed}
                            value={data.name}
                            onChange={(val: string) => setData('name', val)}
                            error={errors.name}
                            placeholder="ES. PETTORALI, DORSI, GAMBE..."
                            required
                        />

                    </div>

                    {/* Bottone Azione con stato di caricamento integrato */}
                    <div className="flex justify-end">
                        <FormButton 
                            processing={processing} 
                            label="Crea Gruppo Muscolare" 
                            icon={Save}
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}