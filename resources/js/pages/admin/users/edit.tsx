import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { HeaderNew } from '@/components/custom/header-new';
import { InputGroup } from '@/components/custom/input-group';
import { FormButton } from '@/components/custom/form-button';
import { Select } from 'antd';
import { User, Mail, ShieldCheck, UserCircle, ArrowLeft, Save } from 'lucide-react';

interface UserData { id: number; name: string; email: string; roles: { name: string }[]; trainer_id: number | null; }
interface PT { id: number; name: string; }
interface Role { name: string; }
interface Props { user: UserData; personalTrainers: PT[]; availableRoles: Role[]; clientRoleSlug: string; }

export default function EditUser({ user, personalTrainers, availableRoles, clientRoleSlug }: Props) {
    
    // Estrazione sicura del ruolo da Spatie
    const currentRole = user.roles && user.roles.length > 0 ? user.roles[0].name : clientRoleSlug;

    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: currentRole,
        trainer_id: user.trainer_id ? user.trainer_id.toString() : ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/users/${user.id}`, { preserveScroll: true });
    };

    return (
         <AppLayout breadcrumbs={[{ title: 'Account', href: '/admin/users' }, { title: 'Modifica', href: '#' }]}>
            <Head title={`Modifica ${user.name}`} />
            <div className="w-full p-6 md:p-10">
                <HeaderNew 
                    title="Modifica Profilo" 
                    subtitle={`Stai modificando l'account di: ${user.name}`} 
                    icon={User} 
                    buttonText="Annulla" 
                    buttonHref="/admin/users"
                    buttonIcon={<ArrowLeft size={16} />} 
                />
                
                <form onSubmit={handleSubmit} className="w-full space-y-8 mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-[2.5rem] border-2 border-sidebar-border bg-sidebar shadow-sm">
                        <InputGroup label="Nome Completo" icon={User} value={data.name} onChange={(val: string) => setData('name', val)} error={errors.name} required />
                        <InputGroup label="Email" icon={Mail} type="email" value={data.email} onChange={(val: string) => setData('email', val)} error={errors.email} required />
                        
                        {/* Lista dinamica e svuotamento trainer_id se si cambia ruolo */}
                        <InputGroup label="Ruolo Sistema" icon={ShieldCheck} type="select" value={data.role} onChange={(val: string) => { setData(prev => ({ ...prev, role: val, trainer_id: val !== clientRoleSlug ? '' : prev.trainer_id })) }} error={errors.role}>
                            {availableRoles?.map((r) => (
                                <Select.Option key={r.name} value={r.name}>
                                    {r.name.toUpperCase()}
                                </Select.Option>
                            ))}
                        </InputGroup>

                        {data.role === clientRoleSlug && (
                            <InputGroup label="Personal Trainer" icon={UserCircle} type="select" value={data.trainer_id} onChange={(val: any) => setData('trainer_id', val)} error={errors.trainer_id}>
                                <Select.Option value="">NESSUN ASSEGNAMENTO</Select.Option>
                                {personalTrainers.map((pt) => (
                                    <Select.Option key={pt.id} value={pt.id.toString()}>
                                        {pt.name.toUpperCase()}
                                    </Select.Option>
                                ))}
                            </InputGroup>
                        )}
                    </div>
                    <FormButton processing={processing} label="Salva Modifiche" icon={Save} />
                </form>
            </div>
            </AppLayout>
    );
}