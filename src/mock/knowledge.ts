/** DEMO DATA ONLY — placeholder for knowledge/database/glossary/terms.json. */
import type {
  CoachReport,
  GlossaryTerm,
  Matchup,
  PlayerProfile,
  ProgressPoint,
} from "@/types/streammind";

export const demoCharacters = [
  "Ryu", "Ken", "Luke", "Jamie", "Chun-Li", "Guile", "Kimberly", "Juri",
  "Cammy", "Zangief", "Marisa", "Manon", "Dee Jay", "JP", "Blanka",
  "E. Honda", "Dhalsim", "Lily", "Rashid", "A.K.I.", "Ed", "Akuma",
];

export const demoMatchups: Matchup[] = [
  {
    character: "Ken",
    opponent: "Ryu",
    rating: 1,
    played: 24,
    wins: 15,
    losses: 9,
    strengths: [
      "Better forward walk speed and Drive Rush conversions",
      "Jinrai pressure beats slow buttons",
      "Run cancel mixups after knockdown",
    ],
    weaknesses: [
      "Ryu's Denjin fireball forces you to burn Drive",
      "Losing the fireball war at full screen",
    ],
    tips: [
      "Parry Denjin charges instead of Drive Rushing through them",
      "Punish blocked DP with a full Punish Counter combo",
      "Use Jinrai step kick to check his mid-range buttons",
    ],
  },
  {
    character: "Ken",
    opponent: "Cammy",
    rating: -2,
    played: 18,
    wins: 6,
    losses: 12,
    strengths: ["Stronger corner carry", "Better Drive Impact reward"],
    weaknesses: [
      "Cammy's speed beats slow neutral buttons",
      "Dive kick pressure on your wakeup",
      "You burn Drive blocking her strings",
    ],
    tips: [
      "Anti-air dive kicks with cr.HP early",
      "Do not block full strings — parry the gap after Spiral Arrow",
      "Keep at least 2 Drive bars for reversal escapes",
    ],
  },
  {
    character: "Ken",
    opponent: "JP",
    rating: -1,
    played: 11,
    wins: 4,
    losses: 7,
    strengths: ["Run gets you in fast", "Drive Impact punishes his zoning"],
    weaknesses: ["Amnesia counter blows up predictable pressure", "Ghost setups eat your Drive"],
    tips: [
      "Bait Amnesia with delayed pressure",
      "Punish Departure teleport on reaction with cr.MK",
    ],
  },
];

export const demoGlossary: GlossaryTerm[] = [
  { id: "g1", term: "Drive Impact", category: "System Hits", definition: "An armored attack that absorbs one hit and wall-splats on Punish Counter or in the corner. Costs 1 Drive bar.", related: ["Burnout", "Drive Gauge", "Armor"] },
  { id: "g2", term: "Drive Parry", category: "System Hits", definition: "Absorbs attacks while draining Drive; a Perfect Parry within the first 2 frames refunds Drive and gives a large punish window.", related: ["Perfect Parry", "Drive Gauge"] },
  { id: "g3", term: "Perfect Parry", category: "System Hits", definition: "Parry activated within the first frames of the input, slowing time and granting a guaranteed punish.", related: ["Drive Parry"] },
  { id: "g4", term: "Burnout", category: "Mechanics", definition: "State entered when the Drive Gauge is fully depleted: chip damage on block, slower recovery and corner stun on Drive Impact.", related: ["Drive Gauge", "Drive Impact"] },
  { id: "g5", term: "Drive Rush", category: "Mechanics", definition: "A forward dash cancel that adds frame advantage to the following attack. Costs 1 or 3 Drive bars depending on the cancel.", related: ["Drive Gauge", "Frame Advantage"] },
  { id: "g6", term: "Punish Counter", category: "System Hits", definition: "Hitting an opponent during recovery frames, granting extra damage, hitstun and unique combo routes.", related: ["Whiff Punish", "Counter Hit"] },
  { id: "g7", term: "Whiff Punish", category: "Strategies", definition: "Punishing an attack that missed by attacking during its recovery.", related: ["Punish Counter", "Spacing"] },
  { id: "g8", term: "Okizeme", category: "Strategies", definition: "Offensive pressure applied while the opponent is getting up from a knockdown.", related: ["Knockdown", "Meaty"] },
  { id: "g9", term: "Meaty", category: "Strategies", definition: "An attack timed so its active frames overlap the opponent's wakeup, gaining extra frame advantage.", related: ["Okizeme", "Frame Advantage"] },
  { id: "g10", term: "Frame Advantage", category: "Frame Data", definition: "The difference in recovery between both players after an attack connects. Positive advantage means you act first.", related: ["Startup", "Recovery", "Meaty"] },
  { id: "g11", term: "Startup", category: "Frame Data", definition: "Frames before an attack becomes active. Lower startup wins closer exchanges.", related: ["Active Frames", "Recovery"] },
  { id: "g12", term: "Recovery", category: "Frame Data", definition: "Frames after the active window during which the character cannot act. Recovery is what makes a move punishable.", related: ["Whiff Punish", "Startup"] },
  { id: "g13", term: "Target Combo", category: "Combos & Execution", definition: "A predefined chain of normals unique to a character, often used as a combo starter or ender.", related: ["Combo", "Cancel"] },
  { id: "g14", term: "Cancel", category: "Combos & Execution", definition: "Interrupting an attack's recovery with a special, super or Drive Rush to extend a combo.", related: ["Drive Rush", "Target Combo"] },
  { id: "g15", term: "Link", category: "Combos & Execution", definition: "Connecting two attacks by letting the first fully recover before the second starts, requiring precise timing.", related: ["Cancel", "Frame Advantage"] },
  { id: "g16", term: "Anti-Air", category: "Strategies", definition: "A move used to hit an airborne opponent, typically a DP or an upward normal.", related: ["Jump-in", "Punish Counter"] },
  { id: "g17", term: "Critical Art", category: "Mechanics", definition: "Level 3 super. Deals extra damage when used at low health (Critical Art activation).", related: ["Super Gauge"] },
  { id: "g18", term: "Super Gauge", category: "Mechanics", definition: "Three-bar gauge charged by dealing and taking damage; spends on Level 1/2/3 supers.", related: ["Critical Art"] },
];

