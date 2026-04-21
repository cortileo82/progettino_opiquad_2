import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function Register() {
    return (
        <>
            <Head title="Register - TEMPRA" />

            {/* --- HEADER TEMPRA --- */}
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
                    Crea il tuo profilo atleta
                </p>
            </div>

            {/* --- FORM REGISTRAZIONE --- */}
            <Form {...store.form()} resetOnSuccess={['password', 'password_confirmation']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            
                            {/* Nome */}
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Nome Completo
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input 
                                        id="name" 
                                        name="name" 
                                        required 
                                        autoFocus 
                                        tabIndex={1} 
                                        autoComplete="name" 
                                        placeholder="Mario Rossi" 
                                        className="h-12 pl-10 bg-background border-sidebar-border rounded-xl focus:ring-2 focus:ring-primary transition-all font-medium" 
                                    />
                                </div>
                                <InputError message={errors.name} className="ml-1 italic font-bold text-xs" />
                            </div>

                            {/* Email */}
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
                                        tabIndex={2} 
                                        autoComplete="email" 
                                        placeholder="mario@esempio.it" 
                                        className="h-12 pl-10 bg-background border-sidebar-border rounded-xl focus:ring-2 focus:ring-primary transition-all font-medium" 
                                    />
                                </div>
                                <InputError message={errors.email} className="ml-1 italic font-bold text-xs" />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <PasswordInput 
                                        id="password" 
                                        name="password" 
                                        required 
                                        tabIndex={3} 
                                        autoComplete="new-password" 
                                        placeholder="••••••••" 
                                        className="h-12 pl-10 bg-background border-sidebar-border rounded-xl focus:ring-2 focus:ring-primary transition-all font-medium" 
                                    />
                                </div>
                                <InputError message={errors.password} className="ml-1 italic font-bold text-xs" />
                            </div>

                            {/* Conferma Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Conferma Password
                                </Label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <PasswordInput 
                                        id="password_confirmation" 
                                        name="password_confirmation" 
                                        required 
                                        tabIndex={4} 
                                        autoComplete="new-password" 
                                        placeholder="••••••••" 
                                        className="h-12 pl-10 bg-background border-sidebar-border rounded-xl focus:ring-2 focus:ring-primary transition-all font-medium" 
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="ml-1 italic font-bold text-xs" />
                            </div>

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                className="h-12 w-full rounded-xl transition-all duration-300 shadow-md group mt-2 font-black uppercase italic tracking-widest text-sm" 
                                tabIndex={5} 
                                disabled={processing}
                            >
                                {processing ? (
                                    <Spinner className="mr-2" />
                                ) : (
                                    <User className="mr-2 group-hover:scale-110 transition-transform" size={18} />
                                )}
                                Registrati
                            </Button>
                        </div>

                        {/* Link Login */}
                        <div className="text-center mt-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">
                                Hai già un account?{' '}
                                <Link href={login()} className="text-foreground hover:underline underline-offset-4 font-black italic" tabIndex={6}>
                                    Accedi
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

//Register.layout = { title: 'TEMPRA | Register', description: 'Crea il tuo profilo atleta per iniziare il tuo percorso.' };