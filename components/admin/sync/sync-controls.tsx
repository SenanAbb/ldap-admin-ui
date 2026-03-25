"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type SyncResponse = {
  success?: boolean;
  error?: string;
  targets?: unknown;
};

type SyncStatusPayload = {
  state: "queued" | "running" | "success" | "error";
  cycleId: number;
  startedAt: number;
  finishedAt: number | null;
  targets?: Record<string, boolean>;
  services?: Record<
    string,
    {
      state?: "pending" | "running" | "success" | "error" | "skipped";
      error?: { message?: string; stderr?: string; stdout?: string; code?: unknown };
    }
  >;
};

type SyncStatusResponse = {
  status: SyncStatusPayload | null;
};

type FetchStatusResult =
  | { ok: true; status: SyncStatusPayload | null }
  | { ok: false; httpStatus: number; error: string };

async function requestSync(body: unknown): Promise<SyncResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const json = (await res.json().catch(() => ({}))) as SyncResponse;
    if (!res.ok) {
      return { success: false, error: json?.error || `HTTP ${res.status}` };
    }
    return json;
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return { success: false, error: "Timeout: no se pudo conectar con Redis (¿firewall?)" };
    }
    return { success: false, error: err?.message || "Error de red" };
  } finally {
    clearTimeout(timer);
  }
}

