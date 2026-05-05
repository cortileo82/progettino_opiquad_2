import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme, useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

// 1. Importa il ConfigProvider di Ant Design
import { ConfigProvider } from 'antd';
// Opzionale: importa la lingua italiana se ti serve tradurre i componenti AntD


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function AntdThemeProvider({ children }: { children: React.ReactNode }) {
    // Si legge la preferenza risolta ('dark' o 'light')
    const { resolvedAppearance } = useAppearance();

    return (
        <ConfigProvider
            theme={{
               token: {
                    // Si mantiene una coerenza visiva base con il design system
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
            /* 2. Avvolgi tutto con il ConfigProvider */
           <ConfigProvider
                theme={{
                    // Configurazione 1: Token globali
                    token: {
                        borderRadius: 12,
                        colorPrimary: '#0b0a09', // Zinc 950
                        colorBgContainer: 'transparent',
                        colorBorder: 'rgba(0, 0, 0, 0.2)',
                    },
                    // Configurazione 2: Personalizzazione specifica componenti
                    components: {
                        Button: {
                            colorPrimary: '#09090b',      // Zinc 950
                            colorPrimaryHover: '#18181b', // Zinc 900
                            colorPrimaryActive: '#27272a', // Zinc 800
                        },
                    },
                }}
            >
                <TooltipProvider delayDuration={0}>
                    {app}
                    <Toaster />
                </TooltipProvider>
            </ConfigProvider>
        );
    },
    progress: {
        color: '#ff6900',
        showSpinner: true,
    },
});

initializeTheme();