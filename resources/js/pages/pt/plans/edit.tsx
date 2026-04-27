import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, Save, ChevronLeft, Dumbbell, ListChecks, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HeaderNew } from '@/components/custom/header-new';
import { CreateEditSchede } from '@/components/custom/createdit-schede';

export default function EditPlan({ client, exercises_list, plan }: any) {
    const { put, processing } = useForm();

    const initialData = {
        user_id: plan.user_id,
        name: plan.name,
        num_weeks: plan.num_weeks,
        exercises: plan.exercises ? plan.exercises.map((ex: any) => ({
            exercise_id: ex.id,
            week_number: ex.pivot.week_number,
            day_of_week: ex.pivot.day_of_week,
            sets: ex.pivot.sets,
            reps: ex.pivot.reps,
            rest_time: ex.pivot.rest_time || ''
        })) : []
    };

    return (         
         <AppLayout breadcrumbs={[{ title: 'I Miei Atleti', href: '/pt/dashboard' }, { title: 'Modifica Scheda', href: '#' }]}>
            <Head title={`Modifica: ${plan.name}`} /> 
            
            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                
                {/* Header con componente custom */}
                <HeaderNew 
                    title='Modifica Scheda'
                    subtitle={`Stai modificando l'allenamento per: ${client.name.toUpperCase()}`}
                    icon={Edit3}
                    buttonText="Annulla"
                    buttonHref={`/pt/clients/${plan.user_id}/plans`}
                    buttonIcon={<ChevronLeft size={18} />}
                />

                <CreateEditSchede 
                    initialData={initialData}
                    exercises_list={exercises_list}
                    submitText="Aggiorna Scheda"
                    processing={processing}
                    onSubmit={(data) => put(`/pt/plans/${plan.id}`, data)}
                />
            </div>
            </AppLayout>
    );
}