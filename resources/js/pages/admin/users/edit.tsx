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

// Stile coerente per gli input nativi senza Shadcn
const inputClasses = "h-8 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm font-bold italic shadow-sm transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50";

export default function EditUser({ user, personalTrainers, availableRoles, clientRoleSlug }: Props) {
    
    // Estrazione sicura del ruolo
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
                        
                        {/* INPUT NATIVO: NOME */}
                        <InputGroup label="Nome Completo" icon={User} error={errors.name}>
                            <input 
                                className={inputClasses}
                                value={data.name} 
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Inserisci nome"
                            />
                        </InputGroup>

                        {/* INPUT NATIVO: EMAIL */}
                        <InputGroup label="Email" icon={Mail} error={errors.email}>
                            <input 
                                type="email"
                                className={inputClasses}
                                value={data.email} 
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@esempio.com"
                            />
                        </InputGroup>
                        
                        {/* SELECT ANTD: RUOLO */}
                        <InputGroup label="Ruolo Sistema" icon={ShieldCheck} error={errors.role}>
                            <Select 
                                className="w-full h-8 font-bold italic"
                                style={{ height: '32px' }}
                                value={data.role} 
                                onChange={(val: string) => { 
                                    setData(prev => ({ 
                                        ...prev, 
                                        role: val, 
                                        trainer_id: val !== clientRoleSlug ? '' : prev.trainer_id 
                                    })) 
                                }}
                                options={availableRoles?.map((r) => ({
                                    label: r.name.toUpperCase(),
                                    value: r.name
                                }))}
                            />
                        </InputGroup>

                        {/* SELECT ANTD: PERSONAL TRAINER (CONDIZIONALE) */}
                        {data.role === clientRoleSlug && (
                            <InputGroup label="Personal Trainer" icon={UserCircle} error={errors.trainer_id}>
                                <Select 
                                    className="w-full h-8 font-bold italic"
                                    style={{ height: '32px' }}
                                    value={data.trainer_id} 
                                    onChange={(val: string) => setData('trainer_id', val)}
                                    options={[
                                        { label: 'NESSUN ASSEGNAMENTO', value: '' },
                                        ...personalTrainers.map((pt) => ({
                                            label: pt.name.toUpperCase(),
                                            value: pt.id.toString()
                                        }))
                                    ]}
                                />
                            </InputGroup>
                        )}
                    </div>
                    
                    <div className="flex justify-end">
                        <FormButton 
                            processing={processing} 
                            label="Salva Modifiche" 
                            icon={Save} 
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}