import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { ClipboardList, PlusCircle, ArrowRight, Calendar } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

// Tipi TypeScript
interface Plan { id: number; name: string; num_weeks: number; created_at: string; }
interface Client { id: number; name: string; }
interface Props { client: Client; clientPlans: Plan[]; }

export default function ClientPlansIndex({ client, clientPlans }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'I Miei Atleti', href: '/pt/dashboard' }, { title: `Schede di ${client.name}`, href: '#' }]}>
            <Head title={`Schede - ${client.name}`} />

            <div className="p-6 flex flex-col gap-6 max-w-6xl mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold uppercase italic">Schede: <span className="text-orange-500">{client.name}</span></h1>
                    <Link 
                        href={`/pt/plans/create/${client.id}`} 
                        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 font-bold text-sm"
                    >
                        <PlusCircle size={18} /> Nuova Scheda
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {clientPlans.map((plan) => (
                        <div key={plan.id} className="bg-sidebar border border-sidebar-border rounded-xl p-5 shadow-sm hover:border-orange-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg uppercase tracking-wider">{plan.name}</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                        <Calendar size={14}/> {plan.num_weeks} Settimane
                                    </p>
                                </div>
                                <div className="p-2 bg-background rounded-lg text-orange-500">
                                    <ClipboardList size={20} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-sidebar-border">
                                {/* IL LINK AL DETTAGLIO DELLA SCHEDA */}
                                <Link 
                                    href={`/pt/plans/${plan.id}`}
                                    className="flex items-center justify-between text-sm font-bold text-foreground hover:text-orange-500 transition-colors"
                                >
                                    Visualizza Dettagli Completi <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}

                    {clientPlans.length === 0 && (
                        <p className="text-muted-foreground italic col-span-full text-center py-10 bg-sidebar rounded-xl border border-dashed">
                            Nessuna scheda presente. Clicca su "Nuova Scheda" per iniziare.
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}