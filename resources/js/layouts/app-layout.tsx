// resources/js/layouts/app-layout.tsx

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function AppLayout({ children, breadcrumbs }: { children: React.ReactNode; breadcrumbs: any }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
                {/* RIMOSSO IL SIDEBAR-TRIGGER DA QUI 
                  In questo modo non avrai più il tasto che si bugga nell'header
                */}
                
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    {/* Qui di solito c'è il breadcrumb, ma NON deve esserci il SidebarTrigger */}
                    <div className="flex items-center gap-2">
                        {/* Se hai breadcrumbs, lasciali, ma togli il pulsante toggle */}
                    </div>
                </header>

                <main className="flex-1 p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}