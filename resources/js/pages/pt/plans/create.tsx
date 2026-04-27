import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ChevronLeft, Plus } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { CreateEditSchede } from '@/components/custom/createdit-schede';

export default function CreatePlan({ client, exercises_list }: any) {
    // 1. Inizializziamo useForm con i valori di default
    const { post, processing } = useForm();

    // 2. Valori iniziali per un nuovo piano
    const initialValues = {
        user_id: client.id,
        name: '',
        num_weeks: 4,
        exercises: [] // Parte vuoto
    };

    // 3. Funzione di invio
    const handleSubmit = (values: any) => {
        // Aggiungiamo l'user_id ai valori del form prima di inviare
        const payload = { ...values, user_id: client.id };
        
        post('/pt/plans', {
            ...payload,
            onSuccess: () => console.log("Scheda creata!"),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'I Miei Atleti', href: '/pt/dashboard' }, { title: 'Nuova Scheda', href: '#' }]}>
            <Head title={`Nuova Scheda: ${client.name}`} /> 
            
            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                
                <HeaderNew 
                    title='Crea Nuova Scheda'
                    subtitle={`Stai creando un allenamento per: ${client.name.toUpperCase()}`}
                    icon={Plus}
                    buttonText="Annulla"
                    buttonHref={`/pt/clients/${client.id}/plans`}
                    buttonIcon={<ChevronLeft size={18} />}
                />

                <CreateEditSchede 
                    initialValues={initialValues}
                    exercises_list={exercises_list}
                    submitText="Salva e Attiva Scheda"
                    loading={processing}
                    onSubmit={handleSubmit}
                />
            </div>
        </AppLayout>
    );
}