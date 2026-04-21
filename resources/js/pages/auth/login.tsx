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
import { LogIn, Mail, Lock } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    return (
        <>
            <Head title="Login - TEMPRA" />

            {/* --- HEADER DI MATTEO (Inserito direttamente nel flusso standard) --- */}
            <div className="text-center mb-8 mt-2 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex justify-center mb-5">
                    <div className="p-1.5 bg-sidebar border border-sidebar-border rounded-2xl shadow-sm">
                        <img src="/images/hero.jpeg" alt="Tempra" className="w-16 h-16 rounded-xl object-cover grayscale-[0.5]" />
                    </div>
                </div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-foreground">
                    TEMPRA
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground mt-2">
                    Accedi alla tua area riservata
                </p>
            </div>

            {/* --- MESSAGGIO DI STATO --- */}
            {status && (
                <div className="mb-6 p-4 bg-green-500/10 rounded-xl text-green-500 text-xs font-bold uppercase italic text-center border border-green-500/20">
                    {status}
                </div>
            )}

            {/* --- FORM ORIGINALE LARAVEL + STILE MATTEO --- */}
            <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            
                            {/* Input Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Indirizzo Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        name="email" 
                                        required 
                                        autoFocus 
                                        tabIndex={1} 
                                        autoComplete="email" 
                                        placeholder="nome@esempio.it" 
                                        className="h-12 pl-10 bg-background border-sidebar-border rounded-xl focus:ring-2 focus:ring-primary transition-all font-medium" 
                                    />
                                </div>
                                <InputError message={errors.email} className="ml-1 italic font-bold text-xs" />
                            </div>

                            {/* Input Password */}
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between px-1">
                                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} className="text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground tracking-tighter" tabIndex={5}>
                                            Dimenticata?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <PasswordInput 
                                        id="password" 
                                        name="password" 
                                        required 
                                        tabIndex={2} 
                                        autoComplete="current-password" 
                                        placeholder="••••••••" 
                                        className="h-12 pl-10 bg-background border-sidebar-border rounded-xl focus:ring-2 focus:ring-primary transition-all font-medium" 
                                    />
                                </div>
                                <InputError message={errors.password} className="ml-1 italic font-bold text-xs" />
                            </div>

                            {/* Checkbox */}
                            <div className="flex items-center space-x-3 px-1 mt-1">
                                <Checkbox id="remember" name="remember" tabIndex={3} className="rounded" />
                                <Label htmlFor="remember" className="text-xs font-bold uppercase text-muted-foreground cursor-pointer">
                                    Rimani collegato
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                className="h-12 w-full rounded-xl transition-all duration-300 shadow-md group mt-2 font-black uppercase italic tracking-widest text-sm" 
                                tabIndex={4} 
                                disabled={processing}
                            >
                                {processing ? (
                                    <Spinner className="mr-2" />
                                ) : (
                                    <LogIn className="mr-2 group-hover:translate-x-1 transition-transform" size={18} />
                                )}
                                Accedi
                            </Button>
                        </div>

                        {/* Link Registrazione */}
                        {canRegister && (
                            <div className="text-center mt-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
                                    Non hai un account?{' '}
                                    <Link href={register()} className="text-foreground hover:underline underline-offset-4 font-black italic" tabIndex={6}>
                                        Registrati
                                    </Link>
                                </p>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </>
    );
}

//Login.layout = { title: 'Login - TEMPRA', description: 'Accedi al tuo pannello di controllo.' };