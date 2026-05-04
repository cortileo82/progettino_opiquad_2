import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ClipboardList, PlusCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { ResourceList } from '@/components/custom/resource-list';

interface Plan {
    id: number;
    name: string;
    num_weeks: number;
    created_at: string;
    weeks?: any;
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

    // Si adatta la funzione per ricevere l'ID dalla ResourceList
    const handleDeleteClick = (id: number) => {
        const plan = clientPlans.find(p => p.id === id);
        if (plan) {
            setPlanToDelete(plan);
            setIsDeleteOpen(true);
        }
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
            preserveScroll: true
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'I Miei Atleti', href: '/pt/clients/manage-clients' },
            { title: `Schede di ${client.name}`, href: '#' }
        ]}>
            <Head title={`Schede - ${client.name}`} />
            
            <div className="flex h-full flex-col gap-8 p-6 md:p-10">
                <HeaderNew 
                    title={`SCHEDE: ${client.name.toUpperCase()}`} 
                    subtitle="Gestione e archivio dei programmi di allenamento assegnati." 
                    icon={ClipboardList} 
                    buttonText="NUOVA SCHEDA" 
                    buttonHref={`/pt/plans/create/${client.id}`} 
                    buttonIcon={<PlusCircle size={18} />} 
                />
                
                <div className="w-full">
                    {clientPlans && clientPlans.length > 0 ? (
                        /* Si utilizza ResourceList.  */
                        <ResourceList 
                            items={clientPlans} 
                            type="plans" 
                            showBaseUrl="/pt/plans"         /* Utilizzato per stampare il bottone "occhio" per visualizzare i dettagli della scheda */
                            editBaseUrl="/pt/plans"         /* Utilizzato per stampare il bottone "matita" per modificare la scheda */
                            onDelete={handleDeleteClick} 
                        />
                    ) : (
                        <EmptyState message={`Nessuna scheda di allenamento trovata per ${client.name.toUpperCase()}`} icon={ClipboardList} />
                    )}
                </div>
                
                <ConfirmationModal 
                    isOpen={isDeleteOpen} 
                    onClose={() => setIsDeleteOpen(false)} 
                    onConfirm={handleConfirmDelete} 
                    loading={processing} 
                    title="ELIMINA SCHEDA" 
                    description={`ATTENZIONE: Stai per eliminare definitivamente la scheda "${planToDelete?.name?.toUpperCase()}". Questa azione rimuoverà tutti i dati associati e non potrà essere annullata.`} 
                    confirmText="SÌ, ELIMINA DEFINITIVAMENTE" 
                />
            </div>
        </AppLayout>
    );
}