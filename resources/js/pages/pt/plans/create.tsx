import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react'; 
import { ChevronLeft, Plus, Edit3 } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { CreateEditSchede } from '@/components/custom/createdit-schede';

export default function CreatePlan({ client, exercises_list, plan }: any) {
    const isEditing = !!plan;
    const [processing, setProcessing] = useState(false);

    const initialValues = {
        name: isEditing ? plan.name : '',
        num_weeks: isEditing ? plan.num_weeks : 1,
        exercises: isEditing && plan.exercises ? plan.exercises.map((ex: any) => ({
            exercise_id: ex.id,
            week_number: ex.pivot?.week_number || 1,
            day_of_week: ex.pivot?.day_of_week || 'Lunedì',
            sets: ex.pivot?.sets ?? 3,
            reps: ex.pivot?.reps ?? 10,
            weight_kg: ex.pivot?.weight_kg ?? 0,
            rest_time: ex.pivot?.rest_time ?? 60,
        })) : []
    };

    const handleSubmit = (values: any) => {
        const payload = { 
            ...values, 
            user_id: client.id,
            exercises: values.exercises.map((ex: any) => ({
                ...ex,
                exercise_id: Number(ex.exercise_id),
                week_number: Number(ex.week_number),
                day_of_week: String(ex.day_of_week)
            }))
        };

        router[isEditing ? 'put' : 'post'](
            isEditing ? `/pt/plans/${plan.id}` : '/pt/plans/store', 
            payload, 
            {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Atleti', href: '/pt/clients/manage-clients' }, { title: 'Nuova Scheda', href: '#' }]}>
            <Head title={isEditing ? 'Modifica Scheda' : 'Nuova Scheda'} />
            <div className="p-6 md:p-10">
                <HeaderNew 
                    title={isEditing ? 'Modifica Scheda' : 'Nuova Scheda'} 
                    subtitle={`${client.name.toUpperCase()}`} 
                    icon={isEditing ? Edit3 : Plus} 
                    buttonText="Indietro" 
                    buttonHref={`/pt/clients/${client.id}/plans`} 
                    buttonIcon={<ChevronLeft size={18} />} 
                />
                <CreateEditSchede 
                    initialValues={initialValues} 
                    exercises_list={exercises_list} 
                    submitText={isEditing ? "Aggiorna" : "Salva"} 
                    loading={processing} 
                    onSubmit={handleSubmit} 
                />
            </div>
        </AppLayout>
    );
}