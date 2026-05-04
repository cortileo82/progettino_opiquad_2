import React from 'react';
import { Input, Select } from 'antd';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface InputGroupProps {
    label: string;
    icon?: LucideIcon;
    error?: string;
    type?: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number' | 'custom';
    rows?: number;
    children?: React.ReactNode;
    className?: string;
    value?: any;
    onChange?: (value: any) => void;
    placeholder?: string;
    [key: string]: any;
}

export function InputGroup({ label, icon: Icon, error, type = 'text', children, className, onChange, value, ...props }: InputGroupProps) {
    const renderInput = () => {
        const baseClass = "w-full rounded-xl border border-sidebar-border bg-background px-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm outline-none italic text-foreground placeholder:text-muted-foreground/50";
        const standardHeight = "h-[54px]";

        return <>{children}</>
    };

    return (
        <div className={cn("space-y-3", className)}>
            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1 uppercase flex items-center gap-2 italic">
                {Icon && <Icon size={12} />}
                {label}
            </label>
            {renderInput()}
            {error && (
                <p className="text-[10px] text-red-500 font-black tracking-widest mt-1 uppercase ml-1 italic">
                    {error}
                </p>
            )}
        </div>
    )
}