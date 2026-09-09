import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    GraduationCap,
    MessagesSquare,
    LayoutDashboard,
    Route as RouteIcon,
    Menu,
    LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { to: '/', label: 'Tutor Socrático', icon: MessagesSquare, end: true },
    { to: '/tablero', label: 'Tablero Comunitario', icon: LayoutDashboard },
    { to: '/rutas', label: 'Rutas de Estudio', icon: RouteIcon },
];

function LogoMark({ compact = false }) {
    return (
        <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-900 to-primary text-white shadow-sm">
                <GraduationCap className="h-5 w-5" strokeWidth={2} />
            </span>
            {!compact && (
                <span className="leading-tight">
                    <span className="block font-display text-lg font-semibold text-navy-900">EduLocal AI</span>
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Tutoría Adaptativa Comunitarias
                    </span>
                </span>
            )}
        </Link>
    );
}

function NavItems({ onNavigate }) {
    return (
        <nav className="space-y-1" aria-label="Navegación principal">
            {NAV_ITEMS.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                        cn(
                            'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            isActive
                                ? 'bg-white/10 text-white'
                                : 'text-navy-100/70 hover:bg-white/5 hover:text-white',
                        )
                    }
                >
                    {({ isActive }) => (
                        <>
                            <item.icon
                                className={cn(
                                    'h-5 w-5 shrink-0',
                                    isActive ? 'text-emerald-400' : 'text-navy-100/50 group-hover:text-navy-100',
                                )}
                                strokeWidth={2}
                            />
                            {item.label}
                            {isActive && (
                                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400" />
                            )}
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}

function UserMenu() {
    const { user, isAuthed, logout } = useAuth();
    const navigate = useNavigate();

    if (!isAuthed || !user) {
        return (
            <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="text-navy-900">
                    <Link to="/login">Iniciar sesión</Link>
                </Button>
                <Button asChild className="hidden sm:inline-flex">
                    <Link to="/signup">Crear cuenta</Link>
                </Button>
            </div>
        );
    }

    const displayName = user.name || user.email?.split('@')[0] || 'Estudiante';
    const initials = displayName
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 text-sm font-medium text-navy-900 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                        {initials}
                    </span>
                    <span className="hidden max-w-[10rem] truncate sm:block">{displayName}</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate text-xs text-muted-foreground">
                    {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onSelect={() => {
                        logout();
                        navigate('/');
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function AppShell() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-dvh bg-background">
            <header className="fixed inset-x-0 top-0 z-40 h-16 border-b bg-card/95 backdrop-blur">
                <div className="flex h-full items-center gap-3 px-4 md:px-6">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <button
                                type="button"
                                aria-label="Abrir menú"
                                className="flex h-10 w-10 items-center justify-center rounded-lg text-navy-900 transition-colors hover:bg-secondary md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 border-navy-800 bg-navy-900 p-0">
                            <div className="border-b border-white/10 p-4">
                                <span className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                                        <GraduationCap className="h-5 w-5" />
                                    </span>
                                    <span className="leading-tight">
                                        <span className="block font-display text-lg font-semibold text-white">
                                            EduLocal AI
                                        </span>
                                        <span className="block text-[11px] font-medium uppercase tracking-wider text-navy-100/60">
                                            Tutoría Adaptativa Comunitarias
                                        </span>
                                    </span>
                                </span>
                            </div>
                            <div className="p-3">
                                <NavItems onNavigate={() => setMobileOpen(false)} />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <LogoMark />

                    <div className="ml-auto">
                        <UserMenu />
                    </div>
                </div>
            </header>

            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-navy-900 pt-16 md:flex">
                <div className="flex-1 overflow-y-auto px-3 py-6">
                    <NavItems />
                </div>
                <div className="border-t border-white/10 p-4">
                    <div className="rounded-xl bg-white/5 p-3">
                        <p className="flex items-center gap-2 text-xs font-medium text-white">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            Comunidad activa
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-navy-100/60">
                            1.284 vecinos y vecinas aprendiendo esta semana.
                        </p>
                    </div>
                </div>
            </aside>

            <main className="pt-16 md:pl-64">
                <div className="mx-auto w-full max-w-6xl p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
