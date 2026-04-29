import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { HeaderNew } from '@/components/custom/header-new';
import { PlanViewer } from '@/components/custom/plan-viewer';
import { ClipboardList, Dumbbell } from 'lucide-react';

interface Exercise {
    id: number;
    name: string;
    description: string | null;
    pivot: {
        sets: string;
        reps: string;
        rest_time: string;
        weight_kg: string;
    };
}

interface Props {
    plan: {
        name: string;
        trainer: string;
        start_date: string;
        total_weeks: number;
        weeks: Record<string, Record<string, Exercise[]>>;
    } | null;
}

export default function MyPlan({ plan }: Props) {
    const breadcrumbs = [{ title: 'La Mia Scheda', href: '/client/my-plan' }];

    if (!plan) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center uppercase italic font-black opacity-30 tracking-tighter">
                    <Dumbbell size={48} className="mb-4" />
                    <p>Nessun programma attivo trovato.</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Scheda: ${plan.name}`} />
            
            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8 min-h-screen">
                
                <HeaderNew 
                    title={plan.name}
                    subtitle={`Coach: ${plan.trainer.toUpperCase()} • Data Inizio: ${plan.start_date}`}
                    icon={ClipboardList}
                />

                {/* Il componente PlanViewer gestisce ora tutto: selettore WK e griglia esercizi */}
                <PlanViewer 
                    weeks={plan.weeks} 
                    totalWeeks={plan.total_weeks} 
                />

            </div>
        </AppLayout>
    );
}