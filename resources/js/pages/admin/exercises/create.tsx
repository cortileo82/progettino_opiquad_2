import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import { FormCard } from '@/components/custom/form-card';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { Select } from 'antd';

interface MuscleGroup {
    id: number;
    name: string;
}

interface Props {
    // Ricevuti dal controller Laravel (es: 'muscleGroups' => MuscleGroup::all())
    muscleGroups: MuscleGroup[];
}

export default function CreateExercise({ muscleGroups = [] }: Props) {
    // Inizializziamo useForm con i campi necessari per il DB
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        muscle_group_id: '', // Usiamo l'ID per la relazione Foreign Key
        description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Invia i dati alla rotta store del controller
        post('/admin/exercises', {
            onSuccess: () => reset(),
            preserveScroll: true
        });
    };

    return (
        <AppLayout 
            breadcrumbs={[
                { title: 'Esercizi', href: '/admin/exercises' }, 
                { title: 'Nuovo', href: '#' }
            ]}
        >
            <Head title="Aggiungi Nuovo Esercizio" />
            
            <div className="w-full p-6 md:p-10 italic uppercase">
                {/* Header della pagina */}
                <div className="mb-8 border-b border-sidebar-border pb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tighter text-foreground flex items-center gap-3">
                                <Dumbbell className="text-primary shrink-0" size={28} /> 
                                Nuovo Esercizio
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium mt-1 normal-case not-italic">
                                Inserisci un nuovo esercizio nel database della piattaforma.
                            </p>
                        </div>
                        <Link href="/admin/exercises">
                            <Button variant="outline" className="border-sidebar-border rounded-lg px-6 py-2.5 h-auto flex items-center gap-3 transition-all active:scale-95">
                                <ArrowLeft size={14} /> 
                                <span className="font-black tracking-[0.2em] text-[10px]"> Annulla </span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Form di creazione */}
                <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                    <FormCard>
                        {/* 1. NOME ESERCIZIO */}
                        <InputGroup 
                            label="Nome Esercizio" 
                            value={data.name} 
                            onChange={(val: string) => setData('name', val)} 
                            error={errors.name} 
                        />

                        {/* 2. GRUPPO MUSCOLARE (Select dinamica dal DB) */}
                        <InputGroup 
                            label="Gruppo Muscolare" 
                            type="select" 
                            value={data.muscle_group_id} 
                            onChange={(val: any) => setData('muscle_group_id', val)}
                            error={errors.muscle_group_id}
                        >
                            {muscleGroups && muscleGroups.map((group) => (
                                <Select.Option key={group.id} value={group.id}>
                                    {group.name.toUpperCase()}
                                </Select.Option>
                            ))}
                        </InputGroup>

                        {/* 3. DESCRIZIONE */}
                        <InputGroup 
                            label="Descrizione (Opzionale)" 
                            type="textarea" 
                            className="md:col-span-2"
                            value={data.description} 
                            onChange={(val: string) => setData('description', val)} 
                            error={errors.description} 
                        />
                    </FormCard>

                    {/* Bottone di invio */}
                    <div className="flex justify-end">
                        <FormButton 
                            processing={processing} 
                            label="Crea Esercizio" 
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}