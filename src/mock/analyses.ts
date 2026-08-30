/** DEMO DATA ONLY — never imported by production logic, only by services as fallback. */
import type {
  Analysis,
  AnalysisSummary,
  DashboardStats,
  GameEvent,
  Highlight,
  HudSample,
} from "@/types/streammind";

const DEMO_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

function buildSamples(duration: number): HudSample[] {
  const out: HudSample[] = [];
  let p1 = 10000;
  let p2 = 10000;
  for (let t = 0; t <= duration; t += 1) {
    const phase = t / duration;
    p1 = Math.max(0, p1 - (t % 7 === 0 ? 620 : 90) * (0.6 + phase));
    p2 = Math.max(0, p2 - (t % 5 === 0 ? 780 : 70) * (0.6 + phase));
    out.push({
      timestamp: t,
      p1Health: Math.round(p1),
      p2Health: Math.round(p2),
      p1Drive: Math.round(6 - 5 * Math.abs(Math.sin(t / 9))),
      p2Drive: Math.round(6 - 5 * Math.abs(Math.sin(t / 7 + 1))),
      p1Super: Math.min(3, Math.floor(t / 22)),
      p2Super: Math.min(3, Math.floor(t / 26)),
      timer: Math.max(0, 99 - Math.round(t)),
    });
  }
  return out;
}

const EVENTS: GameEvent[] = [
  { id: "e1", type: "DAMAGE", timestamp: 4.2, frame: 252, player: "P1", round: 1, value: 820, description: "Drive Rush combo into heavy", confidence: 96 },
  { id: "e2", type: "PARRY", timestamp: 7.8, frame: 468, player: "P1", round: 1, description: "Perfect parry on fireball", confidence: 91 },
  { id: "e3", type: "DRIVE_IMPACT", timestamp: 11.4, frame: 684, player: "P2", round: 1, description: "Drive Impact absorbed in the corner", confidence: 88 },
  { id: "e4", type: "PUNISH_COUNTER", timestamp: 15.1, frame: 906, player: "P1", round: 1, value: 1450, description: "Punish counter on unsafe special", confidence: 94 },
  { id: "e5", type: "KNOCKDOWN", timestamp: 18.6, frame: 1116, player: "P2", round: 1, description: "Hard knockdown into oki", confidence: 84 },
  { id: "e6", type: "SUPER", timestamp: 23.9, frame: 1434, player: "P2", round: 1, value: 2100, description: "Level 2 super punish", confidence: 97 },
  { id: "e7", type: "DRIVE_DAMAGE", timestamp: 27.3, frame: 1638, player: "P1", round: 2, value: 3400, description: "Drive gauge drained during blockstring", confidence: 79 },
  { id: "e8", type: "COUNTER", timestamp: 31.0, frame: 1860, player: "P1", round: 2, description: "Counter hit anti-air", confidence: 90 },
  { id: "e9", type: "HIGH_MOVEMENT", timestamp: 34.5, frame: 2070, player: "NONE", round: 2, description: "Rapid neutral movement exchange", confidence: 71 },
  { id: "e10", type: "CRITICAL_ART", timestamp: 40.2, frame: 2412, player: "P1", round: 2, value: 4100, description: "Critical Art closes the round", confidence: 99 },
  { id: "e11", type: "KO", timestamp: 41.0, frame: 2460, player: "P1", round: 2, description: "KO — round 2", confidence: 99 },
  { id: "e12", type: "PUNISH", timestamp: 46.4, frame: 2784, player: "P2", round: 3, value: 980, description: "Punish on whiffed sweep", confidence: 87 },
];

const HIGHLIGHTS: Highlight[] = [
  { id: "h1", type: "PERFECT_PARRY", timestamp: 7.8, duration: 4, importance: 72, title: "Perfect Parry", description: "Read on the fireball, converted into Drive Rush pressure." },
  { id: "h2", type: "PUNISH_COUNTER", timestamp: 15.1, duration: 6, importance: 88, title: "Punish Counter — 1450", description: "Whiff punish on an unsafe special." },
  { id: "h3", type: "MAJOR_DRIVE_SWING", timestamp: 27.3, duration: 7, importance: 81, title: "Major Drive Swing", description: "3400 Drive lost across a single blockstring." },
  { id: "h4", type: "CRITICAL_ART", timestamp: 40.2, duration: 8, importance: 96, title: "Critical Art", description: "Round-closing Critical Art from full screen." },
  { id: "h5", type: "KO", timestamp: 41.0, duration: 5, importance: 99, title: "KO", description: "Round 2 finished." },
];

