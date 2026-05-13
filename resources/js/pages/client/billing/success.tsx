import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';

export default function Success() {
    const { auth } = usePage().props as any;
    const breadcrumbs = [{ title: 'Pagamento Completato', href: '/client/billing/success' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pagamento Riuscito" />

            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-10">
                {/* Header istituzionale con badge Premium */}
                <HeaderNew 
                    title="Pagamento Confermato" 
                    subtitle="Il tuo abbonamento è ora attivo." 
                    icon={CheckCircle} 
                    isPremium={auth.user.is_premium}
                />

                <div className="flex flex-col items-center justify-center py-24 bg-white border border-zinc-100 rounded-[40px] shadow-sm relative">
                    
                    {/* Icona Successo Statica */}
                    <div className="mb-8">
                        <div className="p-6 bg-green-50 rounded-full">
                            <CheckCircle size={80} className="text-green-600" strokeWidth={1.5} />
                        </div>
                    </div>

                    <h2 className="text-4xl font-black italic uppercase text-zinc-900 mb-4 tracking-tighter text-center">
                        Funzionalità Sbloccata
                    </h2>
                    
                    <p className="text-zinc-500 mb-12 text-center max-w-md font-medium italic px-6 leading-relaxed">
                        Transazione completata con successo.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full px-6 justify-center">
                        <Link 
                            href="/client/dashboard" 
                            className="flex items-center justify-center gap-3 bg-zinc-950 text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest text-[11px] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 active:scale-95 group">
                            <ArrowLeft size={18}/>
                            Torna alla Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}