import { Head, Link, usePage } from '@inertiajs/react';
import { login, register, dashboard } from '@/routes';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title="TEMPRA - Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F8F8F8] text-[#121212] py-10">
                
                {/* Dashboard link rapido */}
                {auth.user && (
                    <div className="absolute top-6 right-6 z-30">
                        <Link
                            href={dashboard()}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase italic hover:border-primary transition-all shadow-sm"
                        >
                            Dashboard <ArrowRight size={14} />
                        </Link>
                    </div>
                )}

                <div className="relative z-10 flex flex-col items-center w-full px-6 max-w-4xl">
                    
                    {/* Immagine Hero - Ridimensionata per equilibrio */}
                    <div className="w-full mb-8 flex justify-center">
                        <div className="relative p-2 bg-white border border-zinc-200 rounded-[2.5rem] shadow-xl">
                            <img
                                src="/images/hero.jpeg"
                                alt="Tempra Hero"
                                className="w-full max-w-2xl h-auto rounded-[2rem] object-cover block"
                                onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop";
                                }}
                            />
                        </div>
                    </div>

                    {/* Titolo TEMPRA - Dimensioni bilanciate */}
                    <div className="text-center mb-10">
                         <h1 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                            TEMPRA FITNESS
                         </h1>
                         <div className="flex items-center justify-center gap-3 mt-3 opacity-30">
                            <div className="h-px w-8 bg-black" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Performance Lab</span>
                            <div className="h-px w-8 bg-black" />
                         </div>
                    </div>

                    {/* Pulsanti - Grandi ma armoniosi */}
                    {!auth.user && (
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                            <Link
                                href={login()}
                                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-black text-white rounded-2xl hover:bg-zinc-800 transition-all duration-300 shadow-lg group"
                            >
                                <LogIn size={18} />
                                <span className="font-black uppercase italic text-lg tracking-tight">Login</span>
                            </Link>

                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white text-black border-2 border-black rounded-2xl hover:bg-zinc-50 transition-all duration-300 group"
                                >
                                    <UserPlus size={18} />
                                    <span className="font-black uppercase italic text-lg tracking-tight">Register</span>
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Tagline discreta */}
                    <p className="mt-10 text-[11px] font-black uppercase italic opacity-30 tracking-[0.3em]">
                        Push your limits.
                    </p>
                </div>
            </div>
        </>
    );
}