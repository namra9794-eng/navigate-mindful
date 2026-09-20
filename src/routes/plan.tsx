import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Navigation, Route as RouteIcon, Ruler, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPanel } from "@/components/map/map-panel";
import { FactorList, LevelBadge, ScoreRing } from "@/components/safety-bits";
import { buildRoutes, type RouteOption } from "@/lib/safety";
import { useReports } from "@/lib/store";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan a route — SafeRoute" },
      {
        name: "description",
        content:
          "Compare shortest, balanced and safety-focused route options with a transparent safety indicator.",
      },
      { property: "og:title", content: "Plan a route — SafeRoute" },
      {
        property: "og:description",
        content:
          "Compare route options by time, distance and the safety factors behind each indicator.",
      },
    ],
  }),
  component: Planner,
});

function Planner() {
  const reports = useReports();
  const [start, setStart] = useState("Northgate Station");
  const [destination, setDestination] = useState("Riverside Campus");
  const [result, setResult] = useState<ReturnType<typeof buildRoutes> | null>(null);
  const [selected, setSelected] = useState<string>("Route C");
  const [loading, setLoading] = useState(false);

  function findRoute(e: React.FormEvent) {
    e.preventDefault();
    if (!start.trim() || !destination.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const r = buildRoutes(start.trim(), destination.trim(), reports);
      setResult(r);
      setSelected("Route C");
      setLoading(false);
    }, 550);
  }

  const active: RouteOption | undefined = result?.routes.find((r) => r.id === selected);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <header>
        <h1 className="text-3xl font-bold sm:text-4xl">Route planner</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Enter a journey to compare three demo route options. Safety indicators are
          estimates from demo data and community reports, not a guarantee.
        </p>
      </header>

      <form
        onSubmit={findRoute}
        className="card-soft mt-8 grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end"
      >
        <div className="space-y-2">
          <Label htmlFor="start">Start location</Label>
          <Input
            id="start"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="Where are you starting?"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dest">Destination</Label>
          <Input
            id="dest"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where are you going?"
          />
        </div>
        <Button type="submit" size="lg" className="gap-2" disabled={loading}>
          <Search className="h-4 w-4" />
          {loading ? "Calculating…" : "Find Safe Route"}
        </Button>
      </form>

      {result && active && (
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="card-soft self-start overflow-hidden p-3">
            <div className="overflow-hidden rounded-2xl">
              <MapPanel
                reports={reports}
                from={result.from}
                to={result.to}
                routes={result.routes.map((r) => ({
                  id: r.id,
                  path: r.path,
                  active: r.id === selected,
                }))}
                height="420px"
              />
            </div>
            <p className="px-2 py-3 text-xs text-muted-foreground">
              Demo routing: paths are illustrative and generated locally for the
              prototype.
            </p>
          </div>

          <div className="space-y-5">
            <div className="card-soft p-6">
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5">
                <ScoreRing score={active.safety.score} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold">{active.name}</h2>
                    <LevelBadge level={active.safety.level} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{active.kind} route</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" /> {active.minutes} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Ruler className="h-4 w-4 text-primary" /> {active.km} km
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Safety factors behind this score
              </h3>
              <div className="mt-4">
                <FactorList factors={active.safety.factors} />
              </div>
              <p className="mt-5 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
                The score is a weighted average of the factors above. It reflects
                available reports only and should be treated as an indicator, not proof
                that a route is safe.
              </p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <RouteIcon className="h-4 w-4" /> Route alternatives
              </h3>
              <div className="mt-3 grid gap-3">
                {result.routes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r.id)}
                    className={`card-soft grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4 text-left ${
                      r.id === selected ? "ring-2 ring-ring" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {r.name} · <span className="font-normal">{r.kind}</span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {r.minutes} min · {r.km} km
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <LevelBadge level={r.safety.level} />
                      <span className="font-display text-lg font-bold tabular-nums">
                        {r.safety.score}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <Button className="mt-4 w-full gap-2" size="lg">
                <Navigation className="h-4 w-4" /> Start demo navigation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