export const demoAnalyses: Analysis[] = [
  {
    id: "demo-001",
    match: {
      player: "You",
      character: "Ken",
      opponent: "RyuMain88",
      opponentCharacter: "Ryu",
      result: "WIN",
      duration: 52,
      rounds: 3,
      roundsWon: 2,
      roundsLost: 1,
      date: "2026-08-27T20:14:00.000Z",
    },
    state: "completed",
    videoUrl: DEMO_VIDEO,
    thumbnailUrl: null,
    highlightCount: HIGHLIGHTS.length,
    eventCount: EVENTS.length,
    createdAt: "2026-08-27T20:20:00.000Z",
    hudSamples: buildSamples(52),
    events: EVENTS,
    highlights: HIGHLIGHTS,
    detectorVersion: "hud-v1",
    source: "demo",
  },
  {
    id: "demo-002",
    match: {
      player: "You",
      character: "Ken",
      opponent: "CammyGod",
      opponentCharacter: "Cammy",
      result: "LOSS",
      duration: 48,
      rounds: 3,
      roundsWon: 1,
      roundsLost: 2,
      date: "2026-08-25T18:02:00.000Z",
    },
    state: "completed",
    videoUrl: DEMO_VIDEO,
    thumbnailUrl: null,
    highlightCount: 3,
    eventCount: 9,
    createdAt: "2026-08-25T18:10:00.000Z",
    hudSamples: buildSamples(48),
    events: EVENTS.slice(0, 9),
    highlights: HIGHLIGHTS.slice(0, 3),
    detectorVersion: "hud-v1",
    source: "demo",
  },
  {
    id: "demo-003",
    match: {
      player: "You",
      character: "Ken",
      opponent: "JPWall",
      opponentCharacter: "JP",
      result: "LOSS",
      duration: 61,
      rounds: 3,
      roundsWon: 1,
      roundsLost: 2,
      date: "2026-08-22T21:41:00.000Z",
    },
    state: "completed",
    videoUrl: DEMO_VIDEO,
    thumbnailUrl: null,
    highlightCount: 2,
    eventCount: 7,
    createdAt: "2026-08-22T21:50:00.000Z",
    hudSamples: buildSamples(61),
    events: EVENTS.slice(2, 9),
    highlights: HIGHLIGHTS.slice(1, 3),
    detectorVersion: "hud-v1",
    source: "demo",
  },
  {
    id: "demo-004",
    match: {
      player: "You",
      character: "Ken",
      opponent: "Luke_TX",
      opponentCharacter: "Luke",
      result: "WIN",
      duration: 44,
      rounds: 2,
      roundsWon: 2,
      roundsLost: 0,
      date: "2026-08-19T19:30:00.000Z",
    },
    state: "completed",
    videoUrl: DEMO_VIDEO,
    thumbnailUrl: null,
    highlightCount: 4,
    eventCount: 10,
    createdAt: "2026-08-19T19:36:00.000Z",
    hudSamples: buildSamples(44),
    events: EVENTS.slice(0, 10),
    highlights: HIGHLIGHTS.slice(0, 4),
    detectorVersion: "hud-v1",
    source: "demo",
  },
];

export const demoSummaries: AnalysisSummary[] = demoAnalyses.map((a) => ({
  id: a.id,
  match: a.match,
  state: a.state,
  videoUrl: a.videoUrl,
  thumbnailUrl: a.thumbnailUrl,
  highlightCount: a.highlightCount,
  eventCount: a.eventCount,
  createdAt: a.createdAt,
}));

export const demoDashboardStats: DashboardStats = {
  analyzed: demoAnalyses.length,
  wins: demoAnalyses.filter((a) => a.match.result === "WIN").length,
  losses: demoAnalyses.filter((a) => a.match.result === "LOSS").length,
  winRate: Math.round(
    (demoAnalyses.filter((a) => a.match.result === "WIN").length / demoAnalyses.length) * 100,
  ),
  mainCharacter: "Ken",
  frequentOpponent: "Ryu",
  lastAnalysisId: "demo-001",
  lastAnalysisAt: "2026-08-27T20:20:00.000Z",
};
