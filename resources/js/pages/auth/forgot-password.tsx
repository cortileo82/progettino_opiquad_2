import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password - TEMPRA" />

            {/* --- HEADER TEMPRA --- */}
            <div className="text-center mb-6 mt-2 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex justify-center mb-5">
                    <div className="p-1.5 bg-sidebar border border-sidebar-border rounded-2xl shadow-sm">
                        <img src="/images/hero.jpeg" alt="Tempra" className="w-16 h-16 rounded-xl object-cover grayscale-[0.5]" />
                    </div>
                </div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-foreground">
                    TEMPRA
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground mt-2">
                    Reset Password
                </p>
            </div>

            <div className="mb-6 text-center px-2">
                <p className="text-xs font-bold text-muted-foreground leading-relaxed uppercase italic">
                    Inserisci la tua email e ti invieremo un link per scegliere una nuova password.
                </p>
            </div>

            {status && (
                <div className="mb-6 p-4 bg-green-500/10 rounded-xl text-green-500 text-xs font-bold uppercase italic text-center border border-green-500/20">
                    {status}
                </div>
            )}

            <Form {...email.form()} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
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
                                        autoComplete="off" 
                                        autoFocus 
                                        placeholder="nome@esempio.it" 
                                        className="h-12 pl-10 bg-background border-sidebar-border rounded-xl focus:ring-2 focus:ring-primary transition-all font-medium" 
                                    />
                                </div>
                                <InputError message={errors.email} className="ml-1 italic font-bold text-xs" />
                            </div>

                            <Button 
                                type="submit" 
                                className="h-12 w-full rounded-xl transition-all duration-300 shadow-md group mt-2 font-black uppercase italic tracking-widest text-sm" 
                                disabled={processing} 
                                data-test="email-password-reset-link-button"
                            >
                                {processing ? (
                                    <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                                ) : (
                                    <Mail className="mr-2 group-hover:translate-x-1 transition-transform" size={18} />
                                )}
                                Invia Link
                            </Button>
                        </div>

                        <div className="text-center mt-2">
                            <Link href={login()} className="text-xs font-black text-muted-foreground hover:text-foreground uppercase tracking-tight transition-colors italic">
                                Torna al login
                            </Link>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

//ForgotPassword.layout = { title: 'Forgot password', description: 'Enter your email to receive a password reset link' };