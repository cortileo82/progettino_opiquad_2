import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { UserPlus, ArrowLeft, Users, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';
import { Input } from '@/components/ui/input';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface Props {
    availableClients: Client[]; 
    filters: { search?: string };
}

export default function Assign({ availableClients = [], filters = {} }: Props) {
    const [processing, setProcessing] = useState<number | null>(null);
    const [search, setSearch] = useState(filters?.search || '');

    // Logica di ricerca (Debounce)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters?.search || '')) {
                router.get(
                    window.location.pathname,
                    { search: search },
                    { preserveState: true, replace: true, preserveScroll: true }
                );
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleAssign = (clientId: number) => {
        setProcessing(clientId);
        router.post('/pt/clients/assign', { client_id: clientId }, {
            onFinish: () => setProcessing(null),
            preserveScroll: true,
            onError: (err) => console.error(err)
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Associa Clienti', href: '/pt/clients/assign' }]}>
            <Head title="Associa Nuovi Clienti" />
            <div className="flex h-full flex-col gap-8 p-6 md:p-10">
                
                {/* Header con componente custom*/}

                <HeaderNew 
                    title="Nuovi Atleti" 
                    subtitle="Seleziona e associa i nuovi atleti al tuo profilo professionale." 
                    icon={UserPlus} 
                    actions={
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input 
                                placeholder="Cerca atleta" 
                                className="pl-12 bg-sidebar border-sidebar-border rounded-2x1 h-14 uppercase italic font-black text-[10px] tracking-widest w-full md:w-[300px"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    }
                    buttonText="TORNA INDIETRO"
                    buttonHref="/pt/clients"
                    buttonIcon={<ArrowLeft size={18} />}
                />

                <div className="grid gap-4 mt-4">
                    {availableClients.length > 0 ? (
                        availableClients.map((client) => ( 
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
                                    disabled={processing !== null}
                                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-6 py-3 text-[10px] font-black uppercase italic tracking-widest text-white hover:bg-zinc-900 shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    {processing === client.id ? 'Assegnazione...' : 'Prendi in carico'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <EmptyState 
                            message={search ? `Nessun risultato per "${search}"` : "Nessun nuovo atleta disponibile"} 
                            icon={Users} 
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}