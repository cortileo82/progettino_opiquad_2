import React from 'react';
import { Head } from '@inertiajs/react';
import { Users, FileText, LayoutDashboard, ArrowRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { HeaderNew } from '@/components/custom/header-new';
import { Card } from '@/components/custom/cards';
import { ActionButton } from '@/components/custom/action-button';

interface Props {
    auth: {
        user: {
            name: string;
        };
    };
    totalClients: number;
    totalWorkoutPlans: number;
}

export default function Dashboard({ auth, totalClients, totalWorkoutPlans }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'I Miei Atleti', href: '/pt/dashboard' }]}>
            <Head title="I Miei Atleti" />
            <div className="flex h-full flex-col gap-8 p-6 md:p-10">
                
                {/* Header con componente custom */}
                <HeaderNew 
                    title={`BENVENUTO, ${auth.user.name.toUpperCase()}`} 
                    subtitle="Ecco il riepilogo della tua attività e dei tuoi clienti."
                    icon={LayoutDashboard}
                />

                {/* Statistiche con componente Card custom*/}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    <Card 
                        label="Clienti Assegnati" 
                        value={totalClients} 
                        icon={Users} 
                    />

                    <Card 
                        label="Schede Create" 
                        value={totalWorkoutPlans} 
                        icon={FileText} 
                    />
                </div>
            </div>
            </AppLayout>
    );
}