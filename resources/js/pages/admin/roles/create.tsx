import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

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
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Modifica Ruolo' : 'Crea Ruolo'}</h1>
            
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block font-bold">Nome Ruolo</label>
                    <input 
                        type="text" 
                        className="border p-2 w-full"
                        value={data.name} 
                        onChange={e => setData('name', e.target.value)} 
                    />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                </div>

                <div>
                    <label className="block font-bold mb-2">Permessi</label>
                    <div className="grid grid-cols-2 gap-2 border p-4 rounded h-64 overflow-y-auto">
                        {permissions.map((perm) => (
                            <label key={perm.id} className="flex items-center space-x-2">
                                <input 
                                    type="checkbox"
                                    value={perm.name}
                                    checked={data.permissions.includes(perm.name)}
                                    onChange={(e) => handleCheckboxChange(perm.name, e.target.checked)}
                                />
                                <span className="text-sm">{perm.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Salva
                </button>
            </form>
        </div>
    );
}