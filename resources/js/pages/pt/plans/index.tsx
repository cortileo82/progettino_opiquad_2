import React, { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import { ClipboardList, PlusCircle, ArrowRight, Calendar, Trash2, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';

// Tipi TypeScript
interface Plan { 
    id: number; 
    name: string; 
    num_weeks: number; 
    created_at: string; 
}
interface Client { id: number; name: string; }
interface Props { client: Client; clientPlans: Plan[]; }

export default function ClientPlansIndex({ client, clientPlans }: Props) {
    // Stati per il Modal di conferma
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
    const [processing, setProcessing] = useState(false);

    const openDeleteModal = (plan: Plan) => {
        setPlanToDelete(plan);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!planToDelete) return;

        router.delete(`/pt/plans/${planToDelete.id}`, {
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setIsDeleteOpen(false);
                setPlanToDelete(null);
            },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'I Miei Atleti', href: '/pt/dashboard' }, 
            { title: `Schede di ${client.name}`, href: '#' }
        ]}>
            <Head title={`Schede - ${client.name}`} />

            <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full">
                
                {/* Header con componente */}
                <HeaderNew 
                    title={`Schede: ${client.name}`} // Ora è una stringa semplice
                    subtitle="Gestione dei programmi di allenamento."
                    icon={ClipboardList}
                    buttonText="Nuova Scheda"
                    buttonHref={`/pt/plans/create/${client.id}`}
                    buttonIcon={<PlusCircle size={18} />}
                />
                {/* 2. GRID SCHEDE O EMPTY STATE */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {clientPlans && clientPlans.length > 0 ? (
                        clientPlans.map((plan) => (
                            <div key={plan.id} className="bg-sidebar border border-sidebar-border rounded-[2rem] p-8 shadow-sm hover:border-primary/50 transition-all group relative overflow-hidden">
                                
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="space-y-1">
                                        <h3 className="font-black text-xl uppercase italic tracking-tight text-foreground leading-none">
                                            {plan.name}
                                        </h3>
                                        <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-tighter">
                                            <Calendar size={12} className="text-primary" /> 
                                            {plan.num_weeks} Settimane
                                        </p>
                                    </div>
                                    <div className="p-3 bg-background rounded-2xl text-primary shadow-inner">
                                        <ClipboardList size={22} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-8 pt-6 border-t border-sidebar-border/50 relative z-10">
                                    <Link 
                                        href={`/pt/plans/${plan.id}`}
                                        className="flex items-center gap-2 text-[11px] font-black uppercase italic text-foreground hover:text-primary transition-colors tracking-widest"
                                    >
                                        Dettagli <ArrowRight size={14} />
                                    </Link>

                                    <button 
                                        onClick={() => openDeleteModal(plan)}
                                        className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                        title="Elimina scheda"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <EmptyState 
                                message={`Nessun piano presente per ${client.name}`} 
                                icon={ClipboardList} 
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL DI CONFERMA */}
            <ConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={processing}
                title="Elimina Scheda"
                description={`Stai per eliminare definitivamente la scheda "${planToDelete?.name.toUpperCase()}". L'atleta non potrà più visualizzarla. Questa azione è irreversibile.`}
                confirmText="Sì, elimina scheda"
            />
        </AppLayout>
    );
}