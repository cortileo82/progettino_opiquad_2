import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    message: string;
    icon: LucideIcon; // Accetta un componente icona di Lucide
}

export function EmptyState({ message, icon: Icon }: EmptyStateProps) {
    return (
        <div className="text-center py-32 bg-sidebar border-2 border-dashed border-sidebar-border rounded-[3rem]">
            {/* L'icona viene renderizzata dinamicamente */}
            <Icon size={48} className="mx-auto text-muted-foreground/20 mb-6" />
            
            <p className="text-muted-foreground uppercase italic text-[10px] font-black tracking-[0.4em]">
                {message}
            </p>
        </div>
    );
}