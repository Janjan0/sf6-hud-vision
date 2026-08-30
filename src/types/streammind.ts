/**
 * StreamMindAI — shared data models.
 *
 * These types mirror the contract of the external Python/OpenCV backend.
 * The frontend never computes detections itself; it only renders and debugs
 * whatever the backend returns.
 */

/* ------------------------------------------------------------------ */
/* Core primitives                                                     */
/* ------------------------------------------------------------------ */

/** Confidence is always expressed 0-100, never a boolean. */
export type Confidence = number;

export type ConfidenceLevel = "excellent" | "good" | "warning" | "failed";

export function confidenceLevel(c: Confidence | null | undefined): ConfidenceLevel {
  if (c === null || c === undefined || c < 40) return "failed";
  if (c >= 90) return "excellent";
  if (c >= 75) return "good";
  return "warning";
}

export type DetectionStatus = "OK" | "WARNING" | "FAILED" | "NOT_DETECTED";

export function statusFromConfidence(
  detected: boolean,
  c: Confidence | null | undefined,
): DetectionStatus {
  if (!detected || c === null || c === undefined) return "NOT_DETECTED";
  const level = confidenceLevel(c);
  if (level === "excellent" || level === "good") return "OK";
  if (level === "warning") return "WARNING";
  return "FAILED";
}

/** Normalized box: all values are 0..1 relative to the frame. */
export interface NormalizedBox {
  normalizedX: number;
  normalizedY: number;
  normalizedWidth: number;
  normalizedHeight: number;
}

/** Box expressed relative to its parent anchor (may be negative / >1). */
export interface RelativeBox {
  relativeX: number;
  relativeY: number;
  relativeWidth: number;
  relativeHeight: number;
}

/* ------------------------------------------------------------------ */
/* HUD anchors + regions (ANCHOR FIRST architecture)                   */
/* ------------------------------------------------------------------ */

export type AnchorId = "P1_ANCHOR" | "P2_ANCHOR" | "CENTER_ANCHOR" | "ROUND_ANCHOR";

export const ANCHOR_IDS: AnchorId[] = [
  "P1_ANCHOR",
  "P2_ANCHOR",
  "CENTER_ANCHOR",
  "ROUND_ANCHOR",
];

export type AnchorSide = "P1" | "P2" | "CENTER" | "NONE";

export interface AnchorDetection extends NormalizedBox {
  id: AnchorId;
  label: string;
  side: AnchorSide;
  detected: boolean;
  confidence: Confidence;
  /** Optional method reported by the detector (template, color, edge, ml...). */
  method?: string | undefined;
}

export type HudElementId =
  | "P1_HEALTH"
  | "P2_HEALTH"
  | "P1_DRIVE"
  | "P2_DRIVE"
  | "P1_SUPER"
  | "P2_SUPER"
  | "TIMER"
  | "ROUND"
  | "KO";

export const HUD_ELEMENT_IDS: HudElementId[] = [
  "P1_HEALTH",
  "P2_HEALTH",
  "P1_DRIVE",
  "P2_DRIVE",
  "P1_SUPER",
  "P2_SUPER",
  "TIMER",
  "ROUND",
  "KO",
];

export type HudElementKind = "health" | "drive" | "super" | "timer" | "round" | "ko";

/**
 * A HUD region is ALWAYS expressed relative to an anchor first.
 * The normalized box is a derived convenience value produced by the backend
 * (anchor box + relative box -> normalized box) so the UI can draw it directly.
 */
export interface HudRegion extends NormalizedBox, RelativeBox {
  id: HudElementId;
  label: string;
  kind: HudElementKind;
  side: AnchorSide;
  anchor: AnchorId | null;
  detected: boolean;
  confidence: Confidence;
  /** Parsed value when the backend ran OCR / bar analysis on the region. */
  value?: number | string | null | undefined;
  /** 0..1 fill ratio for bar-like elements. */
  ratio?: number | null | undefined;
  notes?: string | undefined;
}

export interface FrameMeta {
  frame: number;
  timestamp: number;
  width: number;
  height: number;
  fps: number;
}

export interface FrameDetection {
  frame: number;
  timestamp: number;
  detectorVersion: string;
  anchors: AnchorDetection[];
  regions: HudRegion[];
  /** Wall-clock ms the backend spent on this frame. */
  processingMs?: number | undefined;
}

/* ------------------------------------------------------------------ */
/* Detection events (value changes between frames)                     */
/* ------------------------------------------------------------------ */

export type DetectionEventType =
  | "HEALTH_CHANGE"
  | "DRIVE_CHANGE"
  | "SUPER_CHANGE"
  | "TIMER_CHANGE"
  | "KO"
  | "ROUND_START"
  | "ROUND_END";

export interface DetectionEvent {
  id: string;
  type: DetectionEventType;
  frame: number;
  timestamp: number;
  player: "P1" | "P2" | "NONE";
  previousValue: number | string | null;
  newValue: number | string | null;
  confidence: Confidence;
}

/* ------------------------------------------------------------------ */
/* HUD Lab session                                                     */
/* ------------------------------------------------------------------ */

export interface DetectorVersion {
  id: string;
  name: string;
  description: string;
  available: boolean;
}

