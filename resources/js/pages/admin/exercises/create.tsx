import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, ChevronDown, Dumbbell } from 'lucide-react';
import { FormCard } from '@/components/custom/form-card';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { Select } from 'antd';

interface Props {
    muscleGroups: string[];
}

export default function Create({ muscleGroups }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        muscle_group: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/exercises', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Esercizi', href: '/admin/exercises' }, { title: 'Nuovo', href: '#' }]}>
            <Head title="Aggiungi Nuovo Esercizio" />

            <div className="w-full p-6 md:p-10 italic uppercase">
                
                {/* HEADER UNIFORMATO */}
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
                                <span className="font-black tracking-[0.2em] text-[10px]">
                                    Annulla
                                </span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/*Form creato con i componenti custom*/}

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                    <FormCard>
                        {/* NOME ESERCIZIO */}
                        <InputGroup 
                            label="Nome Esercizio" 
                            value={data.name} 
                            onChange={val => setData('name', val)} 
                            error={errors.name} 
                            placeholder="ES. PANCA PIANA"
                        />

                        {/* GRUPPO MUSCOLARE */}
                        <InputGroup 
                            label="Gruppo Muscolare" 
                            type="select" 
                            value={data.muscle_group} 
                            onChange={val => setData('muscle_group', val)}
                            error={errors.muscle_group}
                            placeholder="SELEZIONA GRUPPO..."
                        >
                            {muscleGroups.map((group) => (
                                <Select.Option key={group} value={group}>
                                    {group.toUpperCase()}
                                </Select.Option>
                            ))}
                        </InputGroup>

                        {/* DESCRIZIONE (Occupa 2 colonne) */}
                        <InputGroup 
                            label="Descrizione (Opzionale)" 
                            type="textarea" 
                            className="md:col-span-2"
                            value={data.description} 
                            onChange={val => setData('description', val)} 
                            error={errors.description} 
                            placeholder="INSERISCI UNA BREVE SPIEGAZIONE TECNICA..."
                        />
                    </FormCard>

                    {/* BOTTONE SALVA */}
                    <FormButton 
                        processing={processing} 
                        label="Crea Esercizio" 
                    />
                </form>

            </div>
        </AppLayout>
    );
}