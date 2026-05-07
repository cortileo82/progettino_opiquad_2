import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Lock } from 'lucide-react';

interface PlanPaywallProps {
    isSticky?: boolean;
    planId?: number; // Fondamentale per identificare la scheda
}

export function PlanPaywall({ isSticky = false, planId }: PlanPaywallProps) {
    const [loadingSingle, setLoadingSingle] = useState(false);
    const [loadingPro, setLoadingPro] = useState(false);

    // Gestione acquisto singola scheda
    const handleSinglePurchase = () => {
        if (!planId) {
            console.error("Errore: ID Piano non ricevuto nel componente Paywall");
            return;
        }

        setLoadingSingle(true);
        router.post('/client/billing/checkout/plan', {
            plan_id: planId
        }, {
            onFinish: () => setLoadingSingle(false)
        });
    };

    // Gestione reindirizzamento alla pagina prezzi/abbonamento
    const handleGoToPricing = () => {
        setLoadingPro(true);
        router.get('/client/billing/pricing', {}, {
            onFinish: () => setLoadingPro(false)
        });
    };

    return (
        <div className={`absolute top-0 left-0 w-full h-full z-20 flex justify-center bg-white/5 backdrop-blur-[2px] ${isSticky ? 'pt-24' : 'pt-10'}`}>
            <div className={`bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-zinc-100 max-w-2xl w-[90%] h-fit ${isSticky ? 'sticky top-28' : ''}`}>
                
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-4">
                        <Lock className="text-yellow-600" size={32} />
                    </div>
                    <h3 className="text-3xl font-black italic uppercase text-zinc-900 tracking-tight">Esercizi Bloccati</h3>
                    <p className="text-zinc-500 mt-2 font-medium italic">Scegli come sbloccare il tuo allenamento</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* OPZIONE 1: PASS SINGOLO */}
                    <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-200 flex flex-col justify-between">
                        <div>
                            <h4 className="font-black uppercase italic text-[10px] tracking-widest text-zinc-400 mb-1">Pass Singolo</h4>
                            <p className="font-bold text-zinc-900 mb-4">Questa Scheda</p>
                            <div className="text-2xl font-black italic text-zinc-900 mb-6">15.99€</div>
                        </div>
                        
                        <button 
                            onClick={handleSinglePurchase}
                            disabled={loadingSingle || loadingPro}
                            className="block w-full bg-white border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white font-black uppercase italic py-3 rounded-xl text-center text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingSingle ? 'Caricamento...' : 'Sblocca'}
                        </button>
                    </div>

                    {/* OPZIONE 2: ACCESSO PREMIUM */}
                    <div className="bg-zinc-900 rounded-3xl p-6 border border-yellow-500 shadow-xl shadow-yellow-500/10 flex flex-col justify-between">
                        <div>
                            <h4 className="font-black uppercase italic text-[10px] tracking-widest text-yellow-500 mb-1">Accesso Completo</h4>
                            <p className="font-bold text-white mb-4">Tutto Illimitato</p>
                            <div className="text-2xl font-black italic text-white mb-6">39.99€</div>
                        </div>
                        
                        <button 
                            onClick={handleGoToPricing}
                            disabled={loadingSingle || loadingPro}
                            className="block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase italic py-3 rounded-xl text-center text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingPro ? 'Caricamento...' : 'Diventa PRO'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}