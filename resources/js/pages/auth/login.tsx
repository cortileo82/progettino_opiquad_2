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
import { IndexHeader } from '@/components/custom/index-header';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    return (
        <>
            {/* Titolo e sottotitolo visualizzato nella pagina */}
            <Head title="Login - TEMPRA" />
            <IndexHeader subtitle="Accedi alla tua area riservata"/>
            
            {status && (
                <div className="mb-6 p-4 bg-green-500/10 rounded-xl text-green-500 text-xs font-bold uppercase italic text-center border border-green-500/20">
                    {status}
                </div>
            )}

            {/* Form di login con email e password, checkbox oper rimanere collegato e pulsante di invio */}
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

                            {/* Checkbox per rimanere collegato*/}
                            <div className="flex items-center space-x-3 px-1 mt-1">
                                <Checkbox id="remember" name="remember" tabIndex={3} className="rounded" />
                                <Label htmlFor="remember" className="text-xs font-bold uppercase text-muted-foreground cursor-pointer">
                                    Rimani collegato
                                </Label>
                            </div>

                            {/* Submit Button Tradizionale */}
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

                            {/* --- Linea di separazione tra il pulsante 'Accedi' e 'Continua con google' --- */}
                            <div className="relative my-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-sidebar-border opacity-50"></span>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-black italic tracking-widest text-muted-foreground">
                                    <span className="bg-background px-4">Oppure</span>
                                </div>
                            </div>

                            {/* Bottone google */}
                            <a href="/auth/google" 
                                className="h-12 w-full flex items-center justify-center gap-3 
                                           bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 
                                           border border-zinc-950 dark:border-white rounded-xl 
                                           transition-all duration-300 shadow-lg
                                           hover:bg-zinc-800 dark:hover:bg-zinc-100 
                                           hover:scale-[1.01] active:scale-[0.98] 
                                           font-black uppercase italic tracking-widest text-xs group">
                                {/* SVG immagine di Google */}
                                <div className="bg-white p-1 rounded-lg shadow-sm">
                                    <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                </div>
                                <span>Continua con Google</span>
                            </a>

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