import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, Dumbbell, Users, ClipboardList, BookOpenCheck, 
    History, Layers, ShieldCheck, UserPlus, Crown 
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

interface SidebarItem extends NavItem {
    permissions: string[];
    excludedPermissions?: string[];
}

const allNavItems: SidebarItem[] = [
    // --- VOCI UNIVERSALI ---
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        permissions: [], // Visibile a tutti
    },
    
    // --- VOCI GESTIONALI (Admin) ---
    {
        title: 'Gestione Esercizi',
        href: '/admin/exercises',
        icon: Dumbbell,
        permissions: [
            'exercises:create',
            'exercises:update'
        ],
    },
    {
        title: 'Gruppi Muscolari',
        href: '/admin/muscle-groups',
        icon: Layers,
        permissions: [
            'muscle-groups:create', 
            'muscle-groups:update'
        ], 
    },
    {
        title: 'Gestione Utenti',
        href: '/admin/users',
        icon: Users,
        permissions: ['users:create', 'users:delete'],
    },
    {
        title: 'Gestione Ruoli',
        href: '/admin/roles',
        icon: ShieldCheck,
        permissions: ['roles:read'],
    },

    // --- VOCI OPERATIVE (Personal Trainer) ---
    {
        title: 'I Miei Atleti',
        href: '/pt/clients/manage-clients',
        icon: UserPlus,
        permissions: ['users:take-free-client'], 
        excludedPermissions: ['roles:create'], 
    },
    {
        title: 'Catalogo Esercizi',
        href: '/pt/exercises/catalog',
        icon: BookOpenCheck,
        permissions: ['plans:create'],
        excludedPermissions: ['roles:create'],
    },

    // --- VOCI FRUIZIONE (Cliente) ---
    {
        title: 'La Mia Scheda',
        href: '/client/my-plan',
        icon: ClipboardList,
        permissions: ['plans:read:own'],
        excludedPermissions: [
            'roles:create', 
            'plans:create'
        ],
    },
    {
        title: 'Storico Schede',
        href: '/client/history',
        icon: History,
        permissions: ['plans:read:own'],
        excludedPermissions: [
            'roles:create', 
            'plans:create'
        ],
    },
    // --- NUOVA VOCE: ABBONAMENTO PRO ---
    {
        title: 'Abbonamento PRO',
        href: '/client/pricing',
        icon: Crown,
        permissions: ['plans:read:own'], // Visibile a chi ha permessi da cliente
        excludedPermissions: [
            'roles:create', // Nascondi ad Admin
            'plans:create'  // Nascondi a PT
        ],
    }
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    
    // Si prendono i permessi dall'utente loggato
    const userPermissions = auth.permissions || [];

    // Recuperiamo lo stato premium (servirà quando il tuo socio lo aggiungerà al DB)
    const isPremium = auth.user?.is_premium;

    const hasPermission = (requiredPerm: string) => {
        return userPermissions.some((p: any) => p === requiredPerm || p?.name === requiredPerm);
    };

    const filteredNavItems = allNavItems.filter((item) => {
        
        // 1. Filtro per utenti già Premium: 
        // Se l'utente è già PRO, nascondiamo la voce "Abbonamento PRO" per non essere ridondanti
        if (item.title === 'Abbonamento PRO' && isPremium) {
            return false;
        }

        // 2. Filtro negativo (Esclusioni)
        if (item.excludedPermissions && item.excludedPermissions.length > 0) {
            const isExcluded = item.excludedPermissions.some(permission => hasPermission(permission));
            if (isExcluded) return false; 
        }

        // 3. Filtro positivo (Inclusioni)
        if (item.permissions.length === 0) return true;
        
        return item.permissions.some(permission => hasPermission(permission));
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}