import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { HeaderNew } from '@/components/custom/header-new';
import { Card } from '@/components/custom/cards';
import { EmptyState } from '@/components/custom/empty-state';
import { 
    Users, 
    Dumbbell, 
    UserCheck, 
    History,
    ArrowUpRight,
    ClipboardList,
    LayoutDashboard 
} from 'lucide-react';

interface Stats {
    total_clients: number;
    total_pts: number;
    total_exercises: number;
    total_workouts: number; 
}

interface MuscleGroup {
    id: number;
    name: string;
}

interface Exercise {
    id: number;
    name: string;
    muscle_group?: MuscleGroup;
}

interface Props {
    stats: Stats;
    exercises: Exercise[];
}

export default function Dashboard({ stats, exercises }: Props) {
    const { auth } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={[{ title: 'Admin Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Admin Dashboard" />
            <div className="w-full p-6 md:p-10">
                
                {/* Header con componente */}
                <HeaderNew 
                    title="Benvenuto" 
                    subtitle="Panoramica attuale del sistema." 
                    icon={LayoutDashboard}
                />

                {/* Cards statistiche con componente */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full p-4">
                    <Card label="Clienti" value={stats?.total_clients ?? 0} icon={Users}/>
                    <Card label="Trainer" value={stats?.total_pts ?? 0} icon={UserCheck}/>
                    <Card label="Esercizi" value={stats?.total_exercises ?? 0} icon={Dumbbell}/>
                    <Card label="Schede" value={stats?.total_workouts ?? 0} icon={ClipboardList}/>
                </div>

                {/* --- SEZIONE ULTIMI ESERCIZI --- */}
                <div className="flex flex-col gap-4 w-full mt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black tracking-tight uppercase italic flex items-center gap-2">
                            <History size={18} className="text-foreground" />
                            Ultimi Esercizi Inseriti
                        </h2>
                        <Link 
                            href="/admin/exercises" 
                            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                            Vedi Tutti <ArrowUpRight size={12} />
                        </Link>
                    </div>

                    <div className="rounded-2xl border border-sidebar-border bg-sidebar shadow-sm overflow-hidden">
                        <div className="divide-y divide-sidebar-border">
                            {exercises && exercises.length > 0 ? (
                                exercises.slice(0, 5).map((ex) => (
                                    <div key={ex.id} className="p-4 flex items-center justify-between group hover:bg-background/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
                                            <span className="font-bold uppercase text-sm tracking-widest text-foreground">
                                                {ex.name}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter bg-background px-2 py-1 rounded border border-sidebar-border">
                                            {ex.muscle_group?.name || 'N/A'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                /* Componente per pagina vuota */
                                <EmptyState 
                                    message="Nessun esercizio presente nel database" 
                                    icon={Dumbbell} 
                                />
                            )}
                        </div>
                    </div>
                </div>

            </div>
            </AppLayout>
    );
}