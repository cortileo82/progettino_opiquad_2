import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
    Pencil, Trash2, ChevronDown, Mail, UserCircle, 
    Dumbbell, AlignLeft, Target, ShieldCheck,
    FileText, PlusCircle, ArrowRight, Users
} from 'lucide-react';

interface ResourceListProps {
    items: any[];
    // Aggiunto 'clients' ai tipi supportati
    type: 'users' | 'exercises' | 'muscle-groups' | 'roles' | 'clients' | 'plans'; 
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
                    {/* --- HEADER DELLA CARD --- */}
                    <div 
                        className={`flex items-center justify-between p-6 ${type !== 'muscle-groups' ? 'cursor-pointer' : ''}`} 
                        onClick={() => toggleExpand(item.id)}
                    >
                        <div className="flex items-center gap-6">
                            {/* ICONA DINAMICA */}
                            <div className={`p-4 rounded-2xl transition-all duration-500 ${expandedId === item.id ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'}`}>
                                {type === 'users' && <UserCircle size={22} />}
                                {type === 'clients' && <Users size={22} />}
                                {type === 'exercises' && <Dumbbell size={22} />}
                                {type === 'muscle-groups' && <Target size={22} />}
                                {type === 'roles' && <ShieldCheck size={22} />}
                            </div>

                            {/* TESTI PRINCIPALI */}
                            <div className="flex flex-col">
                                <span className="font-black uppercase italic text-lg tracking-tight text-foreground">
                                    {item.name}
                                </span>
                                {type !== 'muscle-groups' && (
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] mt-0.5 text-primary">
                                        {type === 'users' && (item.roles?.[0]?.name || 'NESSUN RUOLO')}
                                        {type === 'clients' && 'ATLETA ASSOCIATO'}
                                        {type === 'exercises' && (item.muscle_group?.name || item.muscle_group || 'Senza Categoria')}
                                        {type === 'roles' && `${item.permissions?.length || 0} AUTORIZZAZIONI`}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* AZIONI E FRECCIA */}
                        <div className="flex items-center gap-4">
                            {!readOnly && type !== 'clients' && (
                                <div className="flex items-center gap-2 border-r border-sidebar-border pr-5">
                                    {editBaseUrl && (
                                        <Link 
                                            href={`${editBaseUrl}/${item.id}/edit`} 
                                            onClick={(e) => e.stopPropagation()} 
                                            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all"
                                        >
                                            <Pencil size={18} />
                                        </Link>
                                    )}
                                    {item.id !== authUserId && onDelete && (
                                        <button 
                                            type="button" 
                                            onClick={(e) => { e.stopPropagation(); onDelete(item.id) }} 
                                            className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            )}
                            
                            {type !== 'muscle-groups' && (
                                <ChevronDown 
                                    size={20} 
                                    className={`text-muted-foreground transition-transform duration-500 ${expandedId === item.id ? 'rotate-180 text-foreground' : ''}`} 
                                />
                            )}
                        </div>
                    </div>

                    {/* --- CORPO ESPANDIBILE --- */}
                    {expandedId === item.id && type !== 'muscle-groups' && (
                        <div className="px-10 pb-10 pt-2 bg-background/30 border-t border-sidebar-border/50 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="mt-6">
                                
                                {type === 'roles' ? (
                                    /* VISTA RUOLI */
                                    <div className="space-y-4">
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary block ml-1">
                                            Lista Permessi nel Database
                                        </span>
                                        {item.permissions && item.permissions.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {item.permissions.map((perm: any) => (
                                                    <div key={perm.id} className="px-4 py-2 bg-foreground text-background rounded-xl text-[10px] font-black uppercase italic shadow-lg">
                                                        {perm.name}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-background border border-dashed border-sidebar-border rounded-2xl text-xs italic text-muted-foreground">
                                                Nessun permesso trovato.
                                            </div>
                                        )}
                                    </div>
                                ) : type === 'clients' ? (
                                    /* VISTA SPECIFICA PER I CLIENTI DEL PT */
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <DetailBox label="Email Atleta" value={item.email} icon={Mail} />
                                            
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                                            <Link 
                                                href={`/pt/clients/${item.id}/plans`}
                                                className="flex-1 flex items-center justify-between p-6 bg-background border border-sidebar-border rounded-[1.5rem] hover:border-primary transition-all group/btn shadow-sm"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-sidebar rounded-xl text-muted-foreground group-hover/btn:text-primary transition-colors">
                                                        <FileText size={20} />
                                                    </div>
                                                    <span className="font-black uppercase italic text-xs tracking-widest">Visualizza Schede</span>
                                                </div>
                                                <ArrowRight size={18} className="text-primary group-hover/btn:translate-x-2 transition-transform" />
                                            </Link>

                                            <Link 
                                                href={`/pt/plans/create/${item.id}`}
                                                className="flex-1 flex items-center justify-between p-6 bg-foreground text-background rounded-[1.5rem] hover:opacity-90 transition-all group/btn shadow-xl"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-background/10 rounded-xl">
                                                        <PlusCircle size={20} />
                                                    </div>
                                                    <span className="font-black uppercase italic text-xs tracking-widest">Nuova Scheda</span>
                                                </div>
                                                <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    /* VISTA UTENTI ED ESERCIZI */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {type === 'users' && (
                                            <>
                                                <DetailBox label="Email utente" value={item.email} icon={Mail} />
                                                {(item.roles?.[0]?.name === 'client') && (
                                                    <DetailBox label="Personal Trainer" value={item.trainer?.name || 'NON ASSEGNATO'} icon={UserCircle} />
                                                )}
                                            </>
                                        )}

                                        {type === 'exercises' && (
                                            <div className="md:col-span-2">
                                                <DetailBox 
                                                    label="Dettagli Tecnici Esercizio" 
                                                    value={item.description || 'Nessuna specifica tecnica inserita.'} 
                                                    icon={AlignLeft} 
                                                    isTextArea 
                                                />
                                            </div>
                                        )}
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