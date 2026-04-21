import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { UserPlus, FileText, PlusCircle, ArrowRight, Users, Mail } from 'lucide-react';

export default function MyClients({ clients, stats }: any) {
    return (
        <AppLayout breadcrumbs={[{ title: 'I Miei Atleti', href: '/pt/dashboard' }]}>
            <Head title="I Miei Atleti - TEMPRA" />

            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                
                {/* HEADER SEZIONE */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-sidebar-border pb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                            I Miei <span className="text-primary">Atleti</span>
                        </h1>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 opacity-70">
                            Gestione della lista atleti e monitoraggio performance.
                        </p>
                    </div>

                    <Link 
                        href="/pt/clients/assign" 
                        className="group flex items-center gap-3 bg-zinc-950 text-white px-8 py-4 rounded-2xl hover:bg-zinc-900 transition-all shadow-xl active:scale-95 border border-white/5"
                    >
                        <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="font-black uppercase italic text-xs tracking-widest">Associa Cliente</span>
                    </Link>
                </div>

                {/* GRID ATLETI */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {clients.map((client: any) => (
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
                                    {/* Email con layout migliorato per la leggibilità */}
                                    <div className="flex items-center gap-2 text-muted-foreground opacity-80">
                                        <Mail size={12} className="shrink-0" />
                                        <p className="text-[11px] font-semibold lowercase tracking-tight break-all">
                                            {client.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Azioni (Posizionate in basso) */}
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

                            {/* Overlay decorativo discreto */}
                            <div className="absolute -right-2 -top-2 text-primary/5 font-black italic text-7xl select-none pointer-events-none uppercase">
                                {client.name.charAt(0)}
                            </div>
                        </div>
                    ))}

                    {/* Stato Vuoto */}
                    {clients.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-sidebar border-2 border-dashed border-sidebar-border rounded-[3rem]">
                            <Users size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                            <p className="text-muted-foreground uppercase italic text-xs font-black tracking-[0.3em]">
                                Nessun atleta associato
                            </p>
                            <Link 
                                href="/pt/clients/assign"
                                className="inline-block mt-6 text-primary font-black uppercase italic text-[10px] tracking-widest hover:underline"
                            >
                                Inizia ora &rarr;
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer Decorativo */}
                <p className="text-center text-[9px] font-black uppercase italic opacity-20 tracking-[0.5em] mt-10">
                    TEMPRA Performance Lab
                </p>
            </div>
        </AppLayout>
    );
}