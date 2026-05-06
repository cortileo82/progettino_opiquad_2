import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Archive, History } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { HeaderNew } from '@/components/custom/header-new';
import { EmptyState } from '@/components/custom/empty-state';
import { ResourceList } from '@/components/custom/resource-list';
import Pagination from '@/components/custom/pagination';

export default function Index({ pastPlans }: any) {
    const plansList = pastPlans.data || pastPlans;
    const { auth } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={[{ title: 'Storico Schede', href: '/client/history' }]}>
            <Head title="Storico Schede" />
            <div className="w-full p-6 md:p-10 max-w-7xl mx-auto">
                <HeaderNew title="Storico Schede" subtitle="Archivio delle tue schede passate." icon={Archive} isPremium={auth.user.is_premium}/>
                
                <div className="mt-6 space-y-4">
                    {plansList.length > 0 ? (
                        /* Si delega tutto alla ResourceList in modalità sola lettura */
                        <ResourceList 
                            items={plansList} 
                            type="plans" 
                            readOnly={true} 
                        />
                    ) : (
                        <EmptyState message="Nessuna scheda in archivio" icon={History} />
                    )}
                </div>
                
                {pastPlans.links && <Pagination meta={pastPlans} />}
            </div>
        </AppLayout>
    );
}