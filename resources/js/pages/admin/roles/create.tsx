import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { HeaderNew} from '@/components/custom/header-new';
import { ShieldCheck, ArrowLeft, ListChecks, Type, CheckCircle2 } from 'lucide-react';
import { InputGroup } from '@/components/custom/input-group';
import { FormCard } from '@/components/custom/form-card';
import { FormButton } from '@/components/custom/form-button';
import AppLayout from '@/layouts/app-layout';

import { Head, router } from '@inertiajs/react';
export default function RoleForm({ role, permissions }: { role?: any, permissions: any[] }) {
    const isEdit = !!role;

    // Se stiamo modificando, estraiamo i nomi dei permessi già assegnati per idratare le checkbox
    const initialPermissions = role?.permissions?.map((p: any) => p.name) || [];

    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || '',
        permissions: initialPermissions,
    });

    const handleCheckboxChange = (permName: string, isChecked: boolean) => {
        if (isChecked) {
            setData('permissions', [...data.permissions, permName]);
        } else {
            setData('permissions', data.permissions.filter((p: string) => p !== permName));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/roles/${role.id}`);
        } else {
            post('/admin/roles');
        }
    };

    return (
         <AppLayout breadcrumbs={[{ title: 'Ruoli', href: '/admin/roles' }]}>
        <Head title="Gestione Ruoli" />

        <div className="w-full p-6 md:p-10">
           <HeaderNew 
                title={isEdit ? 'MODIFICA RUOLO' : 'NUOVO RUOLO'} 
                subtitle="Configura il nome e i permessi di accesso al sistema"
                icon={ShieldCheck}
                buttonText="TORNA INDIETRO"
                buttonHref="/admin/roles"
                buttonIcon={<ArrowLeft size={18} />}
            />
            
            <form onSubmit={submit} className="mt-12 space-y-8">
                {/* Utilizziamo FormCard per racchiudere i campi */}
                <FormCard className="md:grid-cols-1 gap-12">
                    
                    {/* Campo Nome Ruolo usando InputGroup */}
                    <InputGroup
                        label="Nome del Ruolo"
                        icon={Type}
                        placeholder="ES: AMMINISTRATORE, PERSONAL TRAINER..."
                        value={data.name}
                        onChange={(val) => setData('name', val)}
                        error={errors.name}
                    />

                    {/* Sezione Selezione Permessi */}
                    <div className="space-y-6">
                        <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1 uppercase flex items-center gap-2 italic">
                            <ListChecks size={12} className="text-muted-foreground/70" />
                            Selezione Autorizzazioni ({data.permissions.length} selezionate)
                        </label>

                        {/* Griglia interattiva dei permessi */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {permissions.map((perm) => {
                                const isChecked = data.permissions.includes(perm.name);
                                return (
                                    <div 
                                        key={perm.id}
                                        onClick={() => handleCheckboxChange(perm.name, !isChecked)}
                                        className={`
                                            flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-200 border
                                            ${isChecked 
                                                ? 'bg-foreground border-foreground shadow-lg scale-[0.98]' 
                                                : 'bg-background border-sidebar-border hover:border-primary/40 hover:bg-sidebar/50'
                                            }
                                        `}
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className={`text-[10px] font-black uppercase italic tracking-tighter ${isChecked ? 'text-background' : 'text-foreground'}`}>
                                                {perm.name.replace(/:|_/g, ' ')}
                                            </span>
                                        </div>
                                        
                                        <div className={`
                                            w-6 h-6 rounded-lg flex items-center justify-center transition-all
                                            ${isChecked ? 'bg-background text-foreground' : 'border border-sidebar-border text-transparent'}
                                        `}>
                                            <CheckCircle2 size={14} strokeWidth={3} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {errors.permissions && (
                            <p className="text-[10px] text-red-500 font-black tracking-widest mt-1 uppercase ml-1 italic">
                                {errors.permissions}
                            </p>
                        )}
                    </div>
                </FormCard>

                {/* Bottone di invio usando FormButton (Ant Design base) */}
                <div className="flex justify-end">
                    <FormButton 
                        processing={processing} 
                        label={isEdit ? "Aggiorna Ruolo" : "Crea Ruolo"}
                        className="scale-110" // Leggermente più grande per enfasi
                    />
                </div>
            </form>
        </div>
        </AppLayout>
    );
}