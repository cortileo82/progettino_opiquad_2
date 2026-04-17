import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Users, 
    Dumbbell, 
    UserCheck, 
    History,
    ArrowUpRight,
    ClipboardList 
} from 'lucide-react';

interface Stats {
    total_clients: number;
    total_pts: number;
    total_exercises: number;
    total_workouts: number; 
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

            <div className="flex flex-col gap-8 p-6 max-w-[1600px] mx-auto w-full">
                
                {/* Intestazione */}
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground uppercase italic">
                        Benvenuto, {auth.user.name}
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Panoramica attuale del sistema.
                    </p>
                </div>

                {/* --- SEZIONE CARDS STATISTICHE (Ora a 4 colonne) --- */}
                <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
                    
                    {/* Card Clienti */}
                    <div className="flex items-center gap-4 rounded-2xl border border-sidebar-border bg-sidebar p-6 shadow-sm hover:border-blue-500/30 transition-colors">
                        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Clienti</p>
                            <p className="text-2xl font-bold">{stats?.total_clients ?? 0}</p>
                        </div>
                    </div>

                    {/* Card Personal Trainer */}
                    <div className="flex items-center gap-4 rounded-2xl border border-sidebar-border bg-sidebar p-6 shadow-sm hover:border-green-500/30 transition-colors">
                        <div className="rounded-xl bg-green-500/10 p-3 text-green-500">
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Trainer</p>
                            <p className="text-2xl font-bold">{stats?.total_pts ?? 0}</p>
                        </div>
                    </div>

                    {/* Card Esercizi */}
                    <div className="flex items-center gap-4 rounded-2xl border border-sidebar-border bg-sidebar p-6 shadow-sm hover:border-orange-500/30 transition-colors">
                        <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
                            <Dumbbell size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Esercizi</p>
                            <p className="text-2xl font-bold">{stats?.total_exercises ?? 0}</p>
                        </div>
                    </div>

                    {/* NUOVA CARD: Schede Allenamento */}
                    <div className="flex items-center gap-4 rounded-2xl border border-sidebar-border bg-sidebar p-6 shadow-sm hover:border-purple-500/30 transition-colors">
                        <div className="rounded-xl bg-purple-500/10 p-3 text-purple-500">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Schede</p>
                            <p className="text-2xl font-bold">{stats?.total_workouts ?? 0}</p>
                        </div>
                    </div>

                </div>

                {/* --- SEZIONE ULTIMI ESERCIZI --- */}
                <div className="flex flex-col gap-4 w-full mt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black tracking-tight uppercase italic flex items-center gap-2">
                            <History size={18} className="text-orange-500" />
                            Ultimi Esercizi Inseriti
                        </h2>
                        <Link 
                            href="/admin/exercises" 
                            className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-1"
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
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                                            <span className="font-bold uppercase text-sm tracking-widest text-foreground">
                                                {ex.name}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter bg-background px-2 py-1 rounded border border-sidebar-border">
                                            {ex.muscle_group || 'N/A'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-muted-foreground italic text-sm font-medium">
                                    Nessun esercizio presente nel database.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}