export interface HudSession {
  id: string;
  sourceName: string;
  width: number;
  height: number;
  fps: number;
  duration: number;
  frameCount: number;
  detectorVersion: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Analysis pipeline                                                   */
/* ------------------------------------------------------------------ */

export type AnalysisState =
  | "idle"
  | "uploading"
  | "processing"
  | "detecting_hud"
  | "analyzing"
  | "generating_results"
  | "completed"
  | "error";

export interface AnalysisProgress {
  state: AnalysisState;
  /** null when the backend does not report real progress. Never faked. */
  progress: number | null;
  message?: string | undefined;
  analysisId?: string | undefined;
  error?: string | undefined;
}

export type MatchResult = "WIN" | "LOSS" | "DRAW";

export interface MatchInfo {
  player: string;
  character: string;
  opponent: string;
  opponentCharacter: string;
  result: MatchResult;
  duration: number;
  rounds: number;
  roundsWon: number;
  roundsLost: number;
  date: string;
}

export type GameEventType =
  | "DAMAGE"
  | "DRIVE_DAMAGE"
  | "DRIVE_IMPACT"
  | "PARRY"
  | "COUNTER"
  | "PUNISH"
  | "PUNISH_COUNTER"
  | "KNOCKDOWN"
  | "SUPER"
  | "CRITICAL_ART"
  | "KO"
  | "HIGH_MOVEMENT";

export interface GameEvent {
  id: string;
  type: GameEventType;
  timestamp: number;
  frame: number;
  player: "P1" | "P2" | "NONE";
  round: number;
  value?: number | undefined;
  description: string;
  confidence: Confidence;
}

export type HighlightType =
  | "HUGE_DAMAGE"
  | "DRIVE_IMPACT"
  | "PERFECT_PARRY"
  | "PUNISH_COUNTER"
  | "SUPER"
  | "CRITICAL_ART"
  | "KO"
  | "MAJOR_LIFE_SWING"
  | "MAJOR_DRIVE_SWING";

export interface Highlight {
  id: string;
  type: HighlightType;
  timestamp: number;
  duration: number;
  importance: number; // 0-100
  title: string;
  description: string;
}

/** HUD timeseries sampled by the backend, used by the analysis HUD panel. */
export interface HudSample {
  timestamp: number;
  p1Health: number;
  p2Health: number;
  p1Drive: number;
  p2Drive: number;
  p1Super: number;
  p2Super: number;
  timer: number;
}

export interface AnalysisSummary {
  id: string;
  match: MatchInfo;
  state: AnalysisState;
  videoUrl: string | null;
  thumbnailUrl?: string | null | undefined;
  highlightCount: number;
  eventCount: number;
  createdAt: string;
}

export interface Analysis extends AnalysisSummary {
  hudSamples: HudSample[];
  events: GameEvent[];
  highlights: Highlight[];
  detectorVersion: string;
  source: DataSource;
}

/* ------------------------------------------------------------------ */
/* Coach IA                                                            */
/* ------------------------------------------------------------------ */

export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface CoachEvidence {
  summary: string;
  analysisId?: string | undefined;
  eventIds?: string[] | undefined;
  metric?: string | undefined;
  value?: string | undefined;
}

export interface CoachFinding {
  id: string;
  title: string;
  detail: string;
  priority: Priority;
  evidence: CoachEvidence[];
}

export interface TrainingExercise {
  id: string;
  title: string;
  detail: string;
  durationMinutes: number;
  relatedFindingId?: string | undefined;
}

export interface CoachReport {
  strengths: CoachFinding[];
  weaknesses: CoachFinding[];
  problems: CoachFinding[];
  recommendations: CoachFinding[];
  exercises: TrainingExercise[];
  generatedAt: string;
  source: DataSource;
}

/* ------------------------------------------------------------------ */
/* Matchups / glossary / profile / progress                            */
/* ------------------------------------------------------------------ */

export interface Character {
  id: string;
  name: string;
}

export interface Matchup {
  character: string;
  opponent: string;
  rating: number; // -5..5 from the player's perspective
  played: number;
  wins: number;
  losses: number;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
}

export type GlossaryCategory =
  | "System Hits"
  | "Mechanics"
  | "Combos & Execution"
  | "Strategies"
  | "Frame Data";

export interface GlossaryTerm {
  id: string;
  term: string;
  category: GlossaryCategory;
  definition: string;
  related: string[];
}

export interface PlayerProfile {
  displayName: string;
  mainCharacter: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
  winRate: number;
  strengths: string[];
  weaknesses: string[];
  goals: string[];
}

export interface ProgressPoint {
  date: string;
  winRate: number;
  damage: number;
  punishes: number;
  antiAir: number;
  parry: number;
  driveManagement: number;
  driveImpact: number;
  mistakes: number;
}

export interface DashboardStats {
  analyzed: number;
  wins: number;
  losses: number;
  winRate: number;
  mainCharacter: string;
  frequentOpponent: string;
  lastAnalysisId: string | null;
  lastAnalysisAt: string | null;
}

/* ------------------------------------------------------------------ */
/* Backend transport                                                   */
/* ------------------------------------------------------------------ */

/** Where a payload came from. Mock data is ALWAYS labelled as such. */
export type DataSource = "backend" | "demo";

export interface Sourced<T> {
  data: T;
  source: DataSource;
}

export type BackendStatus = "online" | "offline" | "checking" | "unconfigured";
