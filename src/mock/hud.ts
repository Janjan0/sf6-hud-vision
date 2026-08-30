/** DEMO DATA ONLY — simulates the payload shape of the Python/OpenCV HUD detector. */
import type {
  AnchorDetection,
  DetectionEvent,
  DetectorVersion,
  FrameDetection,
  HudElementId,
  HudRegion,
  HudSession,
} from "@/types/streammind";

export const demoDetectorVersions: DetectorVersion[] = [
  {
    id: "hud-v1",
    name: "HUD Detector v1",
    description: "Anchor templates + fixed relative regions. Baseline reference.",
    available: true,
  },
  {
    id: "hud-v2",
    name: "HUD Detector v2",
    description: "Color-space anchors with adaptive relative regions and bar sampling.",
    available: true,
  },
  {
    id: "hud-v3",
    name: "HUD Detector v3",
    description: "ML anchor proposal + OCR refinement. Not yet deployed in Termux.",
    available: false,
  },
];

export const demoHudSession: HudSession = {
  id: "hud-demo",
  sourceName: "DEMO clip — no backend connected",
  width: 1920,
  height: 1080,
  fps: 60,
  duration: 52,
  frameCount: 3120,
  detectorVersion: "hud-v1",
  createdAt: "2026-08-27T20:20:00.000Z",
};

/**
 * Anchor layout expressed in normalized frame coordinates.
 * The detector is expected to return these; the UI never assumes them.
 */
const BASE_ANCHORS: Omit<AnchorDetection, "confidence" | "detected">[] = [
  {
    id: "P1_ANCHOR",
    label: "P1 HUD Anchor",
    side: "P1",
    normalizedX: 0.045,
    normalizedY: 0.042,
    normalizedWidth: 0.06,
    normalizedHeight: 0.055,
    method: "template",
  },
  {
    id: "P2_ANCHOR",
    label: "P2 HUD Anchor",
    side: "P2",
    normalizedX: 0.895,
    normalizedY: 0.042,
    normalizedWidth: 0.06,
    normalizedHeight: 0.055,
    method: "template",
  },
  {
    id: "CENTER_ANCHOR",
    label: "Center / Timer Anchor",
    side: "CENTER",
    normalizedX: 0.468,
    normalizedY: 0.03,
    normalizedWidth: 0.064,
    normalizedHeight: 0.085,
    method: "edge",
  },
  {
    id: "ROUND_ANCHOR",
    label: "Round Marker Anchor",
    side: "CENTER",
    normalizedX: 0.455,
    normalizedY: 0.125,
    normalizedWidth: 0.09,
    normalizedHeight: 0.028,
    method: "color",
  },
];

/**
 * Regions are declared RELATIVE to their anchor (multiples of the anchor box).
 * The demo derives normalized coordinates the same way the backend would.
 */
interface RegionTemplate {
  id: HudElementId;
  label: string;
  kind: HudRegion["kind"];
  anchor: AnchorDetection["id"];
  side: HudRegion["side"];
  relativeX: number;
  relativeY: number;
  relativeWidth: number;
  relativeHeight: number;
}

const REGION_TEMPLATES: RegionTemplate[] = [
  { id: "P1_HEALTH", label: "P1 Health", kind: "health", anchor: "P1_ANCHOR", side: "P1", relativeX: 1.1, relativeY: -0.1, relativeWidth: 6.2, relativeHeight: 0.5 },
  { id: "P2_HEALTH", label: "P2 Health", kind: "health", anchor: "P2_ANCHOR", side: "P2", relativeX: -7.3, relativeY: -0.1, relativeWidth: 6.2, relativeHeight: 0.5 },
  { id: "P1_DRIVE", label: "P1 Drive", kind: "drive", anchor: "P1_ANCHOR", side: "P1", relativeX: 1.1, relativeY: 1.55, relativeWidth: 5.4, relativeHeight: 0.3 },
  { id: "P2_DRIVE", label: "P2 Drive", kind: "drive", anchor: "P2_ANCHOR", side: "P2", relativeX: -6.5, relativeY: 1.55, relativeWidth: 5.4, relativeHeight: 0.3 },
  { id: "P1_SUPER", label: "P1 Super", kind: "super", anchor: "P1_ANCHOR", side: "P1", relativeX: 0.2, relativeY: 14.2, relativeWidth: 4.4, relativeHeight: 0.55 },
  { id: "P2_SUPER", label: "P2 Super", kind: "super", anchor: "P2_ANCHOR", side: "P2", relativeX: -3.6, relativeY: 14.2, relativeWidth: 4.4, relativeHeight: 0.55 },
  { id: "TIMER", label: "Timer", kind: "timer", anchor: "CENTER_ANCHOR", side: "CENTER", relativeX: 0, relativeY: 0, relativeWidth: 1, relativeHeight: 1 },
  { id: "ROUND", label: "Round Markers", kind: "round", anchor: "ROUND_ANCHOR", side: "CENTER", relativeX: 0, relativeY: 0, relativeWidth: 1, relativeHeight: 1 },
  { id: "KO", label: "KO Banner", kind: "ko", anchor: "CENTER_ANCHOR", side: "CENTER", relativeX: -3.2, relativeY: 4.6, relativeWidth: 7.4, relativeHeight: 2.4 },
];

