import { createFileRoute } from "@tanstack/react-router";
import { Camera, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openReportDialog } from "@/components/app-shell";
import { MapLegend } from "@/components/safety-bits";
import { timeAgo } from "@/lib/safety";
import { useReports } from "@/lib/store";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an area — SafeRoute" },
      {
        name: "description",
        content:
          "Flag poor lighting, road hazards or isolated areas so other travellers get more context.",
      },
      { property: "og:title", content: "Report an area — SafeRoute" },
      {
        property: "og:description",
        content: "Submit a community safety report with category, severity and photo.",
      },
    ],
  }),
  component: ReportPage,
});

const STEPS = [
  { icon: MapPin, title: "Pick the spot", body: "Name the street, junction or landmark." },
  {
    icon: ShieldCheck,
    title: "Choose category & severity",
    body: "Lighting, hazard, accident, isolated area, suspicious activity or other.",
  },
  {
    icon: Camera,
    title: "Add context",
    body: "A short description and an optional photo help others judge the report.",
  },
];

function ReportPage() {
  const reports = useReports();
  const mine = reports.filter((r) => !r.demo);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Report an area</h1>
        <p className="mt-2 text-muted-foreground">
          Community reports are the backbone of SafeRoute. They are unverified
          observations and are always shown as indicators, never as confirmed facts.
        </p>
        <Button size="lg" className="mt-6" onClick={openReportDialog}>
          Open report form
        </Button>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <article key={s.title} className="card-soft p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Step {i + 1}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold">Your reports this session</h2>
          {mine.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              You haven't submitted any reports yet. Anything you add appears instantly on
              the safety map and dashboard.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {mine.map((r) => (
                <li
                  key={r.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.location}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.category} · {timeAgo(r.createdAt)}
                      {r.imageName ? ` · photo: ${r.imageName}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold">
                    {r.severity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold">Categories</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each category is colour-coded on the map.
          </p>
          <div className="mt-5">
            <MapLegend />
          </div>
          <div className="mt-6 rounded-xl bg-muted p-4 text-xs text-muted-foreground">
            Please don't include personal details about individuals. Reports describe
            places and conditions, not people.
          </div>
        </div>
      </div>
    </div>
  );
}
