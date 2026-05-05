import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { HeaderNew } from '@/components/custom/header-new';
import { FormCard } from '@/components/custom/form-card';
import { FormButton } from '@/components/custom/form-button';
import { Crown, CheckCircle2, Zap, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function Pricing({ auth }: any) {
    const { post, processing } = useForm();

    const handleUpgrade = (e: React.FormEvent) => {
        e.preventDefault();
        // Puntiamo alla rotta che il tuo socio creerà nel controller
        post('/client/checkout/subscription');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Abbonamento', href: '#' }]}>
            <Head title="Passa a PRO" />

            <div className="w-full p-6 md:p-10">
                <HeaderNew 
                    title="Diventa un Atleta PRO" 
                    subtitle="Sblocca tutto il potenziale del tuo allenamento senza limiti." 
                    icon={Crown} 
                    buttonText="Indietro" 
                    buttonHref="/dashboard" 
                    buttonIcon={<ArrowLeft size={16} />} 
                />

                <div className="mt-10 max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 items-stretch">
    
                        {/* CARD PIANO BASIC */}
                        <div className="flex">
                            <FormCard className="bg-zinc-100/80 border-zinc-200 shadow-sm w-full flex flex-col"> 
                                <div className="p-8 flex flex-col h-full justify-between">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 text-center">Base</h3>
                                        <div className="mt-6 text-5xl font-black italic text-zinc-900 text-center">
                                            €0 <span className="text-sm font-medium text-zinc-500 not-italic uppercase">/mese</span>
                                        </div>
                                        
                                        <div className="h-px bg-zinc-200 my-8 w-full" />
                                        
                                        <ul className="space-y-6">
                                            <li className="flex items-center gap-4 text-base font-medium text-zinc-700">
                                                <CheckCircle2 size={20} className="text-zinc-400 shrink-0" /> 
                                                <span>Profilo Personale</span>
                                            </li>
                                            <li className="flex items-center gap-4 text-base font-medium text-zinc-700">
                                                <CheckCircle2 size={20} className="text-zinc-400 shrink-0" /> 
                                                <span>Visualizzazione Trainer</span>
                                            </li>
                                            <li className="flex items-center gap-4 text-base font-medium text-zinc-400 italic line-through">
                                                <CheckCircle2 size={20} className="opacity-20 shrink-0" /> 
                                                <span>Accesso Sala Pesi</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Spazio vuoto o bottone disabilitato per mantenere l'altezza */}
                                    <div className="mt-12 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest">
                                        Piano Attuale
                                    </div>
                                </div>
                            </FormCard>
                        </div>

                        {/* CARD PIANO PRO */}
                        <div className="flex relative">
                            <form onSubmit={handleUpgrade} className="w-full flex">
                                <FormCard className="border-yellow-500 bg-slate-50 shadow-xl shadow-yellow-500/10 w-full flex flex-col border-2">
                                    <div className="p-8 flex flex-col h-full justify-between">
                                        <div>
                                            <div className="flex justify-center items-center gap-2 mb-2">
                                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-yellow-600 text-center">Athlete PRO</h3>
                                                <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                                            </div>
                                            
                                            <div className="mt-4 text-6xl font-black italic text-zinc-900 text-center">
                                                €49 <span className="text-sm font-medium text-yellow-600 not-italic uppercase">/mese</span>
                                            </div>

                                            <div className="h-px bg-yellow-200 my-8 w-full" />

                                            <ul className="space-y-6">
                                                <li className="flex items-center gap-4 text-base font-extrabold italic text-zinc-800">
                                                    <ShieldCheck size={22} className="text-yellow-600 shrink-0" /> 
                                                    <span>Accesso illimitato in Palestra</span>
                                                </li>
                                                <li className="flex items-center gap-4 text-base font-extrabold italic text-zinc-800">
                                                    <ShieldCheck size={22} className="text-yellow-600 shrink-0" /> 
                                                    <span>Tutte le Schede PT sbloccate</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="mt-12 w-full">
                                            <FormButton 
                                                processing={processing} 
                                                label="Attiva Abbonamento" 
                                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase italic shadow-md py-8 text-lg transition-all hover:scale-[1.01] active:scale-95"
                                            />
                                            <p className="mt-4 text-[10px] text-center text-zinc-400 uppercase font-bold tracking-tighter">
                                                Pagamento sicuro con Stripe
                                            </p>
                                        </div>
                                    </div>
                                </FormCard>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}