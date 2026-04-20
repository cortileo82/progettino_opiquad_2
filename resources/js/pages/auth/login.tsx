import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { LogIn, Mail, Lock, ChevronLeft } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center p-6">
            <Head title="Login - TEMPRA" />

            {/* Navigazione Home */}
            <Link 
                href="/" 
                className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-black uppercase italic text-zinc-400 hover:text-black transition-all tracking-widest"
            >
                <ChevronLeft size={14} /> Torna alla Home
            </Link>

            <div className="w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-500">
                
                {/* Branding & Header (Identico a Register) */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="p-1 bg-white border border-zinc-200 rounded-3xl shadow-sm">
                            <img
                                src="/images/hero.jpeg"
                                alt="Tempra"
                                className="w-16 h-16 rounded-2xl object-cover grayscale-[0.5]"
                            />
                        </div>
                    </div>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-black">
                        TEMPRA
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mt-3">
                        Performance LAB
                    </p>
                </div>

                {/* Card del Form (Identica a Register) */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/[0.03] relative overflow-hidden">
                    
                    {/* Status Message */}
                    {status && (
                        <div className="mb-6 p-4 bg-green-50 rounded-2xl text-green-600 text-[10px] font-bold uppercase italic text-center border border-green-100">
                            {status}
                        </div>
                    )}

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-4">
                                    {/* Email */}
                                    <div className="grid gap-2">
                                        <Label 
                                            htmlFor="email" 
                                            className="text-[10px] font-black uppercase italic tracking-widest ml-4 text-zinc-400"
                                        >
                                            Indirizzo Email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="nome@esempio.it"
                                                className="h-14 pl-12 bg-[#FBFBFB] border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium placeholder:text-zinc-300"
                                            />
                                        </div>
                                        <InputError message={errors.email} className="ml-4 italic font-bold text-[10px] uppercase" />
                                    </div>

                                    {/* Password */}
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between px-4">
                                            <Label 
                                                htmlFor="password" 
                                                className="text-[10px] font-black uppercase italic tracking-widest text-zinc-400"
                                            >
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-[9px] font-bold uppercase text-zinc-400 hover:text-black tracking-tighter"
                                                    tabIndex={5}
                                                >
                                                    Dimenticata?
                                                </TextLink>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="h-14 pl-12 bg-[#FBFBFB] border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium"
                                            />
                                        </div>
                                        <InputError message={errors.password} className="ml-4 italic font-bold text-[10px] uppercase" />
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center space-x-3 px-4">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="rounded border-zinc-300 text-black focus:ring-black"
                                        />
                                        <Label 
                                            htmlFor="remember" 
                                            className="text-[10px] font-black uppercase italic text-zinc-400 cursor-pointer"
                                        >
                                            Rimani collegato
                                        </Label>
                                    </div>
                                </div>

                                {/* Submit Button (Identico a Register) */}
                                <Button
                                    type="submit"
                                    className="h-16 w-full bg-black text-white rounded-2xl hover:bg-zinc-800 transition-all duration-300 shadow-xl group mt-4"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <Spinner className="mr-2" />
                                    ) : (
                                        <LogIn className="mr-2 group-hover:translate-x-1 transition-transform" size={20} />
                                    )}
                                    <span className="font-black uppercase italic text-lg tracking-tight">Accedi</span>
                                </Button>

                                {/* Register Link */}
                                {canRegister && (
                                    <div className="text-center mt-4">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                                            Non hai un account?{' '}
                                            <Link 
                                                href={register()} 
                                                className="text-black hover:underline underline-offset-4 font-black italic"
                                                tabIndex={6}
                                            >
                                                Registrati
                                            </Link>
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </Form>
                </div>
                
                {/* Footer */}
                <p className="mt-10 text-center text-[9px] font-black uppercase italic opacity-20 tracking-[0.5em]">
                    TEMPRA Performance Lab
                </p>
            </div>
        </div>
    );
}

Login.layout = {
    title: 'Login - TEMPRA',
    description: 'Accedi al tuo pannello di controllo.',
};