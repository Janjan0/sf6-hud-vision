import { useEffect, useState } from "react";
import { Plug, PlugZap } from "lucide-react";

import {
  getBackendStatus,
  getBackendUrl,
  pingBackend,
  setBackendUrl,
  subscribeBackendStatus,
} from "@/services/apiClient";
import type { BackendStatus } from "@/types/streammind";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const LABEL: Record<BackendStatus, string> = {
  online: "Backend online",
  offline: "Backend offline",
  checking: "Comprobando…",
  unconfigured: "Sin backend",
};

const DOT: Record<BackendStatus, string> = {
  online: "bg-ok",
  offline: "bg-fail",
  checking: "bg-warn",
  unconfigured: "bg-muted-foreground",
};

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>(getBackendStatus());
  const [url, setUrl] = useState(getBackendUrl());
  useEffect(() => {
    const unsub = subscribeBackendStatus((s, u) => {
      setStatus(s);
      setUrl(u);
    });
    void pingBackend();
    return unsub;
  }, []);
  return { status, url };
}

export function BackendStatusBadge() {
  const { status, url } = useBackendStatus();
  const [draft, setDraft] = useState(url);
  useEffect(() => setDraft(url), [url]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
          <span className={`size-2 rounded-full ${DOT[status]}`} />
          <span className="truncate text-xs">{LABEL[status]}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 space-y-3">
        <div>
          <p className="text-sm font-semibold">Backend Python / OpenCV</p>
          <p className="text-xs text-muted-foreground">
            URL del detector real (por ejemplo tu instancia en Termux). Sin backend, la app muestra
            datos DEMO etiquetados.
          </p>
        </div>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="http://127.0.0.1:8000"
          className="font-mono text-xs"
        />
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={() => setBackendUrl(draft)}>
            <PlugZap className="size-4" /> Guardar
          </Button>
          <Button size="sm" variant="outline" onClick={() => void pingBackend()}>
            <Plug className="size-4" /> Probar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
