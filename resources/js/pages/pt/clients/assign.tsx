import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { UserPlus, ArrowLeft, Users, Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';

// 1. Definiamo cosa c'è dentro un cliente
interface Client {
    id: number;
    name: string;
    email: string;
}

// 2. Definiamo le Props che arrivano dal Controller Laravel
interface Props {
    availableClients: Client[];
}

export default function Assign({ availableClients = [] }: Props) {
    // Usiamo uno stato locale per gestire il caricamento del pulsante
    const [processing, setProcessing] = useState(false);

    const handleAssign = (clientId: number) => {
        setProcessing(true);
        
        // Richiesta POST diretta per associare il cliente al PT
        router.post('/pt/clients/assign', { client_id: clientId }, {
            onFinish: () => setProcessing(false),
            preserveScroll: true
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Associa Clienti', href: '/pt/clients/assign' }]}>
            <Head title="Associa Nuovi Clienti" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
                
                {/* Header con componente custom */}
                <HeaderNew 
                    title="Bacheca Nuovi Atleti" 
                    subtitle="Seleziona e associa i nuovi atleti al tuo profilo professionale." 
                    icon={UserPlus} 
                    buttonText="TORNA INDIETRO"
                    buttonHref="/pt/clients"
                    buttonIcon={<ArrowLeft size={18} />}
                />

                <div className="grid gap-4 mt-4">
                    {availableClients && availableClients.length > 0 ? (
                        availableClients.map((client: Client) => ( 
                            <div key={client.id} className="flex items-center justify-between rounded-[2rem] border border-sidebar-border bg-sidebar p-6 shadow-sm hover:border-primary/20 transition-colors">
                                <div className="flex flex-col gap-1">
                                    <span className="font-black uppercase italic text-lg tracking-tight text-foreground">
                                        {client.name}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        {client.email}
                                    </span>
                                </div>
                                
                                <button
                                    onClick={() => handleAssign(client.id)} 
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-6 py-3 text-[10px] font-black uppercase italic tracking-widest text-white hover:bg-zinc-900 shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    {processing ? 'Assegnazione...' : 'Prendi in carico'}
                                </button>
                            </div>
                        ))
                    ) : (
                        /* Utilizzo del componente EmptyState per lista vuota */
                        <EmptyState 
                            message="Nessun nuovo atleta disponibile nella bacheca" 
                            icon={Users} 
                        />
                    )}
                </div>
            </div>
            </AppLayout>
    );
}