import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';
import { Lock } from 'lucide-react';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm password - TEMPRA" />

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
                    Conferma Sicurezza
                </p>
            </div>

            <div className="mb-6 text-center px-2">
                <p className="text-xs font-bold text-muted-foreground leading-relaxed uppercase italic">
                    Questa è un'area protetta. Conferma la tua password per continuare.
                </p>
            </div>

            <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <PasswordInput 
                                    id="password" 
                                    name="password" 
                                    placeholder="••••••••" 
                                    autoComplete="current-password" 
                                    autoFocus 
                                    className="h-12 pl-10 bg-background border-sidebar-border rounded-xl focus:ring-2 focus:ring-primary transition-all font-medium" 
                                />
                            </div>
                            <InputError message={errors.password} className="ml-1 italic font-bold text-xs" />
                        </div>
                        
                        <Button 
                            type="submit" 
                            className="h-12 w-full rounded-xl transition-all duration-300 shadow-md group mt-2 font-black uppercase italic tracking-widest text-sm" 
                            disabled={processing} 
                            data-test="confirm-password-button"
                        >
                            {processing && <Spinner className="mr-2" />}
                            Conferma Password
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

//ConfirmPassword.layout = { title: 'Confirm your password', description: 'This is a secure area of the application. Please confirm your password before continuing.' };