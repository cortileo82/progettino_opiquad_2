import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function GenericDashboard({ role }: { role: string }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '#' }]}>
            <Head title="Dashboard" />
            <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="bg-primary/10 p-6 rounded-full mb-6">
                    <span className="text-4xl">👋</span>
                </div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                    Benvenuto, {role}
                </h1>
                <p className="text-muted-foreground mt-4 max-w-md mx-auto font-medium">
                    Usa la barra laterale per navigare nelle sezioni a cui hai accesso.
                </p>
            </div>
        </AppLayout>
    );
}