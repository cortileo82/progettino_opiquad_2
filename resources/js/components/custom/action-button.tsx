import React from 'react';
import { Link } from '@inertiajs/react';
import { Button, ConfigProvider } from 'antd'; // Aggiungi ConfigProvider
import { Plus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
    href: string;
    label: string;
    icon?: LucideIcon;
    className?: string;
}

export function ActionButton({ href, label, icon: Icon = Plus, className }: ActionButtonProps) {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: '#09090b',      // Zinc 950
                        colorPrimaryHover: '#18181b', // Zinc 900
                        colorPrimaryActive: '#27272a', // Zinc 800
                    },
                },
            }}
        >
            <Link href={href}>
                <Button 
                    type="primary"
                    size="large"
                    icon={<Icon size={18} className="group-hover:rotate-90 transition-transform duration-300" />}
                    className={cn(
                        "border-none rounded-2xl h-auto px-8 py-4 flex items-center gap-2 shadow-xl active:scale-95 group",
                        className
                    )}
                >
                    <span className="font-black uppercase italic tracking-[0.2em] text-xs text-white">
                        {label}
                    </span>
                </Button>
            </Link>
        </ConfigProvider>
    );
}