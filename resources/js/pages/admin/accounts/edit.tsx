import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { HeaderNew } from '@/components/custom/header-new';
import { InputGroup } from '@/components/custom/input-group'; 
import { FormButton } from '@/components/custom/form-button';
import { Select } from 'antd'; 
import { User, Mail, ShieldCheck, UserCircle, ArrowLeft } from 'lucide-react';

// 1. DEFINIAMO LE INTERFACCE (Risolve gli errori di tipo)
interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    trainer_id: number | string | null;
}

interface PT {
    id: number;
    name: string;
}

interface Props {
    user: UserData;
    personalTrainers: PT[];
}

// 2. AGGIUNGIAMO I TIPI ALLA FUNZIONE (Riga 18 circa)
export default function EditUser({ user, personalTrainers }: Props) {
    
    // Configurazione del form con useForm
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'client',
        trainer_id: user.trainer_id ? user.trainer_id.toString() : 'none',
    });

    // 3. TIPIZZIAMO L'EVENTO (Riga 85 circa)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/accounts/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Account', href: '/admin/accounts' }, { title: 'Modifica', href: '#' }]}>
            <Head title={`Modifica ${user.name}`} />

            <div className="w-full p-6 md:p-10">
                <HeaderNew 
                    title="Modifica Profilo"
                    subtitle={`Stai modificando l'account di: ${user.name}`}
                    icon={User}
                    buttonText="Indietro"
                    buttonHref="/admin/accounts"
                    buttonIcon={<ArrowLeft size={16} />}
                />

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-[2.5rem] border-2 border-sidebar-border bg-sidebar shadow-sm">
                        
                        <InputGroup
                            label="Nome Completo"
                            icon={User}
                            value={data.name}
                            onChange={(val: string) => setData('name', val)}
                            error={errors.name}
                        />

                        <InputGroup
                            label="Email"
                            icon={Mail}
                            type="email"
                            value={data.email}
                            onChange={(val: string) => setData('email', val)}
                            error={errors.email}
                        />

                        <InputGroup
                            label="Ruolo Sistema"
                            icon={ShieldCheck}
                            type="select"
                            value={data.role}
                            onChange={(val: string) => setData('role', val)}
                            error={errors.role}
                        >
                            <Select.Option value="admin">ADMIN</Select.Option>
                            <Select.Option value="pt">PERSONAL TRAINER</Select.Option>
                            <Select.Option value="client">CLIENTE</Select.Option>
                        </InputGroup>

                        {data.role === 'client' && (
                            <InputGroup
                                label="Personal Trainer"
                                icon={UserCircle}
                                type="select"
                                value={data.trainer_id}
                                onChange={(val: string) => setData('trainer_id', val)}
                            >
                                <Select.Option value="none">NESSUN ASSEGNAMENTO</Select.Option>
                                {personalTrainers.map((pt) => (
                                    <Select.Option key={pt.id} value={pt.id.toString()}>
                                        {pt.name.toUpperCase()}
                                    </Select.Option>
                                ))}
                            </InputGroup>
                        )}
                    </div>

                    <FormButton processing={processing} label="Aggiorna Utente" />
                </form>
            </div>
        </AppLayout>
    );
}