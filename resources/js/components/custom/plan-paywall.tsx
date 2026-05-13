import React from 'react';
import { Link } from '@inertiajs/react';
import { Crown, Lock } from 'lucide-react';

interface PlanPaywallProps {
    planId?: number; 
    planPrice?: string; 
    isSticky?: boolean;
}

export function PlanPaywall({ planId, planPrice = "15.99€", isSticky = false }: PlanPaywallProps) {
    
    // Se c'è la scheda, manteniamo l'overlay. Se NON c'è, rendiamo tutto trasparente
    const wrapperClasses = planId 
        ? "absolute inset-0 z-50 flex justify-center pt-20 bg-white/5 backdrop-blur-[2px]" 
        : "relative w-full flex justify-center";

    return (
        <div className={wrapperClasses}>
            {/* Rimosso bg-white e shadow se non c'è planId per evitare l'effetto "riquadro nel vuoto" */}
            <div className={`p-8 md:p-12 max-w-2xl w-full h-fit ${planId ? 'bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl border border-zinc-100 dark:border-zinc-800' : 'bg-transparent'}`}>
                
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-4">
                        <Lock className="text-yellow-600" size={32} />
                    </div>
                    <h3 className="text-3xl font-black italic uppercase text-zinc-900 dark:text-white tracking-tight">
                        {planId ? "Esercizi Bloccati" : "Sblocca il tuo Profilo"}
                    </h3>
                </div>

                <div className={`grid gap-6 ${planId ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-sm mx-auto'}`}>
                    
                    {planId && (
                        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
                            <div>
                                <h4 className="font-black uppercase italic text-[10px] tracking-widest text-zinc-400 mb-1">Pass Singolo</h4>
                                <p className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">Questa Scheda</p>
                                <div className="text-2xl font-black italic text-zinc-900 dark:text-white mb-6">{planPrice}</div>
                            </div>
                            <Link 
                                href="/client/billing/checkout/plan"
                                method="post" as="button" data={{ plan_id: planId }}
                                className="block w-full bg-white dark:bg-zinc-800 border border-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-white font-black uppercase italic py-3 rounded-xl text-center text-xs transition-all"
                            >
                                Sblocca Singola
                            </Link>
                        </div>
                    )}

                    <div className={`bg-zinc-900 rounded-3xl p-6 border border-yellow-500 shadow-xl shadow-yellow-500/20 flex flex-col justify-between ${planId ? 'md:scale-105' : ''}`}>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Crown size={14} className="text-yellow-500" />
                                <h4 className="font-black uppercase italic text-[10px] tracking-widest text-yellow-500">Accesso PRO</h4>
                            </div>
                            <p className="font-bold text-white mb-4">Tutto Illimitato</p>
                            <div className="text-2xl font-black italic text-white mb-6">39.99€<span className="text-[10px] text-zinc-500 ml-1">/mese</span></div>
                        </div>
                        <Link 
                            href="/client/billing/pricing" 
                            className="block w-full bg-yellow-500 text-black font-black uppercase italic py-3 rounded-xl text-center text-xs transition-all"
                        >
                            Diventa PRO
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}