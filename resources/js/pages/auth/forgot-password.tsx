// Components
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Mail, ChevronLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center p-6">
            <Head title="Forgot password - TEMPRA" />

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
                        Reset Password
                    </p>
                </div>

                {/* Card del Form */}
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/[0.03] relative overflow-hidden">
                    
                    <div className="mb-6 text-center px-2">
                        <p className="text-[11px] font-medium text-zinc-500 leading-relaxed uppercase italic">
                            Inserisci la tua email e ti invieremo un link per scegliere una nuova password.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 p-4 bg-green-50 rounded-2xl text-green-600 text-[10px] font-bold uppercase italic text-center border border-green-100">
                            {status}
                        </div>
                    )}

                    <Form {...email.form()} className="flex flex-col gap-6">
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-4">
                                    {/* Email Field */}
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
                                                autoComplete="off"
                                                autoFocus
                                                placeholder="nome@esempio.it"
                                                className="h-14 pl-12 bg-[#FBFBFB] border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black transition-all font-medium placeholder:text-zinc-300"
                                            />
                                        </div>
                                        <InputError message={errors.email} className="ml-4 italic font-bold text-[10px] uppercase" />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="h-16 w-full bg-black text-white rounded-2xl hover:bg-zinc-800 transition-all duration-300 shadow-xl group mt-2"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing ? (
                                        <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                                    ) : (
                                        <Mail className="mr-2 group-hover:translate-x-1 transition-transform" size={20} />
                                    )}
                                    <span className="font-black uppercase italic text-lg tracking-tight">Invia Link</span>
                                </Button>

                                {/* Back to Login Link */}
                                <div className="text-center mt-4">
                                    <Link 
                                        href={login()} 
                                        className="text-[10px] font-black text-zinc-400 uppercase tracking-tight hover:text-black transition-colors italic"
                                    >
                                        Torna al login
                                    </Link>
                                </div>
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

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};