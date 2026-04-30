interface IndexHeaderProps {
    subtitle: string;
}

export function IndexHeader({ subtitle }: IndexHeaderProps) {
    return (
        <div className="text-center mb-8 mt-2 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-center mb-5">
                <div className="p-1.5 bg-sidebar border border-sidebar-border rounded-2xl shadow-sm">
                    <img 
                        src="/images/hero.jpeg" 
                        alt="Tempra" 
                        className="w-16 h-16 rounded-xl object-cover grayscale-[0.5]" 
                    />
                </div>
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-foreground">
                TEMPRA
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground mt-2">
                {subtitle}
            </p>
        </div>
    );
}