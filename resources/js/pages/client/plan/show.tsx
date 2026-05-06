import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { HeaderNew } from '@/components/custom/header-new';
import { PlanViewer } from '@/components/custom/plan-viewer';
import { PlanPaywall } from '@/components/custom/plan-paywall';
import { ClipboardList, Dumbbell } from 'lucide-react';

interface Props {
    plan: any | null; 
}

export default function MyPlan({ plan }: Props) {
    const { auth } = usePage().props as any;
    const breadcrumbs = [{ title: 'La Mia Scheda', href: '/client/my-plan' }];
    
    const hasAccess = Boolean(auth.user.is_premium) || Boolean(plan?.is_paid);

    if (!plan) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="flex flex-col items-center justify-center py-24 opacity-30 text-center font-black uppercase italic tracking-tighter">
                    <Dumbbell size={48} className="mb-4" />
                    <p>Nessun programma attivo trovato.</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Scheda: ${plan.name}`} />
            
            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8">
                <HeaderNew title={plan.name} subtitle={`Coach: ${plan.trainer?.toUpperCase()} • Iniziata: ${plan.start_date}`} icon={ClipboardList} />

                <div className="grid grid-cols-1">
                    {!hasAccess ? (
                        <div className="relative min-h-[600px]">
                            <div className="z-30 relative w-full flex justify-center py-10">
                                <PlanPaywall isSticky={true} />
                            </div>

                            <div className="absolute inset-0 w-full h-full blur-3xl opacity-20 pointer-events-none select-none overflow-hidden rounded-[40px]">
                                <PlanViewer weeks={plan.weeks} totalWeeks={plan.total_weeks} />
                            </div>
                        </div>
                    ) : (
                        /* Visualizzazione standard per utenti con accesso */
                        <div className="w-full">
                            <PlanViewer weeks={plan.weeks} totalWeeks={plan.total_weeks} />
                        </div>
                    )}
                </div>
                
                {/* Padding finale invece di altezza fissa per pulizia layout */}
                <div className="pb-20" />
            </div>
        </AppLayout>
    );
}