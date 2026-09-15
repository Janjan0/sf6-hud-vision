import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  confidenceLevel,
  type Confidence,
  type DataSource,
  type DetectionStatus,
} from "@/types/streammind";

const LEVEL_CLASS = {
  excellent: "text-ok border-ok/40 bg-ok/10",
  good: "text-ok border-ok/30 bg-ok/5",
  warning: "text-warn border-warn/40 bg-warn/10",
  failed: "text-fail border-fail/40 bg-fail/10",
} as const;

export function ConfidenceBadge({ value }: { value: Confidence | null | undefined }) {
  const level = confidenceLevel(value);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[11px]",
        LEVEL_CLASS[level],
      )}
    >
      {value === null || value === undefined ? "—" : `${value.toFixed(1)}%`}
    </span>
  );
}

const STATUS_CLASS: Record<DetectionStatus, string> = {
  OK: "text-ok border-ok/40 bg-ok/10",
  WARNING: "text-warn border-warn/40 bg-warn/10",
  FAILED: "text-fail border-fail/40 bg-fail/10",
  NOT_DETECTED: "text-muted-foreground border-border bg-muted/40",
};

export function StatusPill({ status }: { status: DetectionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[11px] tracking-wide",
        STATUS_CLASS[status],
      )}
    >
      {status}
    </span>
  );
}

export function SourceBadge({ source }: { source: DataSource }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono text-[10px] tracking-widest",
        source === "backend" ? "border-ok/40 text-ok" : "border-warn/40 text-warn",
      )}
    >
      {source === "backend" ? "BACKEND" : "DEMO"}
    </Badge>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="panel p-4">
      <p className="label-mono">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
