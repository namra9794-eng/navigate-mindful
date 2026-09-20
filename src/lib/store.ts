import { useSyncExternalStore } from "react";
import { DEMO_REPORTS, type SafetyReport } from "./safety";

const KEY = "saferoute.reports.v1";

let reports: SafetyReport[] = DEMO_REPORTS;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function hydrateReports() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as SafetyReport[];
    if (Array.isArray(saved) && saved.length) {
      reports = [...saved, ...DEMO_REPORTS];
      emit();
    }
  } catch {
    /* ignore corrupted storage */
  }
}

export function addReport(input: Omit<SafetyReport, "id" | "createdAt" | "demo">) {
  const report: SafetyReport = {
    ...input,
    id: `u${Date.now()}`,
    createdAt: new Date().toISOString(),
    demo: false,
  };
  reports = [report, ...reports];
  emit();
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify(reports.filter((r) => !r.demo)),
    );
  } catch {
    /* storage unavailable */
  }
  return report;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const serverSnapshot = DEMO_REPORTS;

export function useReports() {
  return useSyncExternalStore(
    subscribe,
    () => reports,
    () => serverSnapshot,
  );
}
