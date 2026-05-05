import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
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
    const { auth } = usePage().props as any;
    const breadcrumbs = [{ title: 'La Mia Scheda', href: '/client/my-plan' }];
    
    // Verifica se l'utente è premium
    const isPremium = auth.user.is_premium;

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

                <div className="relative">
                    
                    {!isPremium && (
                        /* Overlay per utenti non premium */
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-32 bg-white/5 backdrop-blur-[1px] px-8 text-center">
                            <div className="bg-white/95 p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/60 backdrop-blur-xl max-w-lg sticky top-40">
                                <h3 className="text-3xl font-black italic uppercase text-zinc-900 tracking-tight">
                                    Analisi Completa PRO
                                </h3>
                                <p className="text-zinc-500 mt-4 mb-10 font-medium italic leading-relaxed">
                                    Per visualizzare l'intera programmazione settimanale, i carichi progressivi e le note del trainer è necessario un account PRO.
                                </p>
                                
                                <div className="w-full max-w-xs mx-auto">
                                    <Link 
                                        href="/client/pricing"
                                        className="block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase italic py-5 rounded-lg shadow-lg shadow-yellow-500/40 text-center transition-all hover:scale-105 active:scale-95"
                                    >
                                        Passa a PRO ora
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contenuto della scheda: blur leggero se non premium */}
                    <div className={`transition-all duration-1000 ${!isPremium ? 'blur-[5px] opacity-50 pointer-events-none select-none' : ''}`}>
                        <PlanViewer 
                            weeks={plan.weeks} 
                            totalWeeks={plan.total_weeks} 
                        />
                    </div>
                </div>

                <div className="h-20" />
            </div>
        </AppLayout>
    );
}