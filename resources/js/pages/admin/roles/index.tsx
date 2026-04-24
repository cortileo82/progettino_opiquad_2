import { Link, usePage } from '@inertiajs/react';

export default function RoleIndex({ roles }: { roles: any[] }) {
    const protectedRoles = ['admin', 'pt', 'client'];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestione Ruoli</h1>
            <Link href="/admin/roles/create" className="bg-blue-500 text-white px-4 py-2 rounded">
                Crea Nuovo Ruolo
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {roles.map((role) => (
                    <div key={role.id} className="border p-4 rounded shadow">
                        <h2 className="text-xl font-bold uppercase">{role.name}</h2>
                        
                        {/* Sezione Espandibile dei Permessi */}
                        <details className="mt-2 text-sm text-gray-600">
                            <summary className="cursor-pointer font-semibold text-blue-600">
                                Vedi Permessi ({role.permissions.length})
                            </summary>
                            <ul className="mt-2 list-disc pl-5">
                                {role.permissions.map((perm: any) => (
                                    <li key={perm.id}>{perm.name}</li>
                                ))}
                            </ul>
                        </details>

                        {/* Bottoni Nascosti per i ruoli di sistema */}
                        {!protectedRoles.includes(role.name) && (
                            <div className="mt-4 flex gap-2">
                                <Link href={`/admin/roles/${role.id}/edit`} className="text-green-600">Modifica</Link>
                                <Link href={`/admin/roles/${role.id}`} method="delete" as="button" className="text-red-600">Elimina</Link>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}