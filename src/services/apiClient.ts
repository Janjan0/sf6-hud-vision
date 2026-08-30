/**
 * Thin transport layer between StreamMindAI's frontend and the external
 * Python/OpenCV backend.
 *
 * The backend base URL is configurable at runtime (Settings / HUD Lab), so the
 * app can be pointed at a Termux instance without a rebuild.
 * When no backend answers, callers fall back to clearly-labelled DEMO data.
 */

import type { BackendStatus } from "@/types/streammind";

const STORAGE_KEY = "streammind.backendUrl";
const DEFAULT_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.['VITE_STREAMMIND_API']) || "";

let cachedStatus: BackendStatus = "checking";
const listeners = new Set<(s: BackendStatus, url: string) => void>();

export function getBackendUrl(): string {
  if (typeof window === "undefined") return DEFAULT_URL;
  return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_URL;
}

export function setBackendUrl(url: string): void {
  if (typeof window === "undefined") return;
  const clean = url.trim().replace(/\/+$/, "");
  if (clean) window.localStorage.setItem(STORAGE_KEY, clean);
  else window.localStorage.removeItem(STORAGE_KEY);
  cachedStatus = clean ? "checking" : "unconfigured";
  emit();
  void pingBackend();
}

export function getBackendStatus(): BackendStatus {
  return cachedStatus;
}

export function subscribeBackendStatus(
  fn: (s: BackendStatus, url: string) => void,
): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  const url = getBackendUrl();
  listeners.forEach((fn) => fn(cachedStatus, url));
}

export class BackendUnavailableError extends Error {
  constructor(message = "StreamMindAI backend is not reachable") {
    super(message);
    this.name = "BackendUnavailableError";
  }
}

export async function pingBackend(): Promise<BackendStatus> {
  const url = getBackendUrl();
  if (!url) {
    cachedStatus = "unconfigured";
    emit();
    return cachedStatus;
  }
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${url}/api/health`, { signal: controller.signal });
    clearTimeout(t);
    cachedStatus = res.ok ? "online" : "offline";
  } catch {
    cachedStatus = "offline";
  }
  emit();
  return cachedStatus;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  timeoutMs?: number;
}

/**
 * Performs a call against the configured backend.
 * Throws BackendUnavailableError when there is no backend or it fails, which
 * lets each service decide whether to fall back to demo data.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const base = getBackendUrl();
  if (!base) throw new BackendUnavailableError("No backend URL configured");

  const { body, timeoutMs = 20000, headers, ...rest } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const isForm = typeof FormData !== "undefined" && body instanceof FormData;
    const res = await fetch(`${base}${path}`, {
      ...rest,
      signal: controller.signal,
      headers: {
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...(headers ?? {}),
      },
      body: body === undefined ? null : isForm ? (body as FormData) : JSON.stringify(body),
    });
    if (!res.ok) throw new BackendUnavailableError(`Backend responded ${res.status}`);
    cachedStatus = "online";
    return (await res.json()) as T;
  } catch (err) {
    if (cachedStatus !== "offline") {
      cachedStatus = "offline";
      emit();
    }
    if (err instanceof BackendUnavailableError) throw err;
    throw new BackendUnavailableError((err as Error)?.message);
  } finally {
    clearTimeout(timer);
  }
}

/** Runs a backend call, falling back to demo data when unavailable. */
export async function withFallback<T>(
  call: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<{ data: T; source: "backend" | "demo" }> {
  try {
    const data = await call();
    return { data, source: "backend" };
  } catch {
    return { data: await fallback(), source: "demo" };
  }
}
