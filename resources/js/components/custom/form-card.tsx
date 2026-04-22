import React from 'react';
import { cn } from '@/lib/utils';

export function FormCard({ children, className}: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-10 p-10 md:p-12 rounded-2xl border border-sidebar-border bg-sidebar shadow-sm",
            className
        )}>
            {children}
        </div>
    );
}