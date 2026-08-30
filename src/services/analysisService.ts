/**
 * analysisService — all match-analysis traffic with the StreamMindAI backend.
 * UI components must never call fetch directly.
 */
import { apiRequest, withFallback } from "./apiClient";
import { demoAnalyses, demoDashboardStats, demoSummaries } from "@/mock/analyses";
import type {
  Analysis,
  AnalysisProgress,
  AnalysisSummary,
  DashboardStats,
  GameEvent,
  Highlight,
  Sourced,
} from "@/types/streammind";

export interface HistoryFilters {
  character?: string;
  opponent?: string;
  result?: "WIN" | "LOSS" | "ALL";
  from?: string;
  to?: string;
  onlyWithHighlights?: boolean;
  onlyCompleted?: boolean;
}

export const analysisService = {
  async listAnalyses(filters: HistoryFilters = {}): Promise<Sourced<AnalysisSummary[]>> {
    const { data, source } = await withFallback(
      () => apiRequest<AnalysisSummary[]>("/api/analysis"),
      () => demoSummaries,
    );
    return { data: applyFilters(data, filters), source };
  },

  async getDashboardStats(): Promise<Sourced<DashboardStats>> {
    return withFallback(
      () => apiRequest<DashboardStats>("/api/dashboard"),
      () => demoDashboardStats,
    );
  },

  async getAnalysis(id: string): Promise<Sourced<Analysis | null>> {
    return withFallback(
      () => apiRequest<Analysis>(`/api/analysis/${id}`),
      () => demoAnalyses.find((a) => a.id === id) ?? demoAnalyses[0] ?? null,
    );
  },

  async getEvents(id: string): Promise<Sourced<GameEvent[]>> {
    return withFallback(
      () => apiRequest<GameEvent[]>(`/api/analysis/${id}/events`),
      () => demoAnalyses.find((a) => a.id === id)?.events ?? [],
    );
  },

  async getHighlights(id: string): Promise<Sourced<Highlight[]>> {
    return withFallback(
      () => apiRequest<Highlight[]>(`/api/analysis/${id}/highlights`),
      () => demoAnalyses.find((a) => a.id === id)?.highlights ?? [],
    );
  },

  /**
   * Uploads a video and starts an analysis job.
   * Only reachable when the backend is online — there is no fake progress.
   */
  async startAnalysis(file: File, detectorVersion: string): Promise<AnalysisProgress> {
    const form = new FormData();
    form.append("video", file);
    form.append("detector", detectorVersion);
    const res = await apiRequest<{ analysisId: string }>("/api/analyze", {
      method: "POST",
      body: form,
      timeoutMs: 120000,
    });
    return { state: "processing", progress: null, analysisId: res.analysisId };
  },

  async getProgress(analysisId: string): Promise<AnalysisProgress> {
    return apiRequest<AnalysisProgress>(`/api/analysis/${analysisId}/progress`);
  },

  async cancelAnalysis(analysisId: string): Promise<void> {
    await apiRequest(`/api/analysis/${analysisId}/cancel`, { method: "POST" });
  },
};

function applyFilters(list: AnalysisSummary[], f: HistoryFilters): AnalysisSummary[] {
  return list.filter((a) => {
    if (f.character && f.character !== "ALL" && a.match.character !== f.character) return false;
    if (f.opponent && f.opponent !== "ALL" && a.match.opponentCharacter !== f.opponent) return false;
    if (f.result && f.result !== "ALL" && a.match.result !== f.result) return false;
    if (f.onlyWithHighlights && a.highlightCount === 0) return false;
    if (f.onlyCompleted && a.state !== "completed") return false;
    if (f.from && new Date(a.match.date) < new Date(f.from)) return false;
    if (f.to && new Date(a.match.date) > new Date(f.to)) return false;
    return true;
  });
}
