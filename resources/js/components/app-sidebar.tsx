import { Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, 
    FolderGit2, 
    LayoutGrid, 
    Dumbbell, 
    Users, 
    ClipboardList 
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

// 1. Definiamo tutti i link della piattaforma con i relativi permessi
const allNavItems: SidebarItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        roles: ['admin', 'pt', 'client'],
    },
    {
        title: 'Gestione Esercizi',
        href: '/exercises',
        icon: Dumbbell,
        roles: ['admin', 'pt'],
    },
    {
        title: 'I Miei Clienti',
        href: '/clients',
        icon: Users,
        roles: ['pt'],
    },
    {
        title: 'La Mia Scheda',
        href: '/my-plan',
        icon: ClipboardList,
        roles: ['client'],
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    // 2. Recuperiamo l'utente dalle props di Inertia
    // Usiamo "as any" per bypassare temporaneamente i controlli rigidi di TS sull'oggetto auth
    const { auth } = usePage().props as any;
    const user = auth.user;

    // 3. Filtriamo i link in base al ruolo dell'utente loggato
    const filteredNavItems = allNavItems.filter((item) => 
        item.roles.includes(user?.role || 'client')
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
                {/* Passiamo l'array filtrato al componente NavMain */}
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}