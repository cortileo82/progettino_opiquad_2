import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { UserPlus, FileText, PlusCircle, ArrowRight, Users, Mail } from 'lucide-react';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';

interface Props {
    clients: any[];
    stats?: any;
}

export default function MyClients({ clients = [], stats }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'I Miei Atleti', href: '/pt/dashboard' }]}>
            <Head title="I Miei Atleti" />

            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                
                {/* Header con componente */}
                <HeaderNew 
                    title="I Miei Atleti"
                    subtitle="Gestione della lista atleti associati e monitoraggio performance."
                    icon={Users} 
                    buttonText="Associa Cliente"
                    buttonHref="/pt/clients/assign"
                    buttonIcon={<UserPlus size={16} />}
                />

                {/* GRID ATLETI */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {clients && clients.length > 0 ? (
                        clients.map((client: any) => (
                            <div key={client.id} className="bg-sidebar border border-sidebar-border rounded-[2.5rem] p-8 shadow-sm hover:border-primary/50 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[320px]">
                                
                                {/* Info Principali */}
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-background rounded-2xl text-primary shadow-inner">
                                            <Users size={24} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-black text-2xl uppercase italic tracking-tight text-foreground leading-tight">
                                            {client.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-muted-foreground opacity-80">
                                            <Mail size={12} className="shrink-0" />
                                            <p className="text-[11px] font-semibold lowercase tracking-tight break-all">
                                                {client.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Azioni */}
                                <div className="flex flex-col gap-3 relative z-10 mt-8">
                                    <Link 
                                        href={`/pt/clients/${client.id}/plans`}
                                        className="flex items-center justify-between w-full p-4 bg-background border border-sidebar-border rounded-2xl hover:border-primary transition-all group/link hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText size={16} className="text-muted-foreground" />
                                            <span className="text-[11px] font-black uppercase italic tracking-widest">Visualizza Schede</span>
                                        </div>
                                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform text-primary" />
                                    </Link>
                                    
                                    <Link 
                                        href={`/pt/plans/create/${client.id}`}
                                        className="flex items-center justify-between w-full p-4 bg-background border border-sidebar-border rounded-2xl hover:border-primary transition-all group/link hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-3">
                                            <PlusCircle size={16} className="text-primary" />
                                            <span className="text-[11px] font-black uppercase italic tracking-widest">Nuova Scheda</span>
                                        </div>
                                        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform text-primary" />
                                    </Link>
                                </div>

                                {/* Overlay decorativo */}
                                <div className="absolute -right-2 -top-2 text-primary/5 font-black italic text-7xl select-none pointer-events-none uppercase">
                                    {client.name.charAt(0)}
                                </div>
                            </div>
                        ))
                    ) : (
                        
                        /* Vuoto con componente */
                        <div className="col-span-full">
                            <EmptyState message="Nessun atleta associato al tuo profilo" icon={Users}/>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}