import React from 'react';
import { Link } from '@inertiajs/react';
import { Crown, Lock } from 'lucide-react';

interface PlanPaywallProps {
    isSticky?: boolean;
}

export function PlanPaywall({ isSticky = false }: PlanPaywallProps) {
    return (
        // Usiamo h-full e w-full invece di inset-0 per maggiore controllo
        <div className={`absolute top-0 left-0 w-full h-full z-20 flex justify-center bg-white/5 backdrop-blur-[2px] ${isSticky ? 'pt-24' : 'pt-10'}`}>
            {/* h-fit è fondamentale: il box bianco deve occupare solo il suo spazio, non tutta l'altezza */}
            <div className={`bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-zinc-100 max-w-2xl w-[90%] h-fit ${isSticky ? 'sticky top-28' : ''}`}>
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-4">
                        <Lock className="text-yellow-600" size={32} />
                    </div>
                    <h3 className="text-3xl font-black italic uppercase text-zinc-900 tracking-tight">Esercizi Bloccati</h3>
                    <p className="text-zinc-500 mt-2 font-medium italic">Scegli come sbloccare il tuo allenamento</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-200 flex flex-col justify-between">
                        <div>
                            <h4 className="font-black uppercase italic text-[10px] tracking-widest text-zinc-400 mb-1">Pass Singolo</h4>
                            <p className="font-bold text-zinc-900 mb-4">Questa Scheda</p>
                            <div className="text-2xl font-black italic text-zinc-900 mb-6">14.90€</div>
                        </div>
                        <Link href="/client/checkout/single" className="block w-full bg-white border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white font-black uppercase italic py-3 rounded-xl text-center text-xs transition-all">
                            Sblocca
                        </Link>
                    </div>

                    <div className="bg-zinc-900 rounded-3xl p-6 border border-yellow-500 shadow-xl shadow-yellow-500/10 flex flex-col justify-between">
                        <div>
                            <h4 className="font-black uppercase italic text-[10px] tracking-widest text-yellow-500 mb-1">Full Access</h4>
                            <p className="font-bold text-white mb-4">Tutto Illimitato</p>
                            <div className="text-2xl font-black italic text-white mb-6">29.90€</div>
                        </div>
                        <Link href="/client/pricing" className="block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase italic py-3 rounded-xl text-center text-xs transition-all">
                            Diventa PRO
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}