import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, FileText, MapPinned, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { openReportDialog } from "@/components/app-shell";
import { CATEGORIES, CATEGORY_COLOR, severityWeight, timeAgo } from "@/lib/safety";
import { useReports } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Safety dashboard — SafeRoute" },
      {
        name: "description",
        content:
          "Track total reports, active alerts and areas needing attention across the SafeRoute demo network.",
      },
      { property: "og:title", content: "Safety dashboard — SafeRoute" },
      {
        property: "og:description",
        content: "Live prototype dashboard of community safety reports and alerts.",
      },
    ],
  }),
  component: Dashboard;
});

function Dashboard() {
  const reports = useReports();
  const activeAlerts = reports.filter((r) => r.severity === "High").length;

  const byArea = new Map<string, number>();
  reports.forEach((r) =>
    byArea.set(r.location, (byArea.get(r.location) ?? 0) + severityWeight(r.severity)),
  );
  const attention = [...byArea.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const chartData = CATEGORIES.map((c) => ({
    category: c.split(" ")[0],
    full: c,
    count: reports.filter((r) => r.category === c).length,
  }));

  const stats = [
    { icon: FileText, label: "Total reports", value: reports.length },
    { icon: AlertTriangle, label: "Active alerts", value: activeAlerts },
    {
      icon: MapPinned,
      label: "Areas needing attention",
      value: attention.filter(([, w]) => w >= 2).length,
    },
    {
      icon: Users,
      label: "Community reports",
      value: reports.filter((r) => !r.demo).length,
    },
  ];

  const recent = [...reports]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <header className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold sm:text-4xl">Safety dashboard</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Aggregated view of demo and session reports. Counts update the moment a new
            report is submitted.
          </p>
        </div>
        <Button onClick={openReportDialog} className="shrink-0">
          Add a report
        </Button>
      </header>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <article key={s.label} className="card-soft p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 shrink-0 text-primary" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold tabular-nums">{s.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold">Reports by category</h2>
          <div className="mt-5 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="category" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  formatter={(v, _n, p) => [v as number, (p.payload as { full: string }).full]}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((d) => (
                    <Cell
                      key={d.full}
                      fill={CATEGORY_COLOR[d.full as keyof typeof CATEGORY_COLOR]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-soft p-6">
          <h2 className="text-lg font-semibold">Areas needing attention</h2>
          <ul className="mt-4 space-y-3">
            {attention.map(([area, weight]) => (
              <li key={area}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-medium">{area}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {weight} pts
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full accent-surface"
                    style={{ width: `${Math.min(100, weight * 22)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-muted-foreground">
            Weighting: high severity 3 pts, medium 2, low 1. Prototype heuristic only.
          </p>
        </div>
      </div>

      <div className="card-soft mt-8 overflow-x-auto p-6">
        <h2 className="text-lg font-semibold">Recent reports</h2>
        <table className="mt-4 w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Time</th>
              <th className="pb-3 font-medium">Severity</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="py-3 pr-4 font-medium">{r.location}</td>
                <td className="py-3 pr-4">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLOR[r.category] }}
                    />
                    {r.category}
                  </span>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{timeAgo(r.createdAt)}</td>
                <td className="py-3">{r.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
