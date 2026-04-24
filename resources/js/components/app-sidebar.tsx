import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Dumbbell, Users, ClipboardList, BookOpenCheck, History, Layers, ShieldCheck } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

interface SidebarItem extends NavItem {
    permissions: string[];
}

const allNavItems: SidebarItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        permissions: [], 
    },
    {
        title: 'Gestione Esercizi',
        href: '/admin/exercises',
        icon: Dumbbell,
        permissions: ['exercises:read'],
    },
    {
        title: 'Gruppi Muscolari',
        href: '/admin/muscle-groups',
        icon: Layers,
        permissions: ['muscle-groups:read'], 
    },
    {
        title: 'Gestione Utenti',
        href: '/admin/users',
        icon: Users,
        // Un admin legge tutti (:any), un PT legge i suoi (:own). Si mostra il link in entrambi i casi.
        permissions: ['users:read:any', 'users:read:own'] 
    },
    {
        title: 'Gestione Ruoli',
        href: '/admin/roles',
        icon: ShieldCheck,
        permissions: ['roles:read']
    },
    {
        title: 'Catalogo Esercizi',
        href: '/pt/exercises/catalog',
        icon: BookOpenCheck,
        permissions: ['exercises:read']
    },
    {
        title: 'La Mia Scheda',
        href: '/client/my-plan',
        icon: ClipboardList,
        // Un admin legge tutte le schede (:any), un cliente legge la sua (:own).
        permissions: ['plans:read:any', 'plans:read:own']
    },
    {
        title: 'Storico Schede',
        href: '/client/history',
        icon: History,
        permissions: ['plans:read:any', 'plans:read:own']
    }
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    
    // Array piatto di permessi fornito da HandleInertiaRequests.php
    const userPermissions: string[] = auth.permissions || [];

    const filteredNavItems = allNavItems.filter((item) => {
        // Se l'elemento non richiede permessi (es. Dashboard), mostralo sempre
        if (item.permissions.length === 0) return true;
        
        // Mostralo se l'utente possiede ALMENO UNO dei permessi richiesti per quel link
        return item.permissions.some(permission => userPermissions.includes(permission));
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