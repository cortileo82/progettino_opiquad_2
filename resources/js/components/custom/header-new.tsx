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
        <div className={cn("mb-8 border-b border-sidebar-border pb-6 italic uppercase", className)}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* SINISTRA: Icona e Titoli */}
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary shrink-0 flex items-center justify-center">
                        <Icon size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tighter text-foreground leading-none">
                            {title}
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium mt-1 normal-case not-italic">
                            {subtitle}
                        </p>
                    </div>
                </div>
                
                {/* DESTRA: Area Pulsanti */}
                <div className="flex items-center gap-3">
                    
                    {/* Pulsante Unico Semplificato (Forzato Nero) */}
                    {buttonHref && buttonText && (
                        <Link href={buttonHref}>
                            <Button 
                                // Ho aggiunto !bg-zinc-950 e !text-white per "vincere" contro il blu di AntD
                                className="!bg-zinc-950 hover:!bg-zinc-800 !text-white border-none rounded-xl px-8 h-[54px] flex items-center gap-3 transition-all shadow-lg active:scale-95 group"
                            >
                                {buttonIcon || <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />}
                                <span className="font-black uppercase italic tracking-[0.2em] text-[11px] !text-white">
                                    {buttonText}
                                </span>
                            </Button>
                        </Link>
                    )}

                    {/* Altri pulsanti */}
                    {actions}
                    
                </div>
            </div>
        </div>
    );
}