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
            <div className="flex h-full flex-col gap-8 p-6 md:p-10">
                {/* Header della Dashboard */}
                <HeaderNew 
                    title="DASHBOARD" 
                    subtitle={`Benvenuto, ${auth.user.name.toUpperCase()}. Ecco il riepilogo della tua attività.`} 
                    icon={LayoutDashboard}
                />

                {/* Griglia delle Card Statistiche */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    <Card 
                        label="Clienti Assegnati" 
                        value={totalClients} 
                        icon={Users} 
                        className="border-l-4 border-l-primary" // Opzionale: un tocco di colore laterale
                    />

                    <Card 
                        label="Schede Create" 
                        value={totalWorkoutPlans} 
                        icon={FileText} 
                    />
                </div>
            </div>
    );
}