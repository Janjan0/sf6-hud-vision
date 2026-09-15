import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, FileVideo, Upload, X } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { SourceBadge } from "@/components/app/indicators";
import { useBackendStatus } from "@/components/app/BackendStatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { analysisService } from "@/services/analysisService";
import { hudService } from "@/services/hudService";
import { formatBytes, formatTimecode } from "@/lib/format";
import type { AnalysisProgress } from "@/types/streammind";

export const Route = createFileRoute("/analyzer")({
  head: () => ({
    meta: [
      { title: "Analizador de partidas — StreamMindAI" },
      {
        name: "description",
        content:
          "Sube un vídeo de Street Fighter 6 y lánzalo al detector Python/OpenCV para extraer eventos y highlights.",
      },
      { property: "og:title", content: "Analizador de partidas — StreamMindAI" },
      {
        property: "og:description",
        content: "Sube un vídeo de SF6 y analiza eventos, daño, drive y highlights.",
      },
    ],
  }),
  component: Analyzer,
});

const STATE_LABEL: Record<string, string> = {
  idle: "En espera",
  uploading: "Subiendo vídeo",
  processing: "Procesando",
  detecting_hud: "Detectando HUD",
  analyzing: "Analizando jugadas",
  generating_results: "Generando resultados",
  completed: "Completado",
  error: "Error",
};

function Analyzer() {
  const navigate = useNavigate();
  const { status } = useBackendStatus();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<{ duration: number; width: number; height: number } | null>(null);
  const [detector, setDetector] = useState("v1");
  const [progress, setProgress] = useState<AnalysisProgress>({ state: "idle", progress: null });

  const detectors = useQuery({
    queryKey: ["detectors"],
    queryFn: () => hudService.listDetectorVersions(),
  });

  useEffect(() => {
    const first = detectors.data?.data.find((d) => d.available);
    if (first) setDetector((d) => (d === "v1" ? first.id : d));
  }, [detectors.data]);

  useEffect(() => {
    if (!file) return setMeta(null);
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      setMeta({ duration: v.duration, width: v.videoWidth, height: v.videoHeight });
      URL.revokeObjectURL(url);
    };
    v.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const id = progress.analysisId;
    if (!id || progress.state === "completed" || progress.state === "error") return;
    const t = setInterval(async () => {
      try {
        const p = await analysisService.getProgress(id);
        setProgress(p);
        if (p.state === "completed") navigate({ to: "/analysis/$id", params: { id } });
      } catch {
        setProgress({ state: "error", progress: null, error: "Se perdió la conexión" });
      }
    }, 2000);
    return () => clearInterval(t);
  }, [progress.analysisId, progress.state, navigate]);

  async function start() {
    if (!file) return;
    setProgress({ state: "uploading", progress: null });
    try {
      setProgress(await analysisService.startAnalysis(file, detector));
    } catch (e) {
      setProgress({
        state: "error",
        progress: null,
        error: (e as Error).message || "El backend no respondió",
      });
    }
  }

  const busy = ["uploading", "processing", "detecting_hud", "analyzing", "generating_results"].includes(
    progress.state,
  );

  return (
    <AppShell
      title="Analizador"
      description="Sube una partida y envíala al detector real"
      actions={detectors.data ? <SourceBadge source={detectors.data.source} /> : null}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <div
            className="panel flex flex-col items-center justify-center gap-3 border-dashed p-10 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) setFile(f);
            }}
          >
            <FileVideo className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">Arrastra tu vídeo aquí</p>
            <p className="text-xs text-muted-foreground">MP4, MOV o MKV · gameplay de SF6</p>
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              <Upload className="size-4" /> Elegir archivo
            </Button>
          </div>

          {file ? (
            <div className="panel flex items-center gap-3 p-4">
              <FileVideo className="size-5 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="label-mono">
                  {formatBytes(file.size)}
                  {meta
                    ? ` · ${meta.width}×${meta.height} · ${formatTimecode(meta.duration)}`
                    : " · leyendo metadatos…"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)} aria-label="Quitar">
                <X className="size-4" />
              </Button>
            </div>
          ) : null}

          {progress.state !== "idle" ? (
            <div className="panel space-y-2 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{STATE_LABEL[progress.state]}</span>
                <span className="label-mono">
                  {progress.progress === null ? "sin progreso reportado" : `${progress.progress}%`}
                </span>
              </div>
              <Progress value={progress.progress ?? 0} />
              {progress.message ? (
                <p className="text-xs text-muted-foreground">{progress.message}</p>
              ) : null}
              {progress.error ? <p className="text-xs text-fail">{progress.error}</p> : null}
            </div>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="panel space-y-3 p-4">
            <p className="label-mono">Versión del detector</p>
            <Select value={detector} onValueChange={setDetector}>
              <SelectTrigger>
                <SelectValue placeholder="Detector" />
              </SelectTrigger>
              <SelectContent>
                {(detectors.data?.data ?? []).map((d) => (
                  <SelectItem key={d.id} value={d.id} disabled={!d.available}>
                    {d.name}
                    {d.available ? "" : " (no disponible)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {detectors.data?.data.find((d) => d.id === detector)?.description}
            </p>
          </div>

          {status !== "online" ? (
            <div className="panel flex gap-3 border-warn/40 bg-warn/5 p-4">
              <AlertTriangle className="size-4 shrink-0 text-warn" />
              <p className="text-xs text-muted-foreground">
                No hay backend conectado, así que no se puede procesar vídeo real. Configura la URL
                del detector desde el indicador de estado del menú.
              </p>
            </div>
          ) : null}

          <Button className="w-full" disabled={!file || busy} onClick={() => void start()}>
            {busy ? "Procesando…" : "Iniciar análisis"}
          </Button>
        </aside>
      </div>
    </AppShell>
  );
}
