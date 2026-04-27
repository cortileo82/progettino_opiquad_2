import React from 'react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ChevronLeft, Plus, Edit3 } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { CreateEditSchede } from '@/components/custom/createdit-schede';

interface Props {
    client: any;
    exercises_list: any[];
    plan?: any;
}

export default function PlanForm({ client, exercises_list, plan }: Props) {
    // L'intelligenza architetturale: capiamo in che stato siamo
    const isEditing = !!plan;
    const { post, put, processing } = useForm();

    // Mappatura dati iniziale (incluso weight_kg)
    const initialValues = {
        name: isEditing ? plan.name : '',
        num_weeks: isEditing ? plan.num_weeks : 4,
        exercises: isEditing && plan.exercises ? plan.exercises.map((ex: any) => ({
            exercise_id: ex.id || ex.exercise_id,
            week_number: ex.pivot?.week_number || 1,
            day_of_week: ex.pivot?.day_of_week || 'Lunedì',
            sets: ex.pivot?.sets || '',
            reps: ex.pivot?.reps || '',
            rest_time: ex.pivot?.rest_time || '',
            weight_kg: ex.pivot?.weight_kg || '' // <-- Ripristinato il tuo campo
        })) : []
    };

    // Routing intelligente
    const handleSubmit = (values: any) => {
        if (isEditing) {
            put(`/pt/plans/${plan.id}`, { ...values, preserveScroll: true });
        } else {
            post('/pt/plans/store', { ...values, user_id: client.id });
        }
    };

    const breadcrumbs = isEditing ? [
        { title: 'I Miei Atleti', href: '/pt/clients/manage-clients' },
        { title: `Schede di ${client.name}`, href: `/pt/clients/${client.id}/plans` },
        { title: 'Modifica Scheda', href: '#' }
    ] : [
        { title: 'I Miei Atleti', href: '/pt/clients/manage-clients' },
        { title: 'Nuova Scheda', href: '#' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? `Modifica: ${plan.name}` : `Nuova Scheda: ${client.name}`} />
            
            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                <HeaderNew 
                    title={isEditing ? 'Modifica Scheda' : 'Crea Nuova Scheda'} 
                    subtitle={isEditing ? `Stai modificando l'allenamento per: ${client.name.toUpperCase()}` : `Stai creando un allenamento per: ${client.name.toUpperCase()}`} 
                    icon={isEditing ? Edit3 : Plus} 
                    buttonText="Annulla" 
                    buttonHref={isEditing ? `/pt/clients/${plan.user_id}/plans` : `/pt/clients/${client.id}/plans`} 
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
        </AppLayout>
    );
}