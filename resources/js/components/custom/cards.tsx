import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    className?: string;
}

export function Card({ label, value, icon: Icon, className }: CardProps) {
    return (
        <div className={cn(
            "flex items-center gap-6 rounded-2xl border border-sidebar-border bg-sidebar p-8 shadow-sm hover:border-primary/50 transition-all w-full", 
            className
        )}>

            <div className="rounded-2xl bg-primary/10 p-4 text-primary shrink-0">
                <Icon size={32} />
            </div>

            <div className="flex flex-col gap-1">
                <p className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                    {label}
                </p>
                <p className="text-3xl font-black text-foreground tabular-nums">
                    {value}
                </p>
            </div>
        </div>
    );
}