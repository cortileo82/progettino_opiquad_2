import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { HeaderNew } from '@/components/custom/header-new';

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

export default function Assign({ availableClients }: Props) {
    // Usiamo uno stato locale per gestire il caricamento del pulsante
    const [processing, setProcessing] = useState(false);

    const handleAssign = (clientId: number) => {
        setProcessing(true);
        
        // Usiamo router.post con l'URL testuale diretto. 
        // Questo bypassa completamente Ziggy e l'errore "route is not defined"
        router.post('/pt/clients/assign', { client_id: clientId }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Associa Clienti', href: '/pt/clients/assign' }]}>
            <Head title="Associa Nuovi Clienti" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <HeaderNew 
                    title="Bacheca Nuovi Atleti"
                    subtitle="Seleziona e associa i nuovi atleti al tuo profilo"
                    icon={UserPlus} 
                    buttonText="Dashboard"
                    buttonHref="/pt/dashboard"
                    buttonIcon={<ArrowLeft size={16} />}
                />

                <div className="grid gap-4">
                    {availableClients && availableClients.length > 0 ? (
                        availableClients.map((client: Client) => ( 
                            <div key={client.id} className="flex items-center justify-between rounded-xl border border-sidebar-border bg-sidebar p-5 shadow-sm">
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg">{client.name}</span>
                                    <span className="text-sm text-muted-foreground">{client.email}</span>
                                </div>
                                <button
                                    onClick={() => handleAssign(client.id)} 
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold uppercase text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    {processing ? 'Assegnazione...' : 'Prendi in carico'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-xl border border-dashed border-sidebar-border py-20 text-center">
                            <p className="text-muted-foreground italic">Nessun atleta disponibile.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}