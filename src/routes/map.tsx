import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MapPanel } from "@/components/map/map-panel";
import { MapLegend } from "@/components/safety-bits";
import { openReportDialog } from "@/components/app-shell";
import { CATEGORIES, CATEGORY_COLOR, timeAgo, type ReportCategory } from "@/lib/safety";
import { useReports } from "@/lib/store";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Safety map — SafeRoute" },
      {
        name: "description",
        content:
          "Browse community safety reports on an interactive OpenStreetMap view with a clear category legend.",
      },
      { property: "og:title", content: "Safety map — SafeRoute" },
      {
        property: "og:description",
        content: "Interactive map of demo safety reports by category and severity.",
      },
    ],
  }),
  component: SafetyMapPage,
});

function SafetyMapPage() {
  const reports = useReports();
  const [filter, setFilter] = useState<ReportCategory | "All">("All");
  const visible = filter === "All" ? reports : reports.filter((r) => r.category === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <header className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold sm:text-4xl">Safety map</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Demo reports across the Northgate district. Markers are community
            observations, not verified incidents.
          </p>
        </div>
        <Button onClick={openReportDialog} className="shrink-0">
          Report an area
        </Button>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c as ReportCategory | "All")}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === c
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {c !== "All" && (
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: CATEGORY_COLOR[c as ReportCategory] }}
              />
            )}
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="card-soft p-3">
          <div className="overflow-hidden rounded-2xl">
            <MapPanel reports={visible} height="520px" />
          </div>
          <div className="px-2 pb-1 pt-4">
            <MapLegend />
          </div>
        </div>

        <div className="card-soft max-h-[580px] overflow-y-auto p-5">
          <h2 className="text-lg font-semibold">
            {visible.length} report{visible.length === 1 ? "" : "s"}
          </h2>
          <ul className="mt-4 space-y-3">
            {visible.map((r) => (
              <li key={r.id} className="rounded-xl border border-border p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.location}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {r.category} · {timeAgo(r.createdAt)}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      backgroundColor: `${CATEGORY_COLOR[r.category]}33`,
                    }}
                  >
                    {r.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {r.demo ? "Demo data" : "Submitted in this session"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
