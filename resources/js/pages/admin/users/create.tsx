import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';
import { FormCard } from '@/components/custom/form-card';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { HeaderNew } from '@/components/custom/header-new';
import { Select } from 'antd';

interface PT { id: number; name: string; }
interface Role { name: string; }
interface Props { personalTrainers: PT[]; availableRoles: Role[]; clientRoleSlug: string; }
interface FormData { first_name: string; last_name: string; email: string; password: string; role: string; trainer_id: string; }

// Classe CSS comune per i tuoi input (Stile Zinc/Dark)
const inputBaseClass = "h-8 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm font-bold italic shadow-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50";

export default function Create({ personalTrainers, availableRoles, clientRoleSlug }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        first_name: '', 
        last_name: '', 
        email: '', 
        password: '', 
        role: clientRoleSlug, 
        trainer_id: ''
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
                        {/* NOME */}
                        <InputGroup label="Nome" error={errors.first_name}>
                            <input 
                                className={inputBaseClass}
                                value={data.first_name} 
                                onChange={(e) => setData('first_name', e.target.value)}
                                placeholder="Es. Mario"
                            />
                        </InputGroup>

                        {/* COGNOME */}
                        <InputGroup label="Cognome" error={errors.last_name}>
                            <input 
                                className={inputBaseClass}
                                value={data.last_name} 
                                onChange={(e) => setData('last_name', e.target.value)}
                                placeholder="Es. Rossi"
                            />
                        </InputGroup>

                        {/* EMAIL */}
                        <InputGroup label="Email" error={errors.email}>
                            <input 
                                type="email"
                                className={inputBaseClass}
                                value={data.email} 
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="mario.rossi@esempio.com"
                            />
                        </InputGroup>

                        {/* PASSWORD */}
                        <InputGroup label="Password" error={errors.password}>
                            <input 
                                type="password"
                                className={inputBaseClass}
                                value={data.password} 
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="MIN. 8 CARATTERI"
                            />
                        </InputGroup>

                        {/* RUOLO */}
                        <InputGroup label="Ruolo" error={errors.role}>
                            <Select 
                                value={data.role} 
                                onChange={(val) => {
                                    setData(prev => ({ 
                                        ...prev, 
                                        role: val, 
                                        trainer_id: val !== clientRoleSlug ? '' : prev.trainer_id 
                                    }));
                                }}
                                options={availableRoles?.map(r => ({
                                    label: r.name.toUpperCase(),
                                    value: r.name
                                }))}
                                className="w-full h-8 font-bold italic"
                                style={{ height: '32px' }}
                            />
                        </InputGroup>

                        {/* PERSONAL TRAINER (Condizionale) */}
                        {data.role === clientRoleSlug && (
                            <InputGroup label="Assegna a Personal Trainer" error={errors.trainer_id}>
                                <Select 
                                    value={data.trainer_id} 
                                    onChange={(val) => setData('trainer_id', val)}
                                    options={[
                                        { label: 'NON ASSEGNATO', value: '' },
                                        ...personalTrainers.map(pt => ({
                                            label: pt.name.toUpperCase(),
                                            value: pt.id.toString()
                                        }))
                                    ]}
                                    className="w-full h-8 font-bold italic"
                                    style={{ height: '32px' }}
                                />
                            </InputGroup>
                        )}
                    </FormCard>

                    <div className="flex justify-end">
                        <FormButton 
                            processing={processing} 
                            label="Salva Utente" 
                            icon={Save} 
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}