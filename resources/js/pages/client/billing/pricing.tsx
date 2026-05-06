import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Check, Crown, User, Zap } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';

export default function Pricing() {
    const breadcrumbs = [{ title: 'Abbonamento', href: '/client/pricing' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Il tuo Piano" />
            <div className="p-4 md:p-10 max-w-5xl mx-auto w-full space-y-12">
             
                <HeaderNew 
                    title="Piani di Allenamento" 
                    subtitle="Scegli il livello di supporto più adatto ai tuoi obiettivi." 
                    icon={Zap} 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                    {/* PIANO BASE (GRATIS) */}
                    <div className="bg-white border-2 border-zinc-100 rounded-3xl p-8 flex flex-col justify-between shadow-sm opacity-80">
                        <div>
                            <div className="h-12 w-12 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6">
                                <User className="text-zinc-600" size={24} />
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tight text-zinc-900">Base</h3>
                            <p className="text-zinc-500 mt-2 font-medium">Per chi ha appena iniziato.</p>
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-zinc-600 italic font-bold">
                                    <Check size={18} className="text-green-500" />
                                    <span>Possibilità di acquistare singole schede</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-400 font-medium">
                                    <span className="w-[18px] h-[1px] bg-zinc-300" />
                                    <span>Nessun accesso Pro illimitato</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12">
                            <div className="mb-6">
                                <span className="text-4xl font-black italic text-zinc-900">0€</span>
                                <span className="text-zinc-400 font-bold ml-2 uppercase text-[10px] tracking-widest">Sempre</span>
                            </div>
                            <div className="w-full bg-zinc-100 text-zinc-400 font-black uppercase italic py-5 rounded-xl text-center cursor-default">
                                Piano Attuale
                            </div>
                        </div>
                    </div>

                    {/* PIANO PREMIUM */}
                    <div className="relative bg-zinc-900 border-2 border-yellow-500 rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-yellow-500/20 transform md:scale-105">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-black uppercase italic px-4 py-1 rounded-full tracking-widest shadow-md">
                            Top Performance
                        </div>
                        <div>
                            <div className="h-12 w-12 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/40">
                                <Crown className="text-black" size={24} />
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tight text-white">Premium PRO</h3>
                            <p className="text-zinc-400 mt-2 font-medium">Accesso totale.</p>
                            <div className="mt-8 space-y-4">
                                {["Tutte le schede illimitate", "Storico completo", "Note avanzate del Coach", "Supporto Prioritario"].map((item) => (
                                    <div key={item} className="flex items-center gap-3 text-sm font-medium text-zinc-200">
                                        <Check size={18} className="text-yellow-500" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-12">
                            <div className="mb-6">
                                <span className="text-4xl font-black italic text-white">49.90€</span>
                                <span className="text-zinc-500 font-bold ml-2 uppercase text-[10px] tracking-widest">/ Mese</span>
                            </div>
                            <Link href="/client/checkout/premium" className="block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase italic py-5 rounded-xl text-center transition-all shadow-lg shadow-yellow-500/30 active:scale-95">
                                Attiva Premium
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}