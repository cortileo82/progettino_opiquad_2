import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormCard } from '@/components/custom/form-card';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { HeaderNew } from '@/components/custom/header-new';
import { Select } from 'antd';

interface PT {
    id: number;
    name: string;
}

interface Props {
    personalTrainers: PT[];
}

export default function Create({ personalTrainers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'client',
        pt_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/accounts');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gestione Account', href: '/admin/accounts' }, { title: 'Nuovo Utente', href: '#' }]}>
            <Head title="Crea Nuovo Account" />

            <div className="w-full p-6 md:p-10 italic uppercase">
                
                 {/* Header con componente */}
                <HeaderNew 
                    title="Crea nuovo account"
                    subtitle="Registra un nuovo profilo nel sistema gestionale."
                    icon={UserPlus}
                    buttonText="Annulla"
                    buttonHref="/admin/accounts"
                    buttonIcon={<ArrowLeft size={16} />}
                />
                
                {/* Uso il componente che ho creato (form-card,input-group e form-button)*/}
                <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
                    <FormCard>
                        <InputGroup 
                            label="Nome" 
                            value={data.first_name} 
                            onChange={val => setData('first_name', val)} 
                            error={errors.first_name} 
                        />
                        
                        <InputGroup 
                            label="Cognome" 
                            value={data.last_name} 
                            onChange={val => setData('last_name', val)} 
                            error={errors.last_name} 
                        />
                        
                        <InputGroup 
                            label="Email" 
                            type="email" 
                            value={data.email} 
                            onChange={val => setData('email', val)} 
                            error={errors.email} 
                        />
                        
                        <InputGroup 
                            label="Password" 
                            type="password" 
                            value={data.password} 
                            onChange={val => setData('password', val)} 
                            error={errors.password} 
                            placeholder="MIN. 8 CARATTERI" 
                        />

                        <InputGroup 
                            label="Ruolo" 
                            type="select" 
                            value={data.role} 
                            onChange={val => setData('role', val)}
                        >
                            <Select.Option value="client">CLIENTE</Select.Option>
                            <Select.Option value="pt">PERSONAL TRAINER</Select.Option>
                            <Select.Option value="admin">ADMIN</Select.Option>
                        </InputGroup>

                        {data.role === 'client' && (
                            <InputGroup 
                                label="Assegna a Personal Trainer" 
                                type="select" 
                                value={data.pt_id} 
                                onChange={val => setData('pt_id', val)}
                                className="transition-all duration-300"
                            >
                                <Select.Option value="">NON ASSEGNATO</Select.Option>
                                {personalTrainers.map(pt => (
                                    <Select.Option key={pt.id} value={pt.id.toString()}>
                                        {pt.name.toUpperCase()}
                                    </Select.Option>
                                ))}
                            </InputGroup>
                        )}
                    </FormCard>

                    {/* Bottone di invio */}
                    <FormButton 
                        processing={processing} 
                        label="Salva Utente" 
                    />
                </form>
            </div>
        </AppLayout>
    );
}