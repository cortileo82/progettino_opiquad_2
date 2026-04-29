import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Edit, ClipboardList, User, Calendar } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { PlanViewer } from '@/components/custom/plan-viewer';
import { Card } from '@/components/custom/cards';

interface Props {
    client: { id: number; name: string };
    plan: {
        id: number;
        name: string;
        num_weeks: number;
        total_weeks?: number;
        weeks: any;
    };
}

export default function ShowPlan({ client, plan }: Props) {
    const totalWeeks = plan?.num_weeks || plan?.total_weeks || 0;
    if (!plan) {
        return (
            <AppLayout breadcrumbs={[{ title: 'I Miei Atleti', href: '/pt/clients/manage-clients' }, { title: 'Errore', href: '#' }]}>
                <div className="p-10 text-center font-black uppercase italic">Caricamento scheda...</div>
            </AppLayout>
        );
    }

    return (
        <AppLayout 
            breadcrumbs={[
                { title: 'I Miei Atleti', href: '/pt/clients/manage-clients' }, 
                { title: 'Dettaglio Scheda', href: '#' }
            ]}>
            <Head title={`Scheda: ${plan.name}`} />
            
            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
               
                {/* Header con componente */}
                <HeaderNew 
                    title={plan.name?.toUpperCase() || 'SCHEDA SENZA NOME'} 
                    subtitle={`Visualizzazione dettagli della scheda assegnata a: ${client?.name?.toUpperCase() || 'ATLETA'}`} 
                    icon={ClipboardList} 
                    actions={
                        <div className="flex items-center gap-4">
                            <Link 
                                href={`/pt/clients/${client.id}/plans`} 
                                className="group flex items-center gap-2 text-[10px] font-black uppercase italic text-muted-foreground hover:text-foreground transition-all tracking-widest bg-sidebar border border-sidebar-border px-4 py-2 rounded-xl">
                                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />Indietro
                            </Link>
                            <Link 
                                href={`/pt/plans/${plan.id}/edit`} 
                                className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-2 rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95">
                                <Edit size={14} />
                                <span className="font-black uppercase italic text-[10px] tracking-widest">Modifica</span>
                            </Link>
                        </div>
                    } 
                />
                
                {/* Info Cards con componente custom*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card 
                        label="Atleta"
                        value={client?.name || 'N/D'}
                        icon={User}
                    />
                    
                    <Card 
                        label="Durata Scheda"
                        value={`${totalWeeks} Settimane`}
                        icon={Calendar}
                    />
                </div>

                {/* Visualizzazione con componente custom */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pl-4">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <h3 className="font-black uppercase italic text-sm tracking-widest">Allenamento</h3>
                    </div>

                    <PlanViewer 
                        weeks={plan.weeks || {}} 
                        totalWeeks={totalWeeks} 
                    />
                </div>
            </div>
        </AppLayout>
    );
}