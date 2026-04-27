import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ChevronLeft, Edit3 } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { CreateEditSchede } from '@/components/custom/createdit-schede';

export default function EditPlan({ client, exercises_list, plan }: any) {
    // 1. Inizializziamo useForm (lo stato interno servirà per il caricamento/processing)
    const { put, processing } = useForm();

    // 2. Mappatura precisa dei dati dal Database al Form
    // Usiamo l'optional chaining (?.) per evitare errori se i dati mancano
    const initialValues = {
        name: plan.name || '',
        num_weeks: plan.num_weeks || 1,
        exercises: plan.exercises ? plan.exercises.map((ex: any) => ({
            exercise_id: ex.id,
            week_number: ex.pivot?.week_number || 1,
            day_of_week: ex.pivot?.day_of_week || 'Lunedì',
            sets: ex.pivot?.sets || '',
            reps: ex.pivot?.reps || '',
            rest_time: ex.pivot?.rest_time || ''
        })) : []
    };

    // 3. Funzione di aggiornamento
    const handleUpdate = (values: any) => {
        //values contiene già name, num_weeks ed exercises formattati da Ant Design
        put(`/pt/plans/${plan.id}`, {
            ...values,
            preserveScroll: true
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'I Miei Atleti', href: '/pt/dashboard' }, { title: 'Modifica Scheda', href: '#' }]}>
            <Head title={`Modifica: ${plan.name}`} /> 
            
            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                
                <HeaderNew 
                    title='Modifica Scheda'
                    subtitle={`Stai modificando l'allenamento per: ${client.name.toUpperCase()}`}
                    icon={Edit3}
                    buttonText="Annulla"
                    buttonHref={`/pt/clients/${plan.user_id}/plans`}
                    buttonIcon={<ChevronLeft size={18} />}
                />

                <CreateEditSchede 
                    initialValues={initialValues} 
                    exercises_list={exercises_list}
                    submitText="Aggiorna Scheda"
                    loading={processing}
                    onSubmit={handleUpdate}
                />
            </div>
        </AppLayout>
    );
}