export const demoCoachReport: CoachReport = {
  generatedAt: "2026-08-27T20:25:00.000Z",
  source: "demo",
  strengths: [
    {
      id: "s1",
      title: "Strong punish game",
      detail: "You convert whiffed specials into maximum-damage Punish Counter routes consistently.",
      priority: "LOW",
      evidence: [
        { summary: "4 Punish Counters landed for 1450 average damage", analysisId: "demo-001", eventIds: ["e4"], metric: "Punish conversion", value: "92%" },
      ],
    },
    {
      id: "s2",
      title: "Reliable anti-air",
      detail: "Jump-ins are answered early rather than blocked.",
      priority: "LOW",
      evidence: [{ summary: "7 of 8 jump-ins anti-aired across the last 3 matches", metric: "Anti-air rate", value: "88%" }],
    },
  ],
  weaknesses: [
    {
      id: "w1",
      title: "Drive gauge management",
      detail: "You block long strings instead of parrying or escaping, which drains Drive quickly.",
      priority: "HIGH",
      evidence: [
        { summary: "Player lost 3400 Drive over 8 blocking sequences.", analysisId: "demo-001", eventIds: ["e7"], metric: "Drive lost / round", value: "3400" },
      ],
    },
    {
      id: "w2",
      title: "Corner escape",
      detail: "Once cornered you stay there for long stretches with no escape attempt.",
      priority: "MEDIUM",
      evidence: [{ summary: "Average corner time 11.2s per round", metric: "Corner time", value: "11.2s" }],
    },
  ],
  problems: [
    {
      id: "p1",
      title: "Poor Drive management",
      detail: "Two Burnout states reached in the last three matches, both immediately followed by a loss of the round.",
      priority: "HIGH",
      evidence: [
        { summary: "Burnout at 27.3s led to a 2100 damage super punish.", analysisId: "demo-001", eventIds: ["e7", "e6"] },
      ],
    },
    {
      id: "p2",
      title: "Predictable wakeup",
      detail: "You use a reversal on wakeup 62% of the time after a hard knockdown.",
      priority: "MEDIUM",
      evidence: [{ summary: "Reversal on wakeup 8/13 knockdowns", analysisId: "demo-002", metric: "Reversal rate", value: "62%" }],
    },
  ],
  recommendations: [
    {
      id: "r1",
      title: "Practice Drive management during blockstrings",
      detail: "Use Drive Parry on gaps instead of blocking the entire sequence, and reserve 2 bars for escapes.",
      priority: "HIGH",
      evidence: [{ summary: "Directly addresses the 3400 Drive loss seen in demo-001.", analysisId: "demo-001", eventIds: ["e7"] }],
    },
    {
      id: "r2",
      title: "Mix up your wakeup timing",
      detail: "Alternate between delayed wakeup, block and reversal to break the read.",
      priority: "MEDIUM",
      evidence: [{ summary: "Opponents baited 5 reversals in demo-002.", analysisId: "demo-002" }],
    },
  ],
  exercises: [
    { id: "x1", title: "Drive Parry blockstring drill", detail: "Record a 6-hit blockstring and parry only the gaps. Target: end the sequence with 3+ Drive bars.", durationMinutes: 15, relatedFindingId: "p1" },
    { id: "x2", title: "Corner escape routine", detail: "Practice Drive Rush escape and jump-out timing against recorded corner pressure.", durationMinutes: 10, relatedFindingId: "w2" },
    { id: "x3", title: "Wakeup randomizer", detail: "Set the dummy to random reversal punish and mix your wakeup options.", durationMinutes: 12, relatedFindingId: "p2" },
  ],
};

export const demoProfile: PlayerProfile = {
  displayName: "You",
  mainCharacter: "Ken",
  rank: "Diamond 3",
  lp: 18420,
  wins: 2,
  losses: 2,
  winRate: 50,
  strengths: ["Punish game", "Anti-air consistency", "Corner carry"],
  weaknesses: ["Drive management", "Corner escape", "Predictable wakeup"],
  goals: ["Reach Master rank", "Reduce Burnout states to under 1 per set", "Improve parry usage"],
};

export const demoProgress: ProgressPoint[] = [
  { date: "2026-07-05", winRate: 41, damage: 1980, punishes: 61, antiAir: 55, parry: 22, driveManagement: 38, driveImpact: 44, mistakes: 19 },
  { date: "2026-07-19", winRate: 45, damage: 2110, punishes: 66, antiAir: 62, parry: 31, driveManagement: 42, driveImpact: 51, mistakes: 17 },
  { date: "2026-08-02", winRate: 48, damage: 2260, punishes: 74, antiAir: 71, parry: 38, driveManagement: 47, driveImpact: 58, mistakes: 15 },
  { date: "2026-08-16", winRate: 52, damage: 2340, punishes: 81, antiAir: 79, parry: 46, driveManagement: 51, driveImpact: 63, mistakes: 13 },
  { date: "2026-08-27", winRate: 56, damage: 2480, punishes: 88, antiAir: 84, parry: 53, driveManagement: 55, driveImpact: 69, mistakes: 11 },
];
