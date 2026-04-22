import React from 'react';
import { Button, ConfigProvider } from 'antd';
import { Save, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormButtonProps {
    processing: boolean;         // Stato di caricamento da useForm() di Inertia
    label?: string;              // Testo del bottone
    icon?: LucideIcon;           // Icona personalizzata (default: Save)
    className?: string;          // Classi extra
}

export function FormButton({ 
    processing, 
    label = 'Salva Modifiche', 
    icon: Icon = Save, 
    className 
}: FormButtonProps) {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: '#09090b',      // Zinc 950 (Nero)
                        colorPrimaryHover: '#18181b', // Zinc 900
                        colorPrimaryActive: '#27272a', // Zinc 800
                    },
                },
            }}
        >
            <div className="flex justify-end pt-2">
                <Button 
                    type="primary"
                    htmlType="submit"            // Fondamentale per inviare il form
                    size="large"
                    disabled={processing}
                    loading={processing}         // Ant Design gestisce l'animazione da solo
                    icon={!processing && <Icon size={16} className="group-hover:scale-110 transition-transform" />}
                    className={cn(
                        "rounded-xl h-auto px-8 py-4 flex items-center gap-3 shadow-lg active:scale-95 group border-none",
                        className
                    )}
                >
                    <span className="font-black uppercase italic tracking-[0.2em] text-[11px]">
                        {label}
                    </span>
                </Button>
            </div>
        </ConfigProvider>
    );
}