import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { SourceBadge } from "@/components/app/indicators";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { analysisService, type HistoryFilters } from "@/services/analysisService";
import { formatDate, formatTimecode } from "@/lib/format";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Historial de partidas — StreamMindAI" },
      {
        name: "description",
        content:
          "Consulta y filtra todas tus partidas de Street Fighter 6 analizadas por personaje, rival y resultado.",
      },
      { property: "og:title", content: "Historial de partidas — StreamMindAI" },
      {
        property: "og:description",
        content: "Filtra tus partidas analizadas por personaje, rival y resultado.",
      },
    ],
  }),
  component: History,
});

function History() {
  const [filters, setFilters] = useState<HistoryFilters>({ result: "ALL" });
  const q = useQuery({
    queryKey: ["analyses", filters],
    queryFn: () => analysisService.listAnalyses(filters),
  });

  const rows = q.data?.data ?? [];

  return (
    <AppShell
      title="Historial"
      description={`${rows.length} partidas`}
      actions={q.data ? <SourceBadge source={q.data.source} /> : null}
    >
      <div className="space-y-4">
        <div className="panel grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <Label className="label-mono">Personaje</Label>
            <Input
              placeholder="Todos"
              value={filters.character ?? ""}
              onChange={(e) => setFilters((f) => ({ ...f, character: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label className="label-mono">Rival</Label>
            <Input
              placeholder="Todos"
              value={filters.opponent ?? ""}
              onChange={(e) => setFilters((f) => ({ ...f, opponent: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label className="label-mono">Resultado</Label>
            <Select
              value={filters.result ?? "ALL"}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, result: v as HistoryFilters["result"] }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="WIN">Victorias</SelectItem>
                <SelectItem value="LOSS">Derrotas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Switch
              id="hl"
              checked={!!filters.onlyWithHighlights}
              onCheckedChange={(v) => setFilters((f) => ({ ...f, onlyWithHighlights: v }))}
            />
            <Label htmlFor="hl" className="text-xs">
              Solo con highlights
            </Label>
          </div>
        </div>

        <div className="panel divide-y divide-border">
          {rows.map((a) => (
            <Link
              key={a.id}
              to="/analysis/$id"
              params={{ id: a.id }}
              className="grid grid-cols-2 gap-2 px-4 py-3 text-sm transition-colors hover:bg-surface-raised sm:grid-cols-6"
            >
              <span className={a.match.result === "WIN" ? "font-mono text-ok" : "font-mono text-fail"}>
                {a.match.result}
              </span>
              <span className="truncate">{a.match.character}</span>
              <span className="truncate text-muted-foreground">vs {a.match.opponentCharacter}</span>
              <span className="label-mono">{formatTimecode(a.match.duration)}</span>
              <span className="label-mono">{a.highlightCount} highlights</span>
              <span className="label-mono">{formatDate(a.match.date)}</span>
            </Link>
          ))}
          {rows.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No hay partidas que coincidan con los filtros.
            </p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
