import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { HeaderNew } from '@/components/custom/header-new';
import { InputGroup } from '@/components/custom/input-group'; 
import { FormButton } from '@/components/custom/form-button';
import { Select } from 'antd'; 
import { User, Mail, ShieldCheck, UserCircle, ArrowLeft, Save } from 'lucide-react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    trainer_id: number | null;
}

interface PT {
    id: number;
    name: string;
}

interface Props {
    user: UserData;
    personalTrainers: PT[];
}

export default function EditUser({ user, personalTrainers }: Props) {
    
    // Inizializzazione form
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'client',
        // Se trainer_id è null, usiamo null internamente per facilitare il backend
        trainer_id: user.trainer_id ?? null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Usiamo patch verso l'URL corretto. 
        // Se non dovesse ancora funzionare, prova a usare: 
        // post(`/admin/accounts/${user.id}`, { _method: 'patch', ...data })
        patch(`/admin/accounts/${user.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Opzionale: logica di successo o notifiche
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Account', href: '/admin/accounts' }, { title: 'Modifica', href: '#' }]}>
            <Head title={`Modifica ${user.name}`} />

            <div className="w-full p-6 md:p-10 italic uppercase">
                <HeaderNew 
                    title="Modifica Profilo"
                    subtitle={`Stai modificando l'account di: ${user.name}`}
                    icon={User}
                    buttonText="Annulla"
                    buttonHref="/admin/accounts"
                    buttonIcon={<ArrowLeft size={16} />}
                />

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-[2.5rem] border-2 border-sidebar-border bg-sidebar shadow-sm">
                        
                        {/* NOME */}
                        <InputGroup
                            label="Nome Completo"
                            icon={User}
                            value={data.name}
                            onChange={(val: string) => setData('name', val)}
                            error={errors.name}
                            required
                        />

                        {/* EMAIL */}
                        <InputGroup
                            label="Email"
                            icon={Mail}
                            type="email"
                            value={data.email}
                            onChange={(val: string) => setData('email', val)}
                            error={errors.email}
                            required
                        />

                        {/* RUOLO */}
                        <InputGroup
                            label="Ruolo Sistema"
                            icon={ShieldCheck}
                            type="select"
                            value={data.role}
                            onChange={(val: string) => {
                                setData(prev => ({
                                    ...prev,
                                    role: val,
                                    // Reset trainer se il ruolo non è client
                                    trainer_id: val !== 'client' ? null : prev.trainer_id
                                }));
                            }}
                            error={errors.role}
                        >
                            <Select.Option value="admin">ADMIN</Select.Option>
                            <Select.Option value="pt">PERSONAL TRAINER</Select.Option>
                            <Select.Option value="client">CLIENTE</Select.Option>
                        </InputGroup>

                        {/* SELEZIONE TRAINER (Solo per Clienti) */}
                        {data.role === 'client' && (
                            <InputGroup
                                label="Personal Trainer"
                                icon={UserCircle}
                                type="select"
                                value={data.trainer_id}
                                // Ant Design ritorna undefined o null se non selezionato
                                onChange={(val: any) => setData('trainer_id', val === 'none' ? null : val)}
                                error={errors.trainer_id}
                            >
                                <Select.Option value="none">NESSUN ASSEGNAMENTO</Select.Option>
                                {personalTrainers.map((pt) => (
                                    <Select.Option key={pt.id} value={pt.id}>
                                        {pt.name.toUpperCase()}
                                    </Select.Option>
                                ))}
                            </InputGroup>
                        )}
                    </div>

                    <FormButton 
                        processing={processing} 
                        label="Salva Modifiche" 
                        icon={Save}
                    />
                </form>
            </div>
        </AppLayout>
    );
}