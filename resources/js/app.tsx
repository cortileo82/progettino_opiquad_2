import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme, useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { ConfigProvider, theme } from 'antd';
import React from 'react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function AntdThemeProvider({ children }: { children: React.ReactNode }) {
    // Si legge la preferenza risolta ('dark' o 'light')
    const { resolvedAppearance } = useAppearance();

    return (
        <ConfigProvider
            theme={{
                // Si dice ad Antd di seguire il tema globale
                algorithm: resolvedAppearance === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
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
            <AntdThemeProvider>
                <TooltipProvider delayDuration={0}>
                    {app}
                    <Toaster />
                </TooltipProvider>
            </AntdThemeProvider>
        );
    },
    progress: {
        color: '#ff6900',
        showSpinner: true,
    },
});

initializeTheme();