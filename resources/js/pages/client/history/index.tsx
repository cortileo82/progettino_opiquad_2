import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Archive, History } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';
import { ResourceList } from '@/components/custom/resource-list';
import Pagination from '@/components/custom/pagination';

export default function Index({ pastPlans }: any) {
    const { auth } = usePage().props as any;
    /* pastPlans ora contiene solo schede che l'utente ha il diritto di vedere (se pagate o utente premium) */
    const plansList = pastPlans.data || pastPlans;
    return (
        <AppLayout breadcrumbs={[{ title: 'Storico Schede', href: '/client/history' }]}>
            <Head title="Storico Schede" />
            <div className="w-full p-6 md:p-10 max-w-7xl mx-auto">
                {/* Header con componente custom */}
                <HeaderNew title="Storico Schede" subtitle={auth.user.is_premium 
                        ? "Archivio completo di tutti i tuoi allenamenti." 
                        : "Archivio delle schede sbloccate."
                    } icon={Archive} isPremium={auth.user.is_premium} />
                <div className="mt-6 space-y-4">
                    {plansList.length > 0 ? (
                        /* Schede visualizzate in modalità lettura con componente custom */
                        <ResourceList items={plansList} type="plans" readOnly={true} />
                    ) : (
                        /* EmptyState con componente custom */
                        <EmptyState message="Nessuna scheda disponibile nello storico." icon={History} />
                    )}
                </div>
                {pastPlans.links && <Pagination meta={pastPlans} />}
            </div>
        </AppLayout>
    );
}