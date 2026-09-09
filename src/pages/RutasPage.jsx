import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import {
    Calculator,
    BookOpen,
    Code2,
    FlaskConical,
    Check,
    Clock,
    LogIn,
    MessagesSquare,
    Trophy,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { LEARNING_PATHS } from '@/lib/learning-paths';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ICONS = {
    calculator: Calculator,
    book: BookOpen,
    code: Code2,
    flask: FlaskConical,
};

const LEVEL_STYLES = {
    Inicial: 'bg-emerald-100 text-emerald-700',
    Intermedio: 'bg-blue-100 text-blue-700',
};

function ProgressBar({ value }) {
    return (
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
            <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${value}%` }}
            />
        </div>
    );
}

export default function RutasPage() {
    const { user, isAuthed } = useAuth();
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(LEARNING_PATHS[0].id);
    const [progress, setProgress] = useState({});
    const recordIds = useRef({});

    useEffect(() => {
        if (!isAuthed || !user) return;
        let cancelled = false;

        pb.collection('path_progress')
            .getFullList({ filter: pb.filter('user = {:uid}', { uid: user.id }) })
            .then((records) => {
                if (cancelled) return;
                const loaded = {};
                records.forEach((record) => {
                    loaded[record.pathId] = Array.isArray(record.completedLessons) ? record.completedLessons : [];
                    recordIds.current[record.pathId] = record.id;
                });
                setProgress(loaded);
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [isAuthed, user]);

    const toggleLesson = async (pathId, lessonId) => {
        const current = progress[pathId] ?? [];
        const next = current.includes(lessonId)
            ? current.filter((id) => id !== lessonId)
            : [...current, lessonId];

        setProgress((prev) => ({ ...prev, [pathId]: next }));

        if (!isAuthed || !user) return;

        try {
            const existingId = recordIds.current[pathId];
            if (existingId) {
                await pb.collection('path_progress').update(existingId, { completedLessons: next });
            } else {
                const record = await pb.collection('path_progress').create({
                    user: user.id,
                    pathId,
                    completedLessons: next,
                });
                recordIds.current[pathId] = record.id;
            }
        } catch {
            toast({
                variant: 'destructive',
                title: 'No se pudo guardar',
                description: 'Tu progreso no se sincronizó. Inténtalo de nuevo.',
            });
        }
    };

    const selected = useMemo(
        () => LEARNING_PATHS.find((path) => path.id === selectedId) ?? LEARNING_PATHS[0],
        [selectedId],
    );

    const totals = useMemo(() => {
        const all = LEARNING_PATHS.reduce((sum, path) => sum + path.lessons.length, 0);
        const done = LEARNING_PATHS.reduce((sum, path) => sum + (progress[path.id]?.length ?? 0), 0);
        return { all, done, percent: all ? Math.round((done / all) * 100) : 0 };
    }, [progress]);

    const selectedDone = progress[selected.id]?.length ?? 0;
    const selectedPercent = Math.round((selectedDone / selected.lessons.length) * 100);
    const nextLesson = selected.lessons.find((lesson) => !(progress[selected.id] ?? []).includes(lesson.id));
    const SelectedIcon = ICONS[selected.icon];

    const practiceWithTutor = () => {
        const topic = nextLesson ? nextLesson.title : selected.title;
        navigate('/', {
            state: {
                prompt: `Estoy siguiendo la ruta «${selected.title}» y quiero practicar «${topic}». Guíame con preguntas socráticas.`,
            },
        });
    };

    return (
        <>
            <Helmet>
                <title>Rutas de Estudio · EduLocal AI</title>
                <meta name="description" content="Rutas de aprendizaje comunitarias de EduLocal AI con progreso visual: matemáticas, lectura crítica, programación y ciencias." />
            </Helmet>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-navy-900 md:text-3xl">
                        Rutas de Estudio
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Aprende paso a paso y marca cada lección completada.
                    </p>
                </div>
                <div className="rounded-2xl border bg-card px-4 py-3 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground">Progreso total</p>
                    <div className="mt-1.5 flex items-center gap-3">
                        <ProgressBar value={totals.percent} />
                        <span className="whitespace-nowrap text-sm font-bold tabular-nums text-navy-900">
                            {totals.done}/{totals.all}
                        </span>
                    </div>
                </div>
            </div>

            {!isAuthed && (
                <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center">
                    <p className="flex items-start gap-2 text-sm text-navy-900">
                        <LogIn className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        Puedes explorar y marcar lecciones, pero para guardar tu progreso entre
                        dispositivos necesitas una cuenta.
                    </p>
                    <Button asChild size="sm" className="sm:ml-auto">
                        <Link to="/signup">Crear cuenta gratis</Link>
                    </Button>
                </div>
            )}

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                <div className="space-y-3">
                    {LEARNING_PATHS.map((path) => {
                        const Icon = ICONS[path.icon];
                        const done = progress[path.id]?.length ?? 0;
                        const percent = Math.round((done / path.lessons.length) * 100);
                        const isSelected = path.id === selectedId;
                        const isComplete = percent === 100;

                        return (
                            <button
                                key={path.id}
                                type="button"
                                onClick={() => setSelectedId(path.id)}
                                aria-pressed={isSelected}
                                className={cn(
                                    'w-full rounded-2xl border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
                                    isSelected ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/30',
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white', path.accent)}>
                                        <Icon className="h-5 w-5" strokeWidth={2} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h2 className="truncate font-display text-base font-semibold text-navy-900">
                                                {path.title}
                                            </h2>
                                            {isComplete && <Trophy className="h-4 w-4 shrink-0 text-emerald-500" />}
                                        </div>
                                        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                            {path.description}
                                        </p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <ProgressBar value={percent} />
                                            <span className="whitespace-nowrap text-xs font-semibold tabular-nums text-navy-900">
                                                {percent}%
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                                            <span className={cn('rounded-full px-2 py-0.5 font-semibold', LEVEL_STYLES[path.level])}>
                                                {path.level}
                                            </span>
                                            <span>{done} de {path.lessons.length} lecciones</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start">
                    <div className="rounded-2xl border bg-card shadow-sm">
                        <div className="border-b p-5">
                            <div className="flex items-center gap-3">
                                <span className={cn('flex h-12 w-12 items-center justify-center rounded-xl text-white', selected.accent)}>
                                    <SelectedIcon className="h-6 w-6" strokeWidth={2} />
                                </span>
                                <div>
                                    <h2 className="font-display text-lg font-semibold text-navy-900">{selected.title}</h2>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedDone} de {selected.lessons.length} lecciones · {selectedPercent}% completado
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <ProgressBar value={selectedPercent} />
                            </div>
                        </div>

                        <ul className="divide-y">
                            {selected.lessons.map((lesson, index) => {
                                const done = (progress[selected.id] ?? []).includes(lesson.id);
                                return (
                                    <li key={lesson.id}>
                                        <button
                                            type="button"
                                            onClick={() => toggleLesson(selected.id, lesson.id)}
                                            className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-secondary/60"
                                            aria-pressed={done}
                                        >
                                            <span
                                                className={cn(
                                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                                    done
                                                        ? 'border-emerald-500 bg-emerald-500 text-white'
                                                        : 'border-input bg-card text-transparent',
                                                )}
                                            >
                                                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                            </span>
                                            <span className="w-6 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span
                                                className={cn(
                                                    'flex-1 text-sm font-medium',
                                                    done ? 'text-muted-foreground line-through' : 'text-foreground',
                                                )}
                                            >
                                                {lesson.title}
                                            </span>
                                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {lesson.minutes} min
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="border-t p-5">
                            <Button onClick={practiceWithTutor} className="w-full">
                                <MessagesSquare className="mr-2 h-4 w-4" />
                                {nextLesson ? `Practicar «${nextLesson.title}» con el tutor` : 'Repasar con el tutor'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
