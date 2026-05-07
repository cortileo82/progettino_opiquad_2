import React from 'react';
import { Button } from 'antd';
import { Save, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormButtonProps {
    processing: boolean;
    label?: string;
    icon?: LucideIcon;
    className?: string;
}

export function FormButton({ processing, label = 'Salva Modifiche', icon: Icon = Save, className }: FormButtonProps) {
    return (
        <div className="flex justify-end pt-2">
            <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                disabled={processing} 
                loading={processing} 
                icon={!processing && <Icon size={16} className="group-hover:scale-110 transition-transform" />} 
                className={cn(
                    "rounded-xl h-auto px-8 py-4 flex items-center gap-3 shadow-lg active:scale-95 group border-none",
                    
                    // Tema chiaro: sfondo quasi nero, testo bianco. 
                    "!bg-zinc-950 !text-white hover:!bg-zinc-800",
                    
                    // Tema scuro: sfondo bianco, testo scuro. 
                    "dark:!bg-white dark:!text-zinc-950 dark:hover:!bg-zinc-200",
                    
                    processing && "opacity-50 cursor-not-allowed pointer-events-none",
                    className
                )}
            >
                <span className="font-black uppercase italic tracking-[0.2em] text-[11px] !text-white dark:!text-zinc-950">
                    {label}
                </span>
            </Button>
        </div>
    );
}