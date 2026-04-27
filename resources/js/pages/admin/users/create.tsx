import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { FormCard } from '@/components/custom/form-card';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { HeaderNew } from '@/components/custom/header-new';
import { Select } from 'antd';

interface PT { id: number; name: string; }
interface Role { name: string; }
interface Props { personalTrainers: PT[]; availableRoles: Role[]; clientRoleSlug: string; }
interface FormData { first_name: string; last_name: string; email: string; password: string; role: string; trainer_id: string; }

export default function Create({ personalTrainers, availableRoles, clientRoleSlug }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        first_name: '', last_name: '', email: '', password: '', role: clientRoleSlug, trainer_id: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Account', href: '/admin/users' }, { title: 'Nuovo Utente', href: '#' }]}>
            <Head title="Crea Nuovo Account" />
            <div className="w-full p-6 md:p-10">
                <HeaderNew 
                    title="Crea nuovo account" 
                    subtitle="Registra un nuovo profilo nel sistema gestionale." 
                    icon={UserPlus} 
                    buttonText="Annulla" 
                    buttonHref="/admin/users"
                    buttonIcon={<ArrowLeft size={16} />} 
                />
                
                <form onSubmit={handleSubmit} className="w-full space-y-8 mt-10">
                    <FormCard>
                        {/* Il componente InputGroup gestisce automaticamente l'estrazione del value per i campi testo */}
                        <InputGroup label="Nome" value={data.first_name} onChange={(val: string) => setData('first_name', val)} error={errors.first_name} />
                        <InputGroup label="Cognome" value={data.last_name} onChange={(val: string) => setData('last_name', val)} error={errors.last_name} />
                        <InputGroup label="Email" type="email" value={data.email} onChange={(val: string) => setData('email', val)} error={errors.email} />
                        <InputGroup label="Password" type="password" value={data.password} onChange={(val: string) => setData('password', val)} error={errors.password} placeholder="MIN. 8 CARATTERI" />

                        {/* Mappatura dinamica dei ruoli dal DB */}
                        <InputGroup label="Ruolo" type="select" value={data.role} onChange={(val: string) => setData('role', val)} error={errors.role}>
                            {availableRoles?.map((r) => (
                                <Select.Option key={r.name} value={r.name}>
                                    {r.name.toUpperCase()}
                                </Select.Option>
                            ))}
                        </InputGroup>

                        {/* Uso di trainer_id e controllo dinamico sul clientRoleSlug */}
                        {data.role === clientRoleSlug && (
                            <InputGroup label="Assegna a Personal Trainer" type="select" value={data.trainer_id} onChange={(val: string) => setData('trainer_id', val)} error={errors.trainer_id} className="transition-all duration-300">
                                <Select.Option value="">NON ASSEGNATO</Select.Option>
                                {personalTrainers.map(pt => (
                                    <Select.Option key={pt.id} value={pt.id.toString()}>
                                        {pt.name.toUpperCase()}
                                    </Select.Option>
                                ))}
                            </InputGroup>
                        )}
                    </FormCard>
                    <FormButton processing={processing} label="Salva Utente" />
                </form>
            </div>
            </AppLayout>
    );
}