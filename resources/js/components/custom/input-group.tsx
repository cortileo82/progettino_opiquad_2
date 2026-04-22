import React from 'react';
import { Input, Select } from 'antd';
import { cn } from '@/lib/utils';

interface InputGroupProps {
    label: string;
    error?: string;
    type?: 'text' | 'email' | 'password' | 'select';
    children?: React.ReactNode;
    className?: string;
    value?: any;
    // Accettiamo una funzione generica che gestisce sia l'evento che il valore diretto
    onChange?: (value: any) => void; 
    placeholder?: string;
    [key: string]: any;
}

export function InputGroup({ label, error, type = 'text', children, className, onChange, ...props }: InputGroupProps) {
    const renderInput = () => {
        const baseClass = "w-full rounded-xl border border-sidebar-border bg-background p-4 focus:border-primary focus:ring-1 focus:ring-primary transition-all font-bold text-sm outline-none italic text-foreground";
        
        if (type === 'select') {
            return (
                <Select 
                    {...props} 
                    className="w-full h-[54px] text-sm font-bold"
                    // Se è una select, passiamo direttamente il valore a onChange
                    onChange={(val) => onChange && onChange(val)}
                >
                    {children}
                </Select>
            );
        }

        const InputComponent = type === 'password' ? Input.Password : Input;
        
        return (
            <InputComponent 
                {...props} 
                type={type} 
                // Se è un input, estraiamo il valore dall'evento prima di passarlo a onChange
                onChange={(e: any) => onChange && onChange(e.target.value)} 
                className={cn(baseClass, type === 'email' && "lowercase")} 
            />
        );
    };

    return (
        <div className={cn("space-y-3", className)}>
            <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground block ml-1 uppercase">
                {label}
            </label>
            {renderInput()}
            {error && <p className="text-[10px] text-red-500 font-black tracking-widest mt-1 uppercase">{error}</p>}
        </div>
    );
}