import React from 'react';
import { Link } from '@inertiajs/react';
import { LucideIcon, ArrowLeft } from 'lucide-react';
import { Button } from 'antd';
import { cn } from '@/lib/utils';

interface HeaderNewProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    buttonText?: string; 
    buttonHref?: string;
    buttonIcon?: React.ReactNode;
    actions?: React.ReactNode; 
    className?: string;
}

export function HeaderNew({ 
    title, 
    subtitle, 
    icon: Icon, 
    buttonText, 
    buttonHref, 
    buttonIcon,
    actions, 
    className 
}: HeaderNewProps) {
    return (
        <div className={cn("mb-10 border-b border-sidebar-border pb-8", className)}>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                
                {/* SINISTRA: Icona e Titoli */}
                <div className="flex items-start gap-6">
                    <div className="rounded-[1.25rem] bg-foreground text-background p-4 shrink-0 shadow-xl flex items-center justify-center">
                        <Icon size={32} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-5xl font-black tracking-tighter text-foreground leading-[0.9] uppercase italic">
                            {title}
                        </h1>
                        <p className="text-muted-foreground text-[10px] font-black mt-3 uppercase tracking-[0.3em] opacity-70">
                            {subtitle}
                        </p>
                    </div>
                </div>
                
                {/* DESTRA: Search Bar e Pulsanti --> probabilmente da cambiare la logica per SearchBar e Pulsanti assieme */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    
                    {/* Area per Azioni Custom (es. Search Bar) */}
                    {actions && (
                        <div className="w-full lg:w-96">
                            {actions}
                        </div>
                    )}

                    {/* Pulsante d'azione principale */}
                    {buttonHref && buttonText && (
                        <Link href={buttonHref} className="w-full sm:w-auto">
                            <Button 
                                className="!bg-zinc-950 hover:!bg-zinc-800 !text-white border-none rounded-2xl px-8 h-14 flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95 group w-full sm:w-auto"
                            >
                                {buttonIcon || <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />}
                                <span className="font-black uppercase italic tracking-[0.15em] text-[11px] !text-white">
                                    {buttonText}
                                </span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}