import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
    Users,
    MessagesSquare,
    Route as RouteIcon,
    Star,
    TrendingUp,
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import CountUp from '@/components/CountUp';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const KPIS = [
    { label: 'Estudiantes activos', value: 1284, delta: '+12,4%', icon: Users },
    { label: 'Sesiones de tutoría', value: 3472, delta: '+8,1%', icon: MessagesSquare },
    { label: 'Rutas completadas', value: 856, delta: '+21,3%', icon: RouteIcon },
    { label: 'Satisfacción promedio', value: 4.8, decimals: 1, suffix: '/5', delta: '+0,3', icon: Star },
];

const ACTIVITY = {
    semana: [
        { label: 'Lun', sesiones: 420, estudiantes: 210 },
        { label: 'Mar', sesiones: 510, estudiantes: 256 },
        { label: 'Mié', sesiones: 468, estudiantes: 239 },
        { label: 'Jue', sesiones: 590, estudiantes: 301 },
        { label: 'Vie', sesiones: 545, estudiantes: 278 },
        { label: 'Sáb', sesiones: 610, estudiantes: 322 },
        { label: 'Dom', sesiones: 329, estudiantes: 178 },
    ],
    mes: [
        { label: 'Sem 1', sesiones: 2980, estudiantes: 1120 },
        { label: 'Sem 2', sesiones: 3210, estudiantes: 1205 },
        { label: 'Sem 3', sesiones: 3472, estudiantes: 1284 },
        { label: 'Sem 4', sesiones: 3150, estudiantes: 1190 },
    ],
};

const TOPICS = [
    { tema: 'Matemáticas', sesiones: 420 },
    { tema: 'Lectura', sesiones: 340 },
    { tema: 'Ciencias', sesiones: 290 },
    { tema: 'Programación', sesiones: 260 },
    { tema: 'Historia', sesiones: 180 },
    { tema: 'Arte', sesiones: 120 },
];

const LEVELS = [
    { name: 'Inicial', value: 38, color: '#2b6cb0' },
    { name: 'Intermedio', value: 44, color: '#1a365d' },
    { name: 'Avanzado', value: 18, color: '#10b981' },
];

const FEED = [
    { initials: 'MG', name: 'María G.', action: 'completó «Fracciones y proporciones»', time: 'hace 12 min' },
    { initials: 'SP', name: 'Grupo de lectura San Pedro', action: 'alcanzó 200 sesiones de tutoría', time: 'hace 1 h' },
    { initials: 'LR', name: 'Luis R.', action: 'hizo su primera pregunta al Tutor Socrático', time: 'hace 2 h' },
    { initials: 'EA', name: 'Equipo EduLocal', action: 'publicó la ruta «Ciencias de la Comunidad»', time: 'hace 5 h' },
    { initials: 'AP', name: 'Ana P.', action: 'completó «Programación desde Cero»', time: 'ayer' },
];

const TOOLTIP_STYLE = {
    borderRadius: '0.75rem',
    border: '1px solid hsl(214 28% 90%)',
    background: '#fff',
    fontSize: '0.75rem',
    boxShadow: '0 4px 12px rgb(26 54 93 / 0.08)',
};

function KpiCard({ kpi }) {
    return (
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-navy-900">
                    <kpi.icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    <TrendingUp className="h-3 w-3" />
                    {kpi.delta}
                </span>
            </div>
            <p className="mt-4 text-2xl font-bold tabular-nums text-navy-900">
                <CountUp
                    value={kpi.value}
                    decimals={kpi.decimals ?? 0}
                    suffix={kpi.suffix ?? ''}
                    locale="es-ES"
                />
            </p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{kpi.label}</p>
        </div>
    );
}

export default function TableroPage() {
    const [range, setRange] = useState('semana');

    return (
        <>
            <Helmet>
                <title>Tablero Comunitario · EduLocal AI</title>
                <meta name="description" content="Métricas clave de la comunidad EduLocal AI: estudiantes activos, sesiones de tutoría, rutas completadas y temas más estudiados." />
            </Helmet>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-navy-900 md:text-3xl">
                        Tablero Comunitario
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        El pulso del aprendizaje en tu comunidad, actualizado en tiempo real.
                    </p>
                </div>
                <Tabs value={range} onValueChange={setRange}>
                    <TabsList>
                        <TabsTrigger value="semana">Esta semana</TabsTrigger>
                        <TabsTrigger value="mes">Este mes</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {KPIS.map((kpi) => (
                    <KpiCard key={kpi.label} kpi={kpi} />
                ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-2">
                    <h2 className="font-display text-base font-semibold text-navy-900">Actividad de aprendizaje</h2>
                    <p className="text-xs text-muted-foreground">Sesiones de tutoría y estudiantes activos</p>
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ACTIVITY[range]} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gradSesiones" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2b6cb0" stopOpacity={0.28} />
                                        <stop offset="100%" stopColor="#2b6cb0" stopOpacity={0.02} />
                                    </linearGradient>
                                    <linearGradient id="gradEstudiantes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.24} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 28% 90%)" vertical={false} />
                                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'hsl(215 15% 42%)' }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'hsl(215 15% 42%)' }} />
                                <Tooltip contentStyle={TOOLTIP_STYLE} />
                                <Area type="monotone" dataKey="sesiones" name="Sesiones" stroke="#2b6cb0" strokeWidth={2} fill="url(#gradSesiones)" />
                                <Area type="monotone" dataKey="estudiantes" name="Estudiantes" stroke="#10b981" strokeWidth={2} fill="url(#gradEstudiantes)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                    <h2 className="font-display text-base font-semibold text-navy-900">Nivel de la comunidad</h2>
                    <p className="text-xs text-muted-foreground">Distribución de estudiantes</p>
                    <div className="mt-2 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={LEVELS}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={52}
                                    outerRadius={76}
                                    paddingAngle={3}
                                    strokeWidth={0}
                                >
                                    {LEVELS.map((level) => (
                                        <Cell key={level.name} fill={level.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => `${value}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <ul className="mt-2 space-y-2">
                        {LEVELS.map((level) => (
                            <li key={level.name} className="flex items-center gap-2 text-xs">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: level.color }} />
                                <span className="text-muted-foreground">{level.name}</span>
                                <span className="ml-auto font-semibold tabular-nums text-foreground">{level.value}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-2">
                    <h2 className="font-display text-base font-semibold text-navy-900">Temas más estudiados</h2>
                    <p className="text-xs text-muted-foreground">Sesiones por tema esta semana</p>
                    <div className="mt-4 h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={TOPICS} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 28% 90%)" vertical={false} />
                                <XAxis dataKey="tema" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'hsl(215 15% 42%)' }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'hsl(215 15% 42%)' }} />
                                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'hsl(210 36% 94% / 0.5)' }} />
                                <Bar dataKey="sesiones" name="Sesiones" fill="#2b6cb0" radius={[6, 6, 0, 0]} maxBarSize={44} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                    <h2 className="font-display text-base font-semibold text-navy-900">Actividad reciente</h2>
                    <p className="text-xs text-muted-foreground">Logros de la comunidad</p>
                    <ul className="mt-4 divide-y">
                        {FEED.map((item) => (
                            <li key={`${item.initials}-${item.time}`} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-navy-900">
                                    {item.initials}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs leading-relaxed text-foreground">
                                        <span className="font-semibold">{item.name}</span> {item.action}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-muted-foreground">{item.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
