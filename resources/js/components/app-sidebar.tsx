import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Dumbbell, 
    Users, 
    ClipboardList,
    BookOpenCheck,
    History,
    BicepsFlexed,
    Plus,
    UserPlus 
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

// Estendiamo il tipo NavItem per includere i ruoli
interface SidebarItem extends NavItem {
    roles: string[];
}

// 1. Definiamo i link aggiornati con i prefissi corretti
const allNavItems: SidebarItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles: ['admin', 'pt', 'client'],
    },
    {
        title: 'Gestione Gruppi Muscolari',
        href: '/admin/muscle-groups',
        icon: BicepsFlexed, 
        roles: ['admin'],
    },
    {
        title: 'Gestione Esercizi',
        href: '/admin/exercises', // AGGIUNTO /admin
        icon: Dumbbell,
        roles: ['admin'], // Di solito la gestione totale è solo admin
    },
    {
        title: 'Gruppi Muscolari',
        href: '/admin/muscle-groups',
        icon: Dumbbell,
        roles: ['admin'],
    },
    /*{
        title: 'I Miei Clienti',
        href: '/pt/clients', 
        icon: Users,
        roles: ['pt'],
    },*/
    {
        title: 'La Mia Scheda',
        href: '/client/my-plan', 
        icon: ClipboardList,
        roles: ['client'],
    },
    {
        title: 'Gestione Utenti',
        href: '/admin/accounts', 
        icon: Users,
        roles: ['admin'],
    },
    {
        title: 'Catalogo Esercizi',
        href: '/pt/exercises/catalog',
        icon: BookOpenCheck, 
        roles: ['pt'],
    },
    {
        title: 'Storico Schede',
        href: '/client/history',
        icon: History, 
        roles: ['client'],
    },
  
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    // Filtriamo gli elementi in base al ruolo dell'utente loggato
    const filteredNavItems = allNavItems.filter((item) => 
        item.roles.includes(user?.role || '')
    );

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