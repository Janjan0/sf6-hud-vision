import { apiRequest, withFallback } from "./apiClient";
import {
  demoCharacters,
  demoCoachReport,
  demoGlossary,
  demoMatchups,
  demoProfile,
  demoProgress,
} from "@/mock/knowledge";
import type {
  CoachReport,
  GlossaryTerm,
  Matchup,
  PlayerProfile,
  ProgressPoint,
  Sourced,
} from "@/types/streammind";

export const matchupService = {
  async listCharacters(): Promise<Sourced<string[]>> {
    return withFallback(() => apiRequest<string[]>("/api/characters"), () => demoCharacters);
  },
  async getMatchup(character: string, opponent: string): Promise<Sourced<Matchup | null>> {
    return withFallback(
      () => apiRequest<Matchup>(`/api/matchups/${character}/${opponent}`),
      () =>
        demoMatchups.find((m) => m.character === character && m.opponent === opponent) ?? null,
    );
  },
  async listMatchups(): Promise<Sourced<Matchup[]>> {
    return withFallback(() => apiRequest<Matchup[]>("/api/matchups"), () => demoMatchups);
  },
};

export const glossaryService = {
  /** Backend is expected to serve knowledge/database/glossary/terms.json. */
  async listTerms(): Promise<Sourced<GlossaryTerm[]>> {
    return withFallback(() => apiRequest<GlossaryTerm[]>("/api/glossary"), () => demoGlossary);
  },
};

export const coachService = {
  async getReport(analysisId?: string): Promise<Sourced<CoachReport>> {
    const q = analysisId ? `?analysisId=${analysisId}` : "";
    return withFallback(() => apiRequest<CoachReport>(`/api/coach${q}`), () => demoCoachReport);
  },
};

export const profileService = {
  async getProfile(): Promise<Sourced<PlayerProfile>> {
    return withFallback(() => apiRequest<PlayerProfile>("/api/profile"), () => demoProfile);
  },
  async getProgress(): Promise<Sourced<ProgressPoint[]>> {
    return withFallback(() => apiRequest<ProgressPoint[]>("/api/progress"), () => demoProgress);
  },
};
