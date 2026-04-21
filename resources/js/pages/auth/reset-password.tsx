import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, ShieldCheck, ChevronLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center p-6">
            <Head title="Reset Password - TEMPRA" />

            {/* Navigazione Home */}
            <Link 
                href="/" 
                className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-black uppercase italic text-zinc-400 hover:text-black transition-all tracking-widest"
            >
                <ChevronLeft size={14} /> Torna alla Home
            </Link>

            <div className="w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-500">
                
                {/* Branding & Header (Identico alle altre pagine) */}
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
                        Imposta nuova password
                    </p>
                </div>

                {/* Card del Form */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/[0.03] relative overflow-hidden">
                    
                    <Form
                        {...update.form()}
                        transform={(data) => ({ ...data, token, email })}
                        resetOnSuccess={['password', 'password_confirmation']}
                        className="flex flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-4">
                                    {/* Email (Read Only) */}
                                    <div className="grid gap-2">
                                        <Label 
                                            htmlFor="email" 
                                            className="text-[10px] font-black uppercase italic tracking-widest ml-4 text-zinc-400"
                                        >
                                            Email Atleta
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={email}
                                                readOnly
                                                className="h-14 pl-12 bg-[#F5F5F5] border-transparent rounded-2xl font-medium text-zinc-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <InputError message={errors.email} className="ml-4 italic font-bold text-[10px] uppercase" />
                                    </div>

                                    {/* New Password */}
                                    <div className="grid gap-2">
                                        <Label 
                                            htmlFor="password" 
                                            className="text-[10px] font-black uppercase italic tracking-widest ml-4 text-zinc-400"
                                        >
                                            Nuova Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                className="h-14 pl-12 bg-[#FBFBFB] border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium"
                                            />
                                        </div>
                                        <InputError message={errors.password} className="ml-4 italic font-bold text-[10px] uppercase" />
                                    </div>

                                    {/* Confirm New Password */}
                                    <div className="grid gap-2">
                                        <Label 
                                            htmlFor="password_confirmation" 
                                            className="text-[10px] font-black uppercase italic tracking-widest ml-4 text-zinc-400"
                                        >
                                            Conferma Nuova Password
                                        </Label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                                            <PasswordInput
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                required
                                                tabIndex={2}
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                className="h-14 pl-12 bg-[#FBFBFB] border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium"
                                            />
                                        </div>
                                        <InputError message={errors.password_confirmation} className="ml-4 italic font-bold text-[10px] uppercase" />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="h-16 w-full bg-black text-white rounded-2xl hover:bg-zinc-800 transition-all duration-300 shadow-xl group mt-4"
                                    disabled={processing}
                                    data-test="reset-password-button"
                                >
                                    {processing ? (
                                        <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                                    ) : (
                                        <Lock className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                                    )}
                                    <span className="font-black uppercase italic text-lg tracking-tight">Salva Password</span>
                                </Button>
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

/*ResetPassword.layout = {
    title: 'Reset Password - TEMPRA',
    description: 'Imposta le tue nuove credenziali di accesso.',
};*/