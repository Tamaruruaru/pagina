import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email.trim(), password);
            navigate('/');
        } catch {
            setError('Correo o contraseña incorrectos. Revisa tus datos e inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Iniciar sesión · EduLocal AI</title>
                <meta name="description" content="Inicia sesión en EduLocal AI para conversar con tu tutor socrático y guardar tu progreso de estudio." />
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
                        <h1 className="font-display text-lg font-semibold text-navy-900">Iniciar sesión</h1>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Retoma tu conversación con el tutor y tu progreso.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Tu contraseña"
                                />
                            </div>

                            {error && (
                                <p className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    {error}
                                </p>
                            )}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Entrando…' : 'Entrar'}
                            </Button>
                        </form>
                    </div>

                    <p className="mt-4 text-center text-xs text-muted-foreground">
                        ¿Aún no tienes cuenta?{' '}
                        <Link to="/signup" className="font-semibold text-primary hover:underline">
                            Crea una gratis
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
