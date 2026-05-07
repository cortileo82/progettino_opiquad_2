import React from 'react';
import { Link } from '@inertiajs/react';
import { Crown, Lock } from 'lucide-react';

interface PlanPaywallProps {
    planId: number; // FONDAMENTALE: Serve al backend per sapere cosa far pagare
    planPrice?: string; // Permette di iniettare il prezzo dal database in futuro
    isSticky?: boolean;
}

export function PlanPaywall({ 
    planId, 
    planPrice = "15.99€", 
    isSticky = false 
}: PlanPaywallProps) {
    return (
        <div className={`absolute top-0 left-0 w-full h-full z-20 flex justify-center bg-white/5 dark:bg-black/20 backdrop-blur-[4px] ${isSticky ? 'pt-24' : 'pt-10'}`}>
            
            <div className={`bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[40px] shadow-2xl border border-zinc-100 dark:border-zinc-800 max-w-2xl w-[90%] h-fit ${isSticky ? 'sticky top-28' : ''}`}>
                
                {/* INTESTAZIONE */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-4">
                        <Lock className="text-yellow-600" size={32} />
                    </div>
                    <h3 className="text-3xl font-black italic uppercase text-zinc-900 dark:text-white tracking-tight">
                        Esercizi Bloccati
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium italic">
                        Scegli come sbloccare il tuo allenamento
                    </p>
                </div>

                {/* GRIGLIA OPZIONI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* OPZIONE 1: PASS SINGOLO */}
                    <div className="bg-zinc-50 dark:bg-zinc-950 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
                        <div>
                            <h4 className="font-black uppercase italic text-[10px] tracking-widest text-zinc-400 mb-1">
                                Pass Singolo
                            </h4>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                                Questa Scheda
                            </p>
                            <div className="text-2xl font-black italic text-zinc-900 dark:text-white mb-6">
                                {planPrice}
                            </div>
                        </div>
                        <Link 
                            href="/client/billing/checkout/plan"
                            method="post"
                            as="button"
                            type="button"
                            data={{ plan_id: planId }}
                            className="block w-full bg-white dark:bg-zinc-800 border border-zinc-900 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-900 hover:dark:bg-white hover:text-white hover:dark:text-zinc-900 font-black uppercase italic py-3 rounded-xl text-center text-xs transition-all active:scale-95"
                        >
                            Sblocca Singola
                        </Link>
                    </div>

                    {/* OPZIONE 2: ACCESSO COMPLETO (PRO) */}
                    <div className="bg-zinc-900 rounded-3xl p-6 border border-yellow-500 shadow-xl shadow-yellow-500/10 flex flex-col justify-between transform md:scale-105">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Crown size={14} className="text-yellow-500" />
                                <h4 className="font-black uppercase italic text-[10px] tracking-widest text-yellow-500">
                                    Accesso Completo
                                </h4>
                            </div>
                            <p className="font-bold text-white mb-4">
                                Tutto Illimitato
                            </p>
                            <div className="text-2xl font-black italic text-white mb-6">
                                39.99€<span className="text-[10px] text-zinc-500 ml-1">/mese</span>
                            </div>
                        </div>
                        {/* Questo rimane GET perché rimanda alla pagina dei prezzi per spiegare l'abbonamento */}
                        <Link 
                            href="/client/billing/pricing" 
                            className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase italic py-3 rounded-xl text-center text-xs transition-all active:scale-95 shadow-md shadow-yellow-500/20"
                        >
                            Diventa PRO
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}