import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Users, 
    Dumbbell, 
    UserCheck, 
    Plus, 
    ChevronRight 
} from 'lucide-react';

interface Stats {
    total_clients: number;
    total_pts: number;
    total_exercises: number;
}

interface Exercise {
    id: number;
    name: string;
    muscle_group?: string;
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

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Intestazione */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Benvenuto, {auth.user.name}
                    </h1>
                    <p className="text-muted-foreground">
                        Ecco una panoramica della tua palestra oggi.
                    </p>
                </div>

                {/* --- SEZIONE CARDS STATISTICHE --- */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Card Clienti */}
                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border bg-sidebar p-6 shadow-sm transition-hover hover:shadow-md">
                        <div className="rounded-full bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Clienti Totali</p>
                            <p className="text-3xl font-bold">{stats?.total_clients ?? 0}</p>
                        </div>
                    </div>

                    {/* Card Personal Trainer */}
                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border bg-sidebar p-6 shadow-sm transition-hover hover:shadow-md">
                        <div className="rounded-full bg-green-500/10 p-3 text-green-600 dark:text-green-400">
                            <UserCheck size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">PT Attivi</p>
                            <p className="text-3xl font-bold">{stats?.total_pts ?? 0}</p>
                        </div>
                    </div>

                    {/* Card Esercizi */}
                    <div className="flex items-center gap-4 rounded-xl border border-sidebar-border bg-sidebar p-6 shadow-sm transition-hover hover:shadow-md">
                        <div className="rounded-full bg-orange-500/10 p-3 text-orange-600 dark:text-orange-400">
                            <Dumbbell size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Esercizi</p>
                            <p className="text-3xl font-bold">{stats?.total_exercises ?? 0}</p>
                        </div>
                    </div>
                </div>

                {/* --- SEZIONE TABELLA E AZIONI --- */}
                <div className="mt-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold tracking-tight">Ultimi Esercizi nel Database</h2>
                        <Link 
                            href="/exercises/create" 
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                        >
                            <Plus size={18} />
                            Nuovo Esercizio
                        </Link>
                    </div>

                    <div className="rounded-xl border border-sidebar-border bg-sidebar shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Nome Esercizio</th>
                                        <th className="px-6 py-4 font-semibold text-right">Azioni</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border">
                                    {exercises && exercises.length > 0 ? (
                                        exercises.map((ex) => (
                                            <tr key={ex.id} className="group hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-foreground">
                                                    {ex.name}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                                        Dettagli
                                                        <ChevronRight size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground italic">
                                                Nessun esercizio presente nel database.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}