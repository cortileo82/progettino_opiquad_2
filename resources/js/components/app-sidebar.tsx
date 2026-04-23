import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Dumbbell, 
    Users, 
    ClipboardList, 
    BookOpenCheck, 
    History, 
    Layers
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

// ARCHITETTURA: Cambiamo 'roles' in 'permissions'
interface SidebarItem extends NavItem {
    permissions: string[]; 
}

// Definiamo le voci in base a "Cosa può fare l'utente" e non "Chi è"
const allNavItems: SidebarItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        permissions: [], // Array vuoto = accessibile a tutti gli utenti loggati
    },
    {
        title: 'Gestione Esercizi',
        href: '/admin/exercises',
        icon: Dumbbell,
        permissions: ['read:exercises'], // Usa i permessi CRUD generati dal Seeder
    },
    {
        title: 'Gruppi Muscolari', // <-- LA TUA NUOVA VOCE
        href: '/admin/muscle-groups', // <-- Kebab-case architetturale
        icon: Layers,
        permissions: ['read:muscle-groups'], // Solo chi ha questo permesso la vedrà
    },
    {
        title: 'Gestione Utenti',
        href: '/admin/accounts',
        icon: Users,
        permissions: ['read:users'],
    },
    {
        title: 'Catalogo Esercizi',
        href: '/pt/exercises/catalog',
        icon: BookOpenCheck,
        // Esempio: Il PT vede questa voce perché non ha accesso all'admin completo
        permissions: ['read:exercises', 'create:plans'], 
    },
    {
        title: 'La Mia Scheda',
        href: '/client/my-plan',
        icon: ClipboardList,
        permissions: ['read:plans'],
    },
    {
        title: 'Storico Schede',
        href: '/client/history',
        icon: History,
        permissions: ['read:plans'],
    }
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    // Recuperiamo i permessi che abbiamo inviato dal middleware HandleInertiaRequests
    const { auth } = usePage().props as any;
    const userPermissions = auth.permissions || []; 

    // Filtriamo la sidebar in modo dinamico
    const filteredNavItems = allNavItems.filter((item) => {
        // Se non richiede permessi speciali (es. Dashboard), mostralo
        if (item.permissions.length === 0) return true;
        
        // Altrimenti, controlla se l'utente ha ALMENO UNO dei permessi richiesti per quella voce
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