import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react'; 
import { ChevronLeft, Plus, Edit3 } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { CreateEditSchede } from '@/components/custom/createdit-schede';

interface Props {
    client: any;
    exercises_list: any[];
    plan?: any; // Se presente, siamo in modalità Edit
}

export default function CreatePlan({ client, exercises_list, plan }: Props) {
    const isEditing = !!plan;
    const [processing, setProcessing] = useState(false);

    // Mappatura dati iniziali (Create o Edit)
    const initialValues = {
        name: isEditing ? plan.name : '',
        num_weeks: isEditing ? plan.num_weeks : 1,
        exercises: isEditing && plan.exercises ? plan.exercises.map((ex: any) => ({
            exercise_id: ex.id || ex.exercise_id,
            week_number: ex.pivot?.week_number || 1,
            day_of_week: ex.pivot?.day_of_week || 'Lunedì',
            sets: ex.pivot?.sets ?? 0,
            reps: ex.pivot?.reps ?? 0,
            weight_kg: ex.pivot?.weight_kg ?? 0,
            rest_time: ex.pivot?.rest_time ?? 60,
        })) : []
    };

    const handleSubmit = (values: any) => {
        const payload = { 
            ...values, 
            user_id: client.id 
        };

        const visitOptions = {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onError: (errors: any) => console.error("Errore Validazione:", errors)
        };

        if (isEditing) {
            // Rotta PUT: /pt/plans/{plan}
            router.put(`/pt/plans/${plan.id}`, payload, visitOptions);
        } else {
            // Rotta POST: /pt/plans/store (Corrisponde al tuo web.php)
            router.post('/pt/plans/store', payload, visitOptions);
        }
    };

    const breadcrumbs = [
        { title: 'I Miei Atleti', href: '/pt/clients/manage-clients' },
        { title: `Schede di ${client.name}`, href: `/pt/clients/${client.id}/plans` },
        { title: isEditing ? 'Modifica Scheda' : 'Nuova Scheda', href: '#' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? `Modifica: ${plan.name}` : `Nuova Scheda: ${client.name}`} />
            
            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                <HeaderNew 
                    title={isEditing ? 'Modifica Scheda' : 'Crea Nuova Scheda'} 
                    subtitle={isEditing 
                        ? `Stai modificando l'allenamento per: ${client.name.toUpperCase()}` 
                        : `Stai creando un allenamento per: ${client.name.toUpperCase()}`
                    } 
                    icon={isEditing ? Edit3 : Plus} 
                    buttonText="Annulla" 
                    buttonHref={`/pt/clients/${client.id}/plans`} 
                    buttonIcon={<ChevronLeft size={18} />} 
                />
                
                <CreateEditSchede 
                    initialValues={initialValues} 
                    exercises_list={exercises_list} 
                    submitText={isEditing ? "Aggiorna Scheda" : "Salva e Attiva Scheda"} 
                    loading={processing} 
                    onSubmit={handleSubmit} 
                />
            </div>
        </AppLayout>
    );
}