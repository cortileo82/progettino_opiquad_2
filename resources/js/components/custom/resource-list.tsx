import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
    Pencil, Trash2, ChevronDown, Mail, UserCircle, 
    Dumbbell, AlignLeft, Target 
} from 'lucide-react';

interface ResourceListProps {
    items: any[];
    type: 'users' | 'exercises' | 'muscle-groups';
    onDelete?: (id: number) => void;
    editBaseUrl?: string;
    authUserId?: number; 
    readOnly?: boolean; 
}

export function ResourceList({ items, type, onDelete, editBaseUrl, authUserId, readOnly = false }: ResourceListProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        if (type === 'muscle-groups') return;
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-4 mt-6">
            {items.map((item) => (
                <div 
                    key={item.id} 
                    className={`bg-sidebar border rounded-[2rem] transition-all duration-300 ${
                        expandedId === item.id 
                        ? 'border-foreground ring-1 ring-foreground/10 shadow-2xl scale-[1.01]' 
                        : 'border-sidebar-border hover:border-foreground/20'
                    } overflow-hidden`}
                >
                    {/* HEADER */}
                    <div 
                        className={`flex items-center justify-between p-6 ${type !== 'muscle-groups' ? 'cursor-pointer' : ''}`} 
                        onClick={() => toggleExpand(item.id)}
                    >
                        <div className="flex items-center gap-6">
                            {/* ICONA DINAMICA */}
                            <div className={`p-4 rounded-2xl transition-all duration-500 ${expandedId === item.id ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'}`}>
                                {type === 'users' && <UserCircle size={22} />}
                                {type === 'exercises' && <Dumbbell size={22} />}
                                {type === 'muscle-groups' && <Target size={22} />}
                            </div>

                            {/* TESTI TITOLO E SOTTOTITOLO */}
                            <div className="flex flex-col">
                                <span className="font-black uppercase italic text-lg tracking-tight text-foreground">
                                    {item.name}
                                </span>
                                
                                {/* SOTTOTITOLO DINAMICO CON FIX CATEGORIA */}
                                {type !== 'muscle-groups' && (
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] mt-0.5 text-primary">
                                        {type === 'users' && item.role}
                                        {type === 'exercises' && (
                                            item.muscle_group?.name || // Se è oggetto (DB)
                                            item.muscle_group ||       // Se è stringa
                                            'Senza Categoria'          // Fallback
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* AZIONI E CONTROLLI */}
                        <div className="flex items-center gap-4">
                            
                            {!readOnly && (
                                <div className="flex items-center gap-2 border-r border-sidebar-border pr-5">
                                    {/* MODIFICA */}
                                    {editBaseUrl && (
                                        <Link 
                                            href={`${editBaseUrl}/${item.id}/edit`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all"
                                        >
                                            <Pencil size={18} />
                                        </Link>
                                    )}
                                    
                                    {/* ELIMINA */}
                                    {item.id !== authUserId && onDelete && (
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                            className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            )}
                            
                            {/* FRECCIA ESPANSIONE */}
                            {type !== 'muscle-groups' && (
                                <ChevronDown 
                                    size={20} 
                                    className={`text-muted-foreground transition-transform duration-500 ${expandedId === item.id ? 'rotate-180 text-foreground' : ''}`} 
                                />
                            )}
                        </div>
                    </div>

                    {/* CORPO ESPANDIBILE */}
                    {expandedId === item.id && type !== 'muscle-groups' && (
                        <div className="px-10 pb-10 pt-2 bg-background/30 border-t border-sidebar-border/50 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                                {type === 'users' && (
                                    <>
                                        <DetailBox label="Email" value={item.email} icon={Mail} />
                                        {item.role === 'client' && (
                                            <DetailBox label="Personal Trainer" value={item.trainer?.name || 'DA ASSEGNARE'} icon={UserCircle} />
                                        )}
                                    </>
                                )}

                                {type === 'exercises' && (
                                    <div className="md:col-span-2">
                                        <DetailBox 
                                            label="Descrizione Esercizio" 
                                            value={item.description || 'Nessuna descrizione presente.'} 
                                            icon={AlignLeft} 
                                            isTextArea 
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function DetailBox({ label, value, icon: Icon, isTextArea = false }: { label: string, value: string, icon: any, isTextArea?: boolean }) {
    return (
        <div className="space-y-3">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block ml-1">
                {label}
            </span>
            <div className={`flex items-start gap-4 text-sm font-bold text-foreground bg-background rounded-2xl p-4 border border-sidebar-border shadow-inner ${!isTextArea ? 'items-center uppercase italic' : ''}`}>
                <Icon size={16} className={`text-primary shrink-0 ${isTextArea ? 'mt-1' : ''}`} />
                <span className="leading-relaxed">{value}</span>
            </div>
        </div>
    );
}