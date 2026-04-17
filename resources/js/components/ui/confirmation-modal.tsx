import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    loading?: boolean;
}

export function ConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    description, 
    confirmText = "Elimina",
    loading = false 
}: Props) {
    return (
        <AlertDialog.Root open={isOpen} onOpenChange={onClose}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" />
                
                <AlertDialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-sidebar-border bg-sidebar p-8 shadow-2xl duration-200 rounded-[2.5rem] animate-in zoom-in-95">
                    
                    <div className="flex flex-col gap-2 text-center sm:text-left">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-4 rounded-2xl bg-destructive/10 text-destructive flex-shrink-0">
                                <AlertTriangle size={28} />
                            </div>
                            <AlertDialog.Title className="text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground">
                                {title}
                            </AlertDialog.Title>
                        </div>
                        
                        <AlertDialog.Description className="text-sm font-bold text-muted-foreground uppercase tracking-tight italic leading-relaxed">
                            {description}
                        </AlertDialog.Description>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
                        <AlertDialog.Cancel asChild>
                            <button 
                                onClick={onClose}
                                className="inline-flex items-center justify-center rounded-xl border border-sidebar-border bg-background px-6 py-5 text-xs font-black uppercase italic transition-all hover:bg-muted active:scale-95 text-foreground"
                            >
                                Annulla
                            </button>
                        </AlertDialog.Cancel>
                        
                        <AlertDialog.Action asChild>
                            <button
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.preventDefault();
                                    onConfirm();
                                }}
                                disabled={loading}
                                /* FIX: text-white forzato e font-black per la massima leggibilità */
                                className="inline-flex items-center justify-center rounded-xl bg-destructive px-6 py-5 text-xs font-black uppercase italic text-white shadow-lg shadow-destructive/40 transition-all hover:bg-destructive/90 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        <span>Eliminazione...</span>
                                    </div>
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}