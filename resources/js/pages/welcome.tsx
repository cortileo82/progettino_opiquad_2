import { Head, Link, usePage } from '@inertiajs/react';
import { login, register, dashboard } from '@/routes';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="TEMPRA - Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="relative flex min-h-screen flex-col items-center justify-center bg-background text-foreground py-10 transition-colors duration-300">
                
                {auth.user && (
                    <div className="absolute top-6 right-6 z-30">
                        <Link 
                            href={dashboard()} 
                            className="flex items-center gap-2 px-4 py-2 bg-card border border-sidebar-border rounded-xl text-[10px] font-black uppercase italic hover:border-primary transition-all shadow-sm text-foreground"
                        >
                            Dashboard <ArrowRight size={14} />
                        </Link>
                    </div>
                )}

                <div className="relative z-10 flex flex-col items-center w-full px-6 max-w-4xl">
                    
                    <div className="w-full mb-8 flex justify-center">
                        <div className="relative p-2 bg-card border border-sidebar-border rounded-[2.5rem] shadow-xl transition-colors duration-300">
                            <img 
                                src="/images/hero.jpeg" 
                                alt="Tempra Hero" 
                                className="w-full max-w-2xl h-auto rounded-[2rem] object-cover block" 
                                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop" }} 
                            />
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                            TEMPRA FITNESS
                        </h1>
                        <div className="flex items-center justify-center gap-3 mt-3 opacity-30">
                            <div className="h-px w-8 bg-foreground" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Performance Lab</span>
                            <div className="h-px w-8 bg-foreground" />
                        </div>
                    </div>

                    {!auth.user && (
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                            
                            <Link 
                                href={login()} 
                                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-foreground text-background rounded-2xl hover:bg-foreground/80 transition-all duration-300 shadow-lg group"
                            >
                                <LogIn size={18} />
                                <span className="font-black uppercase italic text-lg tracking-tight">Login</span>
                            </Link>

                            {canRegister && (
                                <Link 
                                    href={register()} 
                                    className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-background text-foreground border-2 border-foreground rounded-2xl hover:bg-foreground/10 transition-all duration-300 group"
                                >
                                    <UserPlus size={18} />
                                    <span className="font-black uppercase italic text-lg tracking-tight">Register</span>
                                </Link>
                            )}
                        </div>
                    )}

                    <p className="mt-10 text-[11px] font-black uppercase italic opacity-30 tracking-[0.3em]">
                        Push your limits.
                    </p>
                </div>
            </div>
        </>
    );
}