export function SyncSidebarControls() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatusPayload | null>(null);
  const [phase, setPhase] = useState<
    "idle" | "enqueueing" | "waiting" | "running" | "success" | "error"
  >("idle");
  const pollTimerRef = useRef<number | null>(null);

  const stopPolling = () => {
    if (pollTimerRef.current) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const fetchStatus = async (): Promise<FetchStatusResult> => {
    const res = await fetch("/api/sync/status", { cache: "no-store" });
    const json = (await res.json().catch(() => ({}))) as Partial<SyncStatusResponse> & {
      error?: string;
    };

    if (!res.ok) {
      return {
        ok: false,
        httpStatus: res.status,
        error: json?.error || `HTTP ${res.status}`,
      };
    }

    return { ok: true, status: (json.status ?? null) as SyncStatusPayload | null };
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const runAll = async () => {
    setMessage(null);
    setIsError(false);
    setPhase("enqueueing");
    setLoading(true);
    try {
      const body = { targets: ["ambari", "ranger", "hue"], force: true };
      const result = await requestSync(body);
      if (!result.success) {
        setMessage(result.error || "No se pudo encolar la sincronización");
        setIsError(true);
        setPhase("error");
        return;
      }
      setMessage("Sincronización encolada. Esperando ejecución...");
      setPhase("waiting");
      const initial = await fetchStatus().catch(
        () => ({ ok: false, httpStatus: 0, error: "Error de red" }) as FetchStatusResult,
      );
      if (initial.ok) {
        if (initial.status) {
          setSyncStatus(initial.status);
          if (initial.status.state === "queued") setPhase("waiting");
          else setPhase(initial.status.state === "running" ? "running" : initial.status.state);
        } else {
          setMessage("Sincronización encolada. Esperando señal del worker...");
        }
      } else {
        setIsError(true);
        setMessage(`No se pudo leer el estado de sync (${initial.error})`);
        setPhase("error");
        stopPolling();
        return;
      }

      stopPolling();
      pollTimerRef.current = window.setInterval(async () => {
        const r = await fetchStatus().catch(
          () => ({ ok: false, httpStatus: 0, error: "Error de red" }) as FetchStatusResult,
        );
        if (!r.ok) {
          setIsError(true);
          setMessage(`No se pudo leer el estado de sync (${r.error})`);
          setPhase("error");
          stopPolling();
          return;
        }

        if (!r.status) {
          setMessage("Sincronización encolada. Esperando señal del worker...");
          return;
        }

        setSyncStatus(r.status);
        if (r.status.state === "queued") setPhase("waiting");
        else setPhase(r.status.state === "running" ? "running" : r.status.state);
        if (r.status.state === "success" || r.status.state === "error") stopPolling();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const indicator = useMemo(() => {
    if (phase === "enqueueing" || loading) {
      return {
        dot: "bg-orange-500",
        text: "Encolando...",
      };
    }

    if (phase === "waiting") {
      return {
        dot: "bg-orange-500",
        text: message || "Sincronización encolada. Esperando ejecución...",
      };
    }

    if (phase === "running" || syncStatus?.state === "running") {
      return {
        dot: "bg-orange-500",
        text: "Sincronización en ejecución",
      };
    }

    if (phase === "success" || syncStatus?.state === "success") {
      return {
        dot: "bg-emerald-500",
        text: "Sincronización completada",
      };
    }

    if (phase === "error" || syncStatus?.state === "error") {
      return {
        dot: "bg-red-500",
        text: "Sincronización con errores",
      };
    }

    return null;
  }, [phase, loading, syncStatus, message]);

  const getServiceErrorMessage = (service: string, error: any): string => {
    const serviceNames: Record<string, string> = {
      ambari: "Ambari",
      ranger: "Ranger",
      hue: "Hue",
    };
    const name = serviceNames[service] || service;

    if (!error) {
      return `Error en la sincronización con ${name}`;
    }

    const message = String(error?.message || "").toLowerCase();
    const stderr = String(error?.stderr || "").toLowerCase();
    const stdout = String(error?.stdout || "").toLowerCase();
    const fullText = `${message} ${stderr} ${stdout}`;

    // Ambari-specific errors
    if (service === "ambari") {
      if (fullText.includes("connection refused") || fullText.includes("econnrefused")) {
        return "No se pudo conectar con Ambari. Verifique que el servidor esté disponible.";
      }
      if (fullText.includes("timeout") || fullText.includes("etimedout")) {
        return "Timeout al conectar con Ambari. Verifique la conectividad de red.";
      }
      if (fullText.includes("authentication") || fullText.includes("password")) {
        return "Error de autenticación con Ambari. Verifique las credenciales.";
      }
      if (fullText.includes("permission denied")) {
        return "Permiso denegado en Ambari. Verifique los permisos del usuario de sincronización.";
      }
      return "Error en la sincronización con Ambari. Revise los logs del servidor.";
    }

    // Ranger-specific errors
    if (service === "ranger") {
      if (fullText.includes("connection refused") || fullText.includes("econnrefused")) {
        return "No se pudo conectar con Ranger. Verifique que el servidor esté disponible.";
      }
      if (fullText.includes("timeout") || fullText.includes("etimedout")) {
        return "Timeout al conectar con Ranger. Verifique la conectividad de red.";
      }
      if (fullText.includes("did not report running")) {
        return "El servicio Ranger UserSync no se inició correctamente. Revise los logs.";
      }
      if (fullText.includes("permission denied")) {
        return "Permiso denegado en Ranger. Verifique los permisos del usuario de sincronización.";
      }
      return "Error en la sincronización con Ranger. Revise los logs del servidor.";
    }

    // Hue-specific errors
    if (service === "hue") {
      if (fullText.includes("connection refused") || fullText.includes("econnrefused")) {
        return "No se pudo conectar con Hue. Verifique que el servidor esté disponible.";
      }
      if (fullText.includes("timeout") || fullText.includes("etimedout")) {
        return "Timeout al conectar con Hue. Verifique la conectividad de red.";
      }
      if (fullText.includes("permission denied")) {
        return "Permiso denegado en Hue. Verifique los permisos del usuario de sincronización.";
      }
      if (fullText.includes("django") || fullText.includes("python")) {
        return "Error en la aplicación Hue. Revise los logs del servidor.";
      }
      return "Error en la sincronización con Hue. Revise los logs del servidor.";
    }

    return `Error en la sincronización con ${name}`;
  };

  const serviceErrors = useMemo(() => {
    const s = syncStatus?.services;
    if (!s || syncStatus?.state !== "error") return [] as Array<{ key: string; message: string }>;
    const out: Array<{ key: string; message: string }> = [];
    for (const [key, v] of Object.entries(s)) {
      if (v?.state !== "error") continue;
      const msg = getServiceErrorMessage(key, v?.error);
      out.push({ key, message: msg });
    }
    return out;
  }, [syncStatus]);

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={runAll} disabled={loading}>
        {loading ? "Encolando..." : "Sync Todo"}
      </Button>

      {indicator ? (
        <div className="mt-1 rounded-md border border-border bg-background px-2 py-2">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${indicator.dot}`} />
            <p className="text-xs text-muted-foreground">{indicator.text}</p>
          </div>
          {serviceErrors.length ? (
            <div className="mt-2 space-y-1">
              {serviceErrors.map((e) => (
                <p key={e.key} className="text-xs text-red-600">
                  {e.key}: {e.message}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {message && !indicator ? (
        <p className={`text-xs ${isError ? "text-red-500 font-medium" : "text-green-600"}`}>{message}</p>
      ) : null}
    </div>
  );
}
