import React from 'react';
import { Input, Select } from 'antd';
import { cn } from '@/lib/utils';

interface InputGroupProps {
    label: string;
    error?: string;
    type?: 'text' | 'email' | 'password' | 'textarea' | 'select';
    rows?: number;
    children?: React.ReactNode;
    className?: string;
    value?: any;
    onChange?: (value: any) => void;
    placeholder?: string;
    [key: string]: any;
}

export function InputGroup({ 
    label, 
    error, 
    type = 'text', 
    children, 
    className, 
    onChange, 
    value, 
    ...props 
}: InputGroupProps) {
    
    const renderInput = () => {
        // h-[54px] è la misura chiave per pareggiare la Select
        const baseClass = "w-full rounded-xl border border-sidebar-border bg-background px-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm outline-none italic text-foreground placeholder:text-muted-foreground/50";
        const standardHeight = "h-[54px]";
        
        // 1. Gestione SELECT
        if (type === 'select') {
            return (
                <Select
                    {...props}
                    value={value}
                    // AntD Select ha bisogno di h-[54px] applicato sia via classe che via stile inline a volte
                    className={cn("w-full text-sm font-bold", standardHeight)}
                    onChange={(val) => onChange && onChange(val)}
                >
                    {children}
                </Select>
            );
        }

        // 2. Gestione TEXTAREA
        if (type === 'textarea') {
            return (
                <textarea
                    {...props}
                    rows={props.rows || 4}
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    // La textarea non ha h-[54px] perché deve essere più alta, 
                    // ma usiamo lo stesso padding e bordo per coerenza
                    className={cn(baseClass, "py-4 resize-none min-h-[120px]", error && "border-red-500")}
                />
            );
        }

        // 3. Gestione INPUT (Text, Email, Password)
        const InputComponent = type === 'password' ? Input.Password : Input;

        return (
            <InputComponent
                {...props}
                value={value}
                type={type}
                onChange={(e: any) => onChange && onChange(e.target.value)}
                // Applichiamo h-[54px] e px-4 (padding orizzontale) per matchare la Select
                className={cn(
                    baseClass, 
                    standardHeight,
                    type === 'email' && "lowercase",
                    error && "border-red-500"
                )}
            />
        );
    };

    return (
        <div className={cn("space-y-3", className)}>
            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1 uppercase">
                {label}
            </label>
            {renderInput()}
            {error && (
                <p className="text-[10px] text-red-500 font-black tracking-widest mt-1 uppercase ml-1">
                    {error}
                </p>
            )}
        </div>
    );
}