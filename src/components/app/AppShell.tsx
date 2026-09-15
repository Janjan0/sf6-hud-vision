import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  BookOpen,
  Brain,
  Crosshair,
  Gauge,
  History,
  LayoutDashboard,
  Menu,
  Swords,
  TrendingUp,
  Upload,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BackendStatusBadge } from "./BackendStatusBadge";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyzer", label: "Analizador", icon: Upload },
  { to: "/hud-lab", label: "HUD Lab", icon: Crosshair },
  { to: "/history", label: "Historial", icon: History },
  { to: "/coach", label: "Coach IA", icon: Brain },
  { to: "/matchups", label: "Matchups", icon: Swords },
  { to: "/glossary", label: "Glosario", icon: BookOpen },
  { to: "/progress", label: "Progreso", icon: TrendingUp },
  { to: "/profile", label: "Perfil", icon: User },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          activeProps={{ className: "bg-sidebar-accent text-primary" }}
          inactiveProps={{ className: "text-sidebar-foreground hover:bg-sidebar-accent/60" }}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
        >
          <Icon className="size-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4">
      <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
        <Activity className="size-4" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold tracking-tight">StreamMindAI</span>
        <span className="label-mono block">SF6 Analysis</span>
      </span>
    </Link>
  );
}

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Brand />
        <NavList />
        <div className="mt-auto p-3">{mounted ? <BackendStatusBadge /> : null}</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navegación</SheetTitle>
              <Brand />
              <NavList onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
            {description ? (
              <p className="truncate text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </header>

        <main className={cn("flex-1 p-4 sm:p-6")}>{children}</main>

        <footer className="flex items-center gap-2 border-t border-border px-4 py-3 label-mono">
          <Gauge className="size-3.5" />
          StreamMindAI · detección HUD anchor-first
        </footer>
      </div>
    </div>
  );
}
