import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    muscleGroups: string[];
}

export default function Create({ muscleGroups }: Props) {
    // Inizializziamo il form con useForm di Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        muscle_group: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Invio dei dati al controller
        post('/admin/exercises', {
            onSuccess: () => reset(), 
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Esercizi', href: '/admin/exercises' }, { title: 'Nuovo', href: '/admin/exercises/create' }]}>
            <Head title="Aggiungi Nuovo Esercizio" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 italic uppercase">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Nuovo Esercizio</h1>
                </div>

                <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-sidebar-border bg-sidebar p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Nome Esercizio */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome dell'Esercizio</Label>
                            <Input
                                id="name"
                                placeholder="es. Panca Piana"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && <p className="text-xs text-red-500 normal-case italic">{errors.name}</p>}
                        </div>

                        {/* Gruppo Muscolare */}
                        <div className="space-y-2">
                            <Label htmlFor="muscle_group">Gruppo Muscolare</Label>
                            <select
                                id="muscle_group"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.muscle_group}
                                onChange={(e) => setData('muscle_group', e.target.value)}
                            >
                                <option value="" disabled className="text-black">Seleziona un gruppo...</option>
                                {muscleGroups.map((group) => (
                                    <option key={group} value={group} className="text-black">
                                        {group}
                                    </option>
                                ))}
                            </select>
                            {errors.muscle_group && <p className="text-xs text-red-500 normal-case italic">{errors.muscle_group}</p>}
                        </div>

                        {/* Descrizione (Textarea Standard) */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrizione (Opzionale)</Label>
                            <textarea
                                id="description"
                                rows={4}
                                placeholder="Inserisci una breve spiegazione..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                                    errors.description ? 'border-red-500' : ''
                                }`}
                            />
                            {errors.description && <p className="text-xs text-red-500 normal-case italic">{errors.description}</p>}
                        </div>

                        {/* Bottoni Azione */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="normal-case"
                            >
                                Annulla
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {processing ? 'Salvataggio...' : 'Crea Esercizio'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}