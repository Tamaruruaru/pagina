import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export default function SignupPage() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        setLoading(true);

        try {
            await signup(email.trim(), password, { name: name.trim() });
            toast({
                title: 'Cuenta creada',
                description: 'Te enviamos un correo de verificación. Confírmalo para chatear con el tutor.',
            });
            navigate('/');
        } catch (err) {
            const message = err?.data?.email?.message
                ? 'Este correo ya está registrado. Prueba iniciar sesión.'
                : 'No se pudo crear la cuenta. Revisa los datos e inténtalo de nuevo.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Crear cuenta · EduLocal AI</title>
                <meta name="description" content="Crea tu cuenta gratuita en EduLocal AI y accede al tutor socrático, las rutas de estudio y el tablero comunitario." />
            </Helmet>

            <div className="flex min-h-dvh items-center justify-center bg-background p-4">
                <div className="w-full max-w-sm">
                    <Link to="/" className="flex flex-col items-center gap-3 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-primary text-white shadow-sm">
                            <GraduationCap className="h-6 w-6" />
                        </span>
                        <span>
                            <span className="block font-display text-xl font-semibold text-navy-900">EduLocal AI</span>
                            <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                Tutoría Adaptativa Comunitarias
                            </span>
                        </span>
                    </Link>

                    <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
                        <h1 className="font-display text-lg font-semibold text-navy-900">Crear cuenta</h1>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Gratis, comunitaria y sin suscripciones.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Tu nombre"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="tucorreo@ejemplo.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                />
                            </div>

                            {error && (
                                <p className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    {error}
                                </p>
                            )}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
                            </Button>
                        </form>
                    </div>

                    <p className="mt-4 text-center text-xs text-muted-foreground">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
