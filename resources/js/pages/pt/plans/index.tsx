import React, { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import { ClipboardList, PlusCircle, ArrowRight, Calendar, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface Plan { 
    id: number; 
    name: string; 
    num_weeks: number; 
    created_at: string; 
}

interface Client { 
    id: number; 
    name: string; 
}

interface Props { 
    client: Client; 
    clientPlans: Plan[]; 
}

export default function ClientPlansIndex({ client, clientPlans }: Props) {
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

            
            <div className="p-6 md:p-10 flex flex-col gap-10 w-full">
                
                {/* 1. HEADER (Utilizzo componente custom) */}
                <HeaderNew 
                    title={`SCHEDE: ${client.name.toUpperCase()}`}
                    subtitle="Gestione e archivio dei programmi di allenamento assegnati."
                    icon={ClipboardList}
                    buttonText="NUOVA SCHEDA"
                    buttonHref={`/pt/plans/create/${client.id}`}
                    buttonIcon={<PlusCircle size={18} />}
                />

                {/* 2. AREA CONTENUTO */}
                <div className="w-full">
                    {clientPlans && clientPlans.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {clientPlans.map((plan) => (
                                <div 
                                    key={plan.id} 
                                    className="bg-sidebar border border-sidebar-border rounded-[2.5rem] p-8 hover:border-foreground/20 transition-all duration-300 group flex flex-col justify-between min-h-[260px] relative overflow-hidden"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-4 bg-background rounded-2xl text-primary border border-sidebar-border shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                <ClipboardList size={22} />
                                            </div>
                                            
                                            <button 
                                                onClick={() => openDeleteModal(plan)}
                                                className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <h3 className="font-black text-2xl uppercase italic tracking-tighter text-foreground leading-tight">
                                            {plan.name}
                                        </h3>
                                        
                                        <div className="flex items-center gap-2 mt-2">
                                            <Calendar size={12} className="text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                                DURATA: {plan.num_weeks} SETTIMANE
                                            </span>
                                        </div>
                                    </div>

                                    {/* Link ai dettagli */}
                                    <div className="mt-8 pt-6 border-t border-sidebar-border/50">
                                        <Link 
                                            href={`/pt/plans/${plan.id}`}
                                            className="flex items-center justify-between group/btn"
                                        >
                                            <span className="text-[11px] font-black uppercase italic tracking-widest text-foreground group-hover/btn:text-primary transition-colors">
                                                VISUALIZZA SCHEDA
                                            </span>
                                            <div className="p-2 bg-background border border-sidebar-border rounded-lg group-hover/btn:translate-x-1 transition-all">
                                                <ArrowRight size={14} className="text-primary" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* 3. EMPTY STATE (Utilizzo componente custom) */
                        <EmptyState 
                            message={`Nessuna scheda di allenamento trovata per ${client.name.toUpperCase()}`} 
                            icon={ClipboardList} 
                        />
                    )}
                </div>
    
            {/* 4. MODAL DI CONFERMA (Utilizzo componente custom) */}
            <ConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={processing}
                title="ELIMINA SCHEDA"
                description={`ATTENZIONE: Stai per eliminare definitivamente la scheda "${planToDelete?.name.toUpperCase()}". Questa azione rimuoverà tutti i dati associati e non potrà essere annullata.`}
                confirmText="SÌ, ELIMINA DEFINITIVAMENTE"
            />
            </div>
            </AppLayout>
    );
}