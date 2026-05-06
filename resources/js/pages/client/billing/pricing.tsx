import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Check, Crown, Dumbbell, Zap } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';

interface Props {
    activePlanId?: number;
    activePlanName?: string;
    singlePlanPrice?: string;
}

export default function Pricing({ 
    activePlanId,
    activePlanName = "Tua Scheda Attiva", 
    singlePlanPrice = "15.99€" 
}: Props) {
    const { auth } = usePage().props as any;
    const breadcrumbs = [{ title: 'Pricing', href: '/client/billing/pricing' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sblocca il tuo potenziale" />
            <div className="p-4 md:p-10 max-w-5xl mx-auto w-full space-y-12">
                
                {/* 
                  HeaderNew dovrebbe già essere responsive se l'avete refattorizzato, 
                  ma se serve, assicuratevi che i testi interni abbiano i dark:text-white 
                */}
                <HeaderNew 
                    title="Scegli come allenarti" 
                    subtitle="Sblocca la tua scheda singola o accedi a tutti i contenuti con il piano PRO." 
                    icon={Zap} 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                    
                    {/* CARD SINGOLA SCHEDA (Inverte da Chiaro a Scuro) */}
                    <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between hover:border-zinc-200 dark:hover:border-zinc-700 transition-all shadow-sm dark:shadow-none">
                        <div>
                            <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                                <Dumbbell className="text-zinc-600 dark:text-zinc-400" size={24} />
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tight text-zinc-900 dark:text-white">
                                Singola Scheda
                            </h3>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                                Sblocca l'accesso completo a <strong className="dark:text-zinc-200">{activePlanName}</strong>.
                            </p>
                            
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                    <Check size={18} className="text-green-500 dark:text-green-400" />
                                    <span>Accesso illimitato a questa scheda</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                    <Check size={18} className="text-green-500 dark:text-green-400" />
                                    <span>Carichi e note del coach</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-zinc-400 dark:text-zinc-600 opacity-60">
                                    <Check size={18} />
                                    <span className="line-through">Accesso alle schede future</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <div className="mb-6">
                                <span className="text-4xl font-black italic text-zinc-900 dark:text-white">{singlePlanPrice}</span>
                                <span className="text-zinc-400 dark:text-zinc-500 font-bold ml-2 uppercase text-[10px] tracking-widest">Una Tantum</span>
                            </div>
                            
                            {/* Il bottone inverte: Nero su sfondo bianco -> Bianco su sfondo nero */}
                            <Link 
                                href="/client/billing/checkout/plan"
                                method="post"
                                as="button"
                                type="button"
                                data={{ plan_id: activePlanId }}
                                className="block w-full bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-black uppercase italic py-5 rounded-xl text-center transition-all active:scale-95 shadow-lg shadow-zinc-200 dark:shadow-none"
                            >
                                Sblocca questa scheda
                            </Link>
                        </div>
                    </div>

                    {/* CARD ABBONAMENTO PRO (Mantiene un design "Dark/Premium" in entrambe le modalità) */}
                    <div className="relative bg-zinc-900 dark:bg-zinc-950 border-2 border-yellow-500 rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-yellow-500/20 transform md:scale-105">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-black uppercase italic px-4 py-1 rounded-full tracking-widest whitespace-nowrap shadow-md">
                            Consigliato dal coach
                        </div>
                        
                        <div>
                            <div className="h-12 w-12 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/40">
                                <Crown className="text-black" size={24} />
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tight text-white">
                                Abbonamento PRO
                            </h3>
                            <p className="text-zinc-400 mt-2 font-medium">
                                Accesso totale a tutte le tue schede presenti e future.
                            </p>
                            
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-sm font-medium text-zinc-200">
                                    <Check size={18} className="text-yellow-500" />
                                    <span>Tutte le schede illimitate</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-zinc-200">
                                    <Check size={18} className="text-yellow-500" />
                                    <span>Storico allenamenti e progressi</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-zinc-200">
                                    <Check size={18} className="text-yellow-500" />
                                    <span>Note e correzioni del trainer</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <div className="mb-6">
                                <span className="text-4xl font-black italic text-white">39.99€</span>
                                <span className="text-zinc-500 font-bold ml-2 uppercase text-[10px] tracking-widest">/ Mese</span>
                            </div>

                            <Link 
                                href="/client/billing/checkout/subscription" 
                                method="post"
                                as="button"
                                type="button"
                                className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase italic py-5 rounded-xl text-center transition-all shadow-lg shadow-yellow-500/30 active:scale-95"
                            >
                                Diventa un Atleta PRO
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <p className="text-zinc-400 dark:text-zinc-600 text-[10px] font-black uppercase italic tracking-widest">
                        Pagamento sicuro con Stripe.
                    </p>
                </div>
                <div className="h-10" />
            </div>
        </AppLayout>
    );
}