import { useForm } from '@inertiajs/react';
import { FormEventHandler, useMemo } from 'react';
import { HeaderNew } from '@/components/custom/header-new';
import { ShieldCheck, ArrowLeft, CheckCircle2, CheckSquare, Square } from 'lucide-react';
import { InputGroup } from '@/components/custom/input-group';
import { FormCard } from '@/components/custom/form-card';
import { FormButton } from '@/components/custom/form-button';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

// ARCHITETTURA FIX: Importiamo la nostra logica centralizzata
import { groupPermissionsByCategory } from '@/lib/permission-utils';

export default function RoleForm({ role, permissions }: { role?: any, permissions: any[] }) {
    const isEdit = !!role;
    const initialPermissions = role?.permissions?.map((p: any) => p.name) || [];
    
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || '',
        permissions: initialPermissions,
    });

    // Si utilizza useMemo per calcolare i raggruppamenti dei permessi solo se i permessi cambiano, ottimizzando il rendering
    const groupedPermissions = useMemo(() => groupPermissionsByCategory(permissions), [permissions]);

    // Stato derivato per capire se si è già selezionato tutto
    const isAllSelected = data.permissions.length === permissions.length && permissions.length > 0;

    const handleCheckboxChange = (permName: string, isChecked: boolean) => {
        if (isChecked) {
            setData('permissions', [...data.permissions, permName]);
        } else {
            setData('permissions', data.permissions.filter((p: string) => p !== permName));
        }
    };

    // Funzione per gestire la selezione di massa
    const toggleSelectAll = () => {
        if (isAllSelected) {
            setData('permissions', []); // Svuota
        } else {
            setData('permissions', permissions.map(p => p.name)); // Riempe con tutti
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
                    <FormCard className="md:grid-cols-1 gap-12">
                        <InputGroup 
                            label="Nome del Ruolo" 
                            value={data.name} 
                            onChange={(val) => setData('name', val)} 
                            error={errors.name} 
                        />
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-sidebar-border/50 pb-4">
                                <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground ml-1 uppercase flex items-center gap-2 italic"> 
                                    Autorizzazioni ({data.permissions.length} di {permissions.length} selezionate) 
                                </label>
                                
                                <button 
                                    type="button" 
                                    onClick={toggleSelectAll}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors hover:opacity-80
                                        ${isAllSelected ? 'text-red-500' : 'text-primary'}"
                                >
                                    {isAllSelected ? (
                                        <><Square size={14} /> Deseleziona Tutti</>
                                    ) : (
                                        <><CheckSquare size={14} /> Seleziona Tutti</>
                                    )}
                                </button>
                            </div>

                            <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                                {Object.entries(groupedPermissions).map(([category, perms]) => (
                                    <div key={category} className="space-y-4">
                                        {/* Titolo Categoria */}
                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground bg-sidebar/50 p-3 rounded-xl border border-sidebar-border inline-block shadow-sm">
                                            {category.replace(/_/g, ' ')}
                                        </h4>
                                        
                                        {/* Griglia Permessi della Categoria */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {perms.map((perm: any) => {
                                                const isChecked = data.permissions.includes(perm.name);
                                                return (
                                                    <div 
                                                        key={perm.id} 
                                                        onClick={() => handleCheckboxChange(perm.name, !isChecked)} 
                                                        className={`
                                                            flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-200 border
                                                            ${isChecked ? 'bg-foreground border-foreground shadow-lg scale-[0.98]' : 'bg-background border-sidebar-border hover:border-primary/40 hover:bg-sidebar/50'}
                                                        `}
                                                    >
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className={`text-[11px] font-bold tracking-wide ${isChecked ? 'text-background' : 'text-foreground'}`}> 
                                                                {perm.formattedName}
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
                                    </div>
                                ))}
                            </div>

                            {errors.permissions && (
                                <p className="text-[10px] text-red-500 font-black tracking-widest mt-1 uppercase ml-1 italic"> 
                                    {errors.permissions}
                                </p>
                            )}
                        </div>
                    </FormCard>
                    
                    <div className="flex justify-end">
                        <FormButton processing={processing} label={isEdit ? "Aggiorna Ruolo" : "Crea Ruolo"} className="scale-110" />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}