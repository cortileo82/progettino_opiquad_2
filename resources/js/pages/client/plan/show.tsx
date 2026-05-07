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
    
    // Controllo accesso: Premium o singola scheda pagata
    const hasAccess = Boolean(auth.user.is_premium) || Boolean(plan?.is_paid);

    if (!plan) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Nessun Piano" />
                <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8">
                    <HeaderNew 
                        title="Nessun Piano" 
                        subtitle="Non ci sono programmi attivi al momento." 
                        icon={ClipboardList} 
                        isPremium={auth.user.is_premium} 
                    />
                    
                    {/* Se non c'è il piano e l'utente non è premium, mostriamo il paywall relativo */}
                    {!auth.user.is_premium && (
                        <div className="py-6">
                            <PlanPaywall isSticky={false} />
                        </div>
                    )}

                    <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center font-black uppercase italic tracking-tighter">
                        <Dumbbell size={48} className="mb-4" />
                        <p>In attesa del caricamento da parte del coach.</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Scheda: ${plan.name}`} />
            
            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8">
                
                {/* 1. HEADER: Sempre visibile e mai sfocato */}
                <HeaderNew 
                    title={plan.name} 
                    subtitle={`Coach: ${plan.trainer?.toUpperCase()} • Iniziata: ${plan.start_date}`} 
                    icon={ClipboardList} 
                    isPremium={auth.user.is_premium} 
                />
                
                {/* 2. AREA CONTENUTO: Gestione Paywall o Visualizzazione */}
                <div className="grid grid-cols-1">
                    {!hasAccess ? (
                        /* CASO: Scheda presente ma NON pagata */
                        <div className="relative min-h-[600px]">
                            
                            {/* Il Paywall si sovrappone grazie alla classe absolute gestita internamente */}
                            <PlanPaywall isSticky={true} planId={plan.id} />
                            
                            {/* Sfondo sfocato per dare profondità senza mostrare i dati */}
                            <div className="absolute inset-0 w-full h-full blur-3xl opacity-20 pointer-events-none select-none overflow-hidden rounded-[40px]">
                                <PlanViewer weeks={plan.weeks} totalWeeks={plan.total_weeks} />
                            </div>
                        </div>
                    ) : (
                        /* CASO: Accesso garantito */
                        <div className="w-full animate-in fade-in duration-700">
                            <PlanViewer weeks={plan.weeks} totalWeeks={plan.total_weeks} />
                        </div>
                    )}
                </div>
                
                <div className="pb-20" />
            </div>
        </AppLayout>
    );
}