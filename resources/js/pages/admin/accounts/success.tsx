import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { LayoutDashboard, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Success() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Successo', href: '#' }]}>
            <Head title="Operazione Completata" />

            <div className="w-full p-6 md:p-10 italic uppercase">
                
                {/* ICONA DI CONFERMA ANIMATA */}
                <div className="mb-8 text-foreground animate-in fade-in zoom-in duration-500">
                    <CheckCircle2 size={80} strokeWidth={1.5} className="text-primary" />
                </div>

                {/* TESTO PRINCIPALE BOLD & ITALIC */}
                <div className="space-y-2 mb-12">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.85]">
                        OPERAZIONE <br /> 
                        <span className="text-muted-foreground/50">COMPLETATA</span>
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium normal-case not-italic mt-4 tracking-normal">
                        Il nuovo record è stato salvato correttamente nel database di sistema.
                    </p>
                </div>

                {/* PULSANTI DI NAVIGAZIONE */}
                <div className="flex flex-col md:flex-row gap-4">
                    <Link href="/admin/dashboard">
                        <Button className="bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl px-8 py-4 h-auto flex items-center gap-3 transition-all shadow-xl active:scale-95 group">
                            <LayoutDashboard size={18} className="group-hover:rotate-12 transition-transform" />
                            <span className="font-black uppercase italic tracking-[0.2em] text-[11px]">
                                Torna alla Dashboard
                            </span>
                        </Button>
                    </Link>

                    <Link href="/admin/accounts">
                        <Button variant="outline" className="border-sidebar-border rounded-xl px-8 py-4 h-auto flex items-center gap-3 transition-all active:scale-95 group">
                            <span className="font-black uppercase italic tracking-[0.2em] text-[11px]">
                                Gestione Account
                            </span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* BACKGROUND DECORATION (OPZIONALE) */}
                <div className="fixed bottom-0 right-0 opacity-[0.03] pointer-events-none p-10 select-none">
                    <CheckCircle2 size={400} />
                </div>
            </div>
        </AppLayout>
    );
}