function seeded(frame: number, salt: number): number {
  const x = Math.sin(frame * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function clamp(v: number, lo = 0, hi = 1) {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * Produces a deterministic demo detection for a frame so the HUD Lab can be
 * exercised end-to-end before the real detector exists.
 */
export function demoFrameDetection(frame: number, detectorVersion: string): FrameDetection {
  const fps = demoHudSession.fps;
  const jitter = (seeded(frame, 1) - 0.5) * 0.004;
  const v2 = detectorVersion === "hud-v2";

  const anchors: AnchorDetection[] = BASE_ANCHORS.map((a, i) => {
    const noise = seeded(frame, i + 2);
    const missing = a.id === "P2_ANCHOR" && noise > 0.94;
    const base = v2 ? 95 : 92;
    return {
      ...a,
      normalizedX: clamp(a.normalizedX + jitter),
      detected: !missing,
      confidence: missing ? 0 : Math.round(base + noise * 5),
    };
  });

  const anchorById = new Map(anchors.map((a) => [a.id, a]));

  const regions: HudRegion[] = REGION_TEMPLATES.map((t, i) => {
    const anchor = anchorById.get(t.anchor);
    const noise = seeded(frame, i + 20);
    const anchorOk = anchor?.detected ?? false;

    const nx = anchor ? anchor.normalizedX + t.relativeX * anchor.normalizedWidth : 0;
    const ny = anchor ? anchor.normalizedY + t.relativeY * anchor.normalizedHeight : 0;
    const nw = anchor ? t.relativeWidth * anchor.normalizedWidth : 0;
    const nh = anchor ? t.relativeHeight * anchor.normalizedHeight : 0;

    const isKo = t.id === "KO";
    const koVisible = frame % 2400 > 2300;
    const detected = anchorOk && (!isKo ? true : koVisible);

    let confidence = 0;
    if (detected) {
      const penalty = t.kind === "drive" && !v2 ? 22 : 0;
      confidence = Math.round(clamp(0.9 + noise * 0.1, 0, 1) * 100 - penalty);
    }

    const ratio =
      t.kind === "health"
        ? clamp(1 - ((frame / fps) % 40) / 55 - (t.side === "P2" ? 0.08 : 0))
        : t.kind === "drive"
          ? clamp(0.35 + 0.6 * Math.abs(Math.sin(frame / 220 + i)))
          : t.kind === "super"
            ? clamp(((frame / fps) % 30) / 30)
            : null;

    const value =
      t.kind === "timer"
        ? Math.max(0, 99 - Math.floor(frame / fps))
        : t.kind === "round"
          ? `${Math.min(2, Math.floor(frame / 2400))}-0`
          : t.kind === "ko"
            ? detected
              ? "KO"
              : null
            : ratio !== null
              ? Math.round(ratio * (t.kind === "health" ? 10000 : t.kind === "drive" ? 6 : 3))
              : null;

    return {
      id: t.id,
      label: t.label,
      kind: t.kind,
      side: t.side,
      anchor: t.anchor,
      detected,
      confidence,
      relativeX: t.relativeX,
      relativeY: t.relativeY,
      relativeWidth: t.relativeWidth,
      relativeHeight: t.relativeHeight,
      normalizedX: nx,
      normalizedY: ny,
      normalizedWidth: nw,
      normalizedHeight: nh,
      value,
      ratio,
      notes: anchorOk ? undefined : "Anchor missing — region cannot be derived",
    };
  });

  return {
    frame,
    timestamp: frame / fps,
    detectorVersion,
    anchors,
    regions,
    processingMs: Math.round(8 + seeded(frame, 99) * 14),
  };
}

export function demoDetectionEvents(
  previous: FrameDetection | null,
  current: FrameDetection,
): DetectionEvent[] {
  if (!previous) return [];
  const out: DetectionEvent[] = [];
  const prevById = new Map(previous.regions.map((r) => [r.id, r]));

  for (const region of current.regions) {
    const prev = prevById.get(region.id);
    if (!prev || !region.detected || !prev.detected) continue;
    if (prev.value === region.value) continue;

    const type =
      region.kind === "health"
        ? "HEALTH_CHANGE"
        : region.kind === "drive"
          ? "DRIVE_CHANGE"
          : region.kind === "super"
            ? "SUPER_CHANGE"
            : region.kind === "timer"
              ? "TIMER_CHANGE"
              : region.kind === "ko"
                ? "KO"
                : "ROUND_START";

    out.push({
      id: `${current.frame}-${region.id}`,
      type,
      frame: current.frame,
      timestamp: current.timestamp,
      player: region.side === "P1" ? "P1" : region.side === "P2" ? "P2" : "NONE",
      previousValue: prev.value ?? null,
      newValue: region.value ?? null,
      confidence: region.confidence,
    });
  }
  return out;
}
