import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import {
    GraduationCap,
    Send,
    Trash2,
    MailWarning,
    Lightbulb,
    HelpCircle,
    Target,
    Route as RouteIcon,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIntegratedAi } from '@/hooks/use-integrated-ai';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
    'Quiero entender las fracciones',
    '¿Cómo empiezo a programar desde cero?',
    'Explícame la fotosíntesis con un ejemplo de mi barrio',
    'Ayúdame a escribir mejores párrafos',
];

const METHOD_STEPS = [
    { icon: HelpCircle, title: 'Pregunta guía', text: 'El tutor te pregunta antes de explicar.' },
    { icon: Lightbulb, title: 'Razonamiento propio', text: 'Descubres la respuesta paso a paso.' },
    { icon: Target, title: 'Mini-reto final', text: 'Cierras el tema con una autoevaluación.' },
];

function AuthGate() {
    return (
        <div className="flex min-h-[60dvh] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-primary text-white">
                    <GraduationCap className="h-7 w-7" />
                </span>
                <h1 className="mt-5 font-display text-2xl font-semibold text-navy-900">
                    Tu tutor socrático te espera
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Inicia sesión o crea tu cuenta gratuita para conversar con el tutor, guardar tu
                    historial y retomar donde lo dejaste.
                </p>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <Button asChild>
                        <Link to="/signup">Crear cuenta gratis</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to="/login">Iniciar sesión</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

function VerifyBanner({ email }) {
    const [sending, setSending] = useState(false);

    const resend = async () => {
        setSending(true);
        try {
            await pb.collection('users').requestVerification(email);
            toast({ title: 'Correo enviado', description: 'Revisa tu bandeja de entrada y spam.' });
        } catch {
            toast({ variant: 'destructive', title: 'No se pudo enviar', description: 'Inténtalo de nuevo en unos minutos.' });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 border-b bg-amber-50 px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3 text-sm text-amber-900">
                <MailWarning className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <p>
                    <span className="font-semibold">Confirma tu correo para chatear.</span> Te enviamos
                    un enlace de verificación a <span className="font-medium">{email}</span>.
                </p>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={resend}
                disabled={sending}
                className="border-amber-300 bg-white text-amber-800 hover:bg-amber-100 sm:ml-auto"
            >
                {sending ? 'Enviando…' : 'Reenviar correo'}
            </Button>
        </div>
    );
}

function MessageBubble({ message, isStreaming, isLast }) {
    const isUser = message.role === 'user';
    const showTyping = !isUser && isStreaming && isLast && !message.content;

    return (
        <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
            {!isUser && (
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-white">
                    <GraduationCap className="h-4 w-4" />
                </span>
            )}
            <div
                className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]',
                    isUser
                        ? 'rounded-br-md bg-primary text-primary-foreground'
                        : 'rounded-bl-md border bg-card text-card-foreground shadow-sm',
                )}
            >
                {showTyping ? (
                    <span className="flex items-center gap-1 py-1" aria-label="El tutor está escribiendo">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                    </span>
                ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                )}
                {message.images?.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt="Imagen generada por el tutor"
                        className="mt-2 max-w-full rounded-lg"
                        loading="lazy"
                    />
                ))}
            </div>
        </div>
    );
}

