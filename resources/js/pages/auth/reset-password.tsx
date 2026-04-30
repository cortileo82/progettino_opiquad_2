import { Form, Head } from '@inertiajs/react';
import { Mail, Lock, ShieldCheck, LogIn } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';
import { IndexHeader } from '@/components/custom/index-header';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <>
            <Head title="Reset Password - TEMPRA" />

            <IndexHeader subtitle="Imposta la tua nuova password" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Input Email - Sola lettura */}
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
                                        value={email}
                                        readOnly
                                        className="h-12 pl-10 bg-background border-sidebar-border rounded-xl font-medium text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                                <InputError message={errors.email} className="ml-1 italic font-bold text-xs" />
                            </div>

                            {/* Nuova Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Nuova Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        autoFocus
                                        tabIndex={1}
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
                                        tabIndex={2}
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="h-12 pl-10 bg-background border-sidebar-border rounded-xl focus:ring-2 focus:ring-primary transition-all font-medium"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="ml-1 italic font-bold text-xs" />
                            </div>

                            {/* Pulsante Submit */}
                            <Button
                                type="submit"
                                className="h-12 w-full rounded-xl transition-all duration-300 shadow-md group mt-2 font-black uppercase italic tracking-widest text-sm"
                                tabIndex={3}
                                disabled={processing}
                            >
                                {processing ? (
                                    <Spinner className="mr-2" />
                                ) : (
                                    <LogIn className="mr-2 group-hover:translate-x-1 transition-transform" size={18} />
                                )}
                                Salva Password
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}