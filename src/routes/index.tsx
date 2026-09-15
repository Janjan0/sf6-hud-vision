import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Crosshair, Upload } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { SourceBadge, StatCard } from "@/components/app/indicators";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { analysisService } from "@/services/analysisService";
import { formatDateTime, formatPercent } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StreamMindAI — Análisis de gameplay de Street Fighter 6" },
      {
        name: "description",
        content:
          "Panel de control de StreamMindAI: analiza tus partidas de SF6, detecta el HUD con anchors y recibe consejos del Coach IA.",
      },
      { property: "og:title", content: "StreamMindAI — Análisis de gameplay de SF6" },
      {
        property: "og:description",
        content: "Analiza partidas de Street Fighter 6 con detección de HUD anchor-first.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const stats = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => analysisService.getDashboardStats(),
  });
  const list = useQuery({
    queryKey: ["analyses"],
    queryFn: () => analysisService.listAnalyses(),
  });

  return (
    <AppShell
      title="Dashboard"
      description="Resumen de tu rendimiento y últimas partidas analizadas"
      actions={stats.data ? <SourceBadge source={stats.data.source} /> : null}
    >
      <div className="space-y-6">
        <section className="panel relative overflow-hidden p-6">
          <div className="tech-grid pointer-events-none absolute inset-0" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="label-mono">Pipeline de análisis</p>
              <h2 className="mt-1 text-xl font-bold">Sube una partida y detecta el HUD</h2>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                El vídeo se procesa en el detector Python/OpenCV. Mientras no haya backend
                conectado, todo lo que veas aparece marcado como DEMO.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button asChild>
                <Link to="/analyzer">
                  <Upload className="size-4" /> Analizar
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/hud-lab">
                  <Crosshair className="size-4" /> HUD Lab
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.isPending || !stats.data ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
          ) : (
            <>
              <StatCard label="Partidas analizadas" value={String(stats.data.data.analyzed)} />
              <StatCard
                label="Win rate"
                value={formatPercent(stats.data.data.winRate, 1)}
                hint={`${stats.data.data.wins}V · ${stats.data.data.losses}D`}
              />
              <StatCard label="Personaje principal" value={stats.data.data.mainCharacter} />
              <StatCard
                label="Rival frecuente"
                value={stats.data.data.frequentOpponent}
                hint={`Último análisis: ${formatDateTime(stats.data.data.lastAnalysisAt)}`}
              />
            </>
          )}
        </section>

        <section className="panel">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Últimas partidas</h2>
            <Link to="/history" className="label-mono flex items-center gap-1 hover:text-primary">
              Ver historial <ArrowRight className="size-3" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {(list.data?.data ?? []).slice(0, 5).map((a) => (
              <li key={a.id}>
                <Link
                  to="/analysis/$id"
                  params={{ id: a.id }}
                  className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-surface-raised"
                >
                  <span
                    className={`w-10 shrink-0 font-mono text-xs ${
                      a.match.result === "WIN" ? "text-ok" : "text-fail"
                    }`}
                  >
                    {a.match.result}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {a.match.character} <span className="text-muted-foreground">vs</span>{" "}
                    {a.match.opponentCharacter}
                  </span>
                  <span className="label-mono hidden sm:block">
                    {a.highlightCount} highlights · {a.eventCount} eventos
                  </span>
                  <span className="label-mono">{formatDateTime(a.createdAt)}</span>
                </Link>
              </li>
            ))}
            {list.isPending ? <li className="p-4"><Skeleton className="h-6" /></li> : null}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
