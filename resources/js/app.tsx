import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme, useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
// Si importa 'theme' da antd per usare gli algoritmi nativi
import { ConfigProvider, theme } from 'antd'; 

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Wrapper:
// Si crea un componente wrapper perché l'hook `useAppearance` può essere usato solo dentro un componente React valido.
function RootThemeProvider({ children }: { children: React.ReactNode }) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <ConfigProvider 
            theme={{ 
                // Questo comando istruisce l'intera libreria Ant Design 
                // a invertire tutti i suoi colori (sfondi, testi, bordi) nativamente.
                algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: { 
                    borderRadius: 12, 
                    colorPrimary: resolvedAppearance === 'dark' ? '#ffffff' : '#09090b',
                } 
            }}
        >
            {children}
        </ConfigProvider>
    );
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return undefined;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {/* Iniezione della dipendenza globale */}
                {/* Si utilizza il nostro Wrapper che reagisce dinamicamente al tema */}
                <RootThemeProvider>
                    {app}
                    <Toaster />
                </RootThemeProvider>
            </TooltipProvider>
        );
    },
    progress: {
        color: '#ff6900',
        showSpinner: true,
    },
});

initializeTheme();