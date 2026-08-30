/**
 * hudService — HUD Detection Lab transport.
 *
 * ANCHOR FIRST: the backend returns anchors plus regions defined relative to
 * those anchors. The frontend only renders and debugs; it never derives HUD
 * positions from hardcoded absolute coordinates.
 */
import { apiRequest, withFallback } from "./apiClient";
import {
  demoDetectionEvents,
  demoDetectorVersions,
  demoFrameDetection,
  demoHudSession,
} from "@/mock/hud";
import type {
  DetectionEvent,
  DetectorVersion,
  FrameDetection,
  HudSession,
  Sourced,
} from "@/types/streammind";

export const hudService = {
  async listDetectorVersions(): Promise<Sourced<DetectorVersion[]>> {
    return withFallback(
      () => apiRequest<DetectorVersion[]>("/api/hud/detectors"),
      () => demoDetectorVersions,
    );
  },

  /** Registers a video with the backend and returns its HUD session metadata. */
  async createSession(
    file: File,
    detectorVersion: string,
    meta: { width: number; height: number; fps: number; duration: number },
  ): Promise<Sourced<HudSession>> {
    const form = new FormData();
    form.append("video", file);
    form.append("detector", detectorVersion);
    form.append("meta", JSON.stringify(meta));
    return withFallback(
      () =>
        apiRequest<HudSession>("/api/hud/analyze", {
          method: "POST",
          body: form,
          timeoutMs: 120000,
        }),
      () => ({
        ...demoHudSession,
        id: "local-session",
        sourceName: file.name,
        width: meta.width,
        height: meta.height,
        fps: meta.fps,
        duration: meta.duration,
        frameCount: Math.max(1, Math.round(meta.duration * meta.fps)),
        detectorVersion,
      }),
    );
  },

  async getSession(id: string): Promise<Sourced<HudSession>> {
    return withFallback(
      () => apiRequest<HudSession>(`/api/hud/${id}`),
      () => demoHudSession,
    );
  },

  /** Runs the detector on a single frame. */
  async detectFrame(
    sessionId: string,
    frame: number,
    detectorVersion: string,
  ): Promise<Sourced<FrameDetection>> {
    return withFallback(
      () =>
        apiRequest<FrameDetection>(
          `/api/hud/${sessionId}/detections?frame=${frame}&detector=${detectorVersion}`,
        ),
      () => demoFrameDetection(frame, detectorVersion),
    );
  },

  /** Batch detection over a frame range — used by the detection history panel. */
  async detectRange(
    sessionId: string,
    from: number,
    to: number,
    step: number,
    detectorVersion: string,
  ): Promise<Sourced<FrameDetection[]>> {
    return withFallback(
      () =>
        apiRequest<FrameDetection[]>(
          `/api/hud/${sessionId}/frames?from=${from}&to=${to}&step=${step}&detector=${detectorVersion}`,
        ),
      () => {
        const out: FrameDetection[] = [];
        for (let f = from; f <= to; f += step) out.push(demoFrameDetection(f, detectorVersion));
        return out;
      },
    );
  },

  /** Derives value-change events between two consecutive detections. */
  diffDetections(previous: FrameDetection | null, current: FrameDetection): DetectionEvent[] {
    return demoDetectionEvents(previous, current);
  },
};
