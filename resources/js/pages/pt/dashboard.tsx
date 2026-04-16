import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { UserPlus, FileText, PlusCircle } from 'lucide-react';

export default function MyClients({ clients, stats }: any) {

    return (
        <AppLayout breadcrumbs={[{ title: 'I Miei Clienti', href: '/pt/dashboard' }]}>
            <Head title="I Miei Clienti" />

            <div className="p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">I Miei Atleti</h1>
                    <Link 
                        href="/pt/clients/assign" 
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                    >
                        <UserPlus size={18} /> Associa Cliente
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {clients.map((client: any) => (
                        <div key={client.id} className="bg-sidebar border border-sidebar-border rounded-xl p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{client.name}</h3>
                                    <p className="text-sm text-muted-foreground">{client.email}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mt-4">
                                {/* Link Visualizza Schede */}
                                <Link 
                                    href={`/pt/clients/${client.id}/plans`}
                                    className="flex items-center gap-2 text-sm text-blue-500 hover:underline"
                                >
                                    <FileText size={16} /> Visualizza Schede Attuali
                                </Link>
                                
                                {/* Link Inserisci Nuova Scheda - URL CORRETTO PER IL CONTROLLER */}
                                <Link 
                                    href={`/pt/plans/create/${client.id}`}
                                    className="flex items-center gap-2 text-sm text-orange-500 hover:underline"
                                >
                                    <PlusCircle size={16} /> Inserisci Nuova Scheda
                                </Link>
                            </div>
                        </div>
                    ))}

                    {clients.length === 0 && (
                        <p className="text-muted-foreground italic col-span-full text-center py-10">
                            Non hai ancora clienti associati. Clicca su "Associa Cliente" per iniziare.
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}