export default function TutorPage() {
    const { user, isAuthed } = useAuth();
    const { messages, isStreaming, isLoadingHistory, sendMessage, clearMessages } = useIntegratedAi();
    const [input, setInput] = useState('');
    const location = useLocation();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (location.state?.prompt) {
            setInput(location.state.prompt);
        }
    }, [location.state]);

    useEffect(() => {
        if (!isAuthed) return undefined;
        const refresh = () => pb.collection('users').authRefresh().catch(() => {});
        refresh();
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, [isAuthed]);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const needsVerification = Boolean(isAuthed && user && !user.verified);

    const handleSend = (text) => {
        const trimmed = (text ?? input).trim();
        if (!trimmed || isStreaming || needsVerification) return;
        setInput('');
        sendMessage(trimmed);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSend();
    };

    if (!isAuthed) {
        return (
            <>
                <Helmet>
                    <title>Tutor Socrático · EduLocal AI</title>
                    <meta name="description" content="Conversa con el Tutor Socrático de EduLocal AI: aprendizaje adaptativo mediante preguntas guía, para toda la comunidad." />
                </Helmet>
                <AuthGate />
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Tutor Socrático · EduLocal AI</title>
                <meta name="description" content="Conversa con el Tutor Socrático de EduLocal AI: aprendizaje adaptativo mediante preguntas guía, para toda la comunidad." />
            </Helmet>

            <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
                <section className="flex h-[calc(100dvh-9.5rem)] min-h-[26rem] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <header className="flex items-center gap-3 border-b px-4 py-3">
                        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white">
                            <GraduationCap className="h-5 w-5" />
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
                        </span>
                        <div className="min-w-0">
                            <h1 className="font-display text-base font-semibold text-navy-900">Tutor Socrático</h1>
                            <p className="text-xs text-muted-foreground">
                                {isStreaming ? 'Escribiendo…' : 'En línea · aprende con preguntas'}
                            </p>
                        </div>
                        {messages.length > 0 && (
                            <button
                                type="button"
                                onClick={clearMessages}
                                disabled={isStreaming}
                                className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                                aria-label="Limpiar conversación"
                                title="Limpiar conversación"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </header>

                    {needsVerification && <VerifyBanner email={user.email} />}

                    <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-background/60 p-4">
                        {isLoadingHistory ? (
                            <div className="space-y-4">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className={cn('flex', i % 2 ? 'justify-end' : 'justify-start')}>
                                        <div className="h-14 w-2/3 animate-pulse rounded-2xl bg-muted" />
                                    </div>
                                ))}
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-navy-900">
                                    <GraduationCap className="h-7 w-7" />
                                </span>
                                <h2 className="mt-4 font-display text-xl font-semibold text-navy-900">
                                    ¿Qué quieres aprender hoy?
                                </h2>
                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    El tutor no te da la respuesta: te hace las preguntas correctas para
                                    que la descubras tú.
                                </p>
                                <div className="mt-5 grid w-full max-w-md gap-2 sm:grid-cols-2">
                                    {SUGGESTIONS.map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() => handleSend(suggestion)}
                                            disabled={needsVerification}
                                            className="rounded-xl border bg-card px-3 py-2.5 text-left text-xs font-medium text-navy-900 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <MessageBubble
                                    key={index}
                                    message={message}
                                    isStreaming={isStreaming}
                                    isLast={index === messages.length - 1}
                                />
                            ))
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="border-t bg-card p-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                placeholder={
                                    needsVerification
                                        ? 'Confirma tu correo para empezar…'
                                        : 'Escribe tu duda o tema de estudio…'
                                }
                                disabled={isStreaming || needsVerification}
                                className="h-11 flex-1 rounded-xl border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isStreaming || needsVerification || !input.trim()}
                                className="h-11 w-11 rounded-xl"
                                aria-label="Enviar mensaje"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </section>

                <aside className="hidden space-y-4 xl:block">
                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <h2 className="font-display text-base font-semibold text-navy-900">Método socrático</h2>
                        <ol className="mt-4 space-y-4">
                            {METHOD_STEPS.map((step, index) => (
                                <li key={step.title} className="flex gap-3">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                        <step.icon className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {index + 1}. {step.title}
                                        </p>
                                        <p className="text-xs leading-relaxed text-muted-foreground">{step.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="rounded-2xl border bg-navy-900 p-5 text-white shadow-sm">
                        <h2 className="font-display text-base font-semibold">Combina con una ruta</h2>
                        <p className="mt-2 text-xs leading-relaxed text-navy-100/70">
                            Refuerza lo que conversas con el tutor siguiendo una ruta de estudio con
                            progreso visual.
                        </p>
                        <Button asChild variant="secondary" size="sm" className="mt-4 w-full">
                            <Link to="/rutas">
                                <RouteIcon className="mr-2 h-4 w-4" />
                                Ver rutas de estudio
                            </Link>
                        </Button>
                    </div>
                </aside>
            </div>
        </>
    );
}
