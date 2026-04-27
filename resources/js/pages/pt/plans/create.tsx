import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, Save, ChevronLeft, Dumbbell, ListChecks, ClipboardEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HeaderNew } from '@/components/custom/header-new';
import { CreateEditSchede } from '@/components/custom/createdit-schede';

export default function CreatePlan({ client, exercises_list }: any) {
    const { post, processing } = useForm();

    const initialData = {
        user_id: client.id,
        name: '',
        num_weeks: 4,
        exercises: [{ exercise_id: '', week_number: 1, day_of_week: 'Lunedì', sets: '1', reps: '', rest_time: '' }]
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'I Miei Atleti', href: '/pt/dashboard' }, 
            { title: 'Nuova Scheda', href: '#' }
        ]}>
            <Head title={`Nuova Scheda - ${client.name}`} />            
            
            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                
                {/* Header con componente */}
                <HeaderNew 
                    title='Compila Scheda'
                    subtitle={`Stai programmando l'allenamento per: ${client.name.toUpperCase()}`}
                    icon={ClipboardEdit}
                    buttonText="TORNA AI TUOI ATLETI"
                    buttonHref="/pt/clients/manage-clients"
                    buttonIcon={<ChevronLeft size={18} />}
                />

                {/*Creazione scheda con componente*/}
                <CreateEditSchede 
                    initialData={initialData}
                    exercises_list={exercises_list}
                    submitText="Conferma e Salva Scheda"
                    processing={processing}
                    onSubmit={(data) => post('/pt/plans/store', data)}
                />
                
            </div>
        </AppLayout>
    );
}