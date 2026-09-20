import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  LifeBuoy,
  Map as MapIcon,
  MessageSquareWarning,
  Route as RouteIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapPanel } from "@/components/map/map-panel";
import { MapLegend } from "@/components/safety-bits";
import { useReports } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeRoute — Navigate smarter. Travel safer." },
      {
        name: "description",
        content:
          "Plan your journey with safety insights, community reports and emergency assistance.",
      },
      { property: "og:title", content: "SafeRoute — Navigate smarter. Travel safer." },
      {
        property: "og:description",
        content:
          "Safety-aware route planning with community reports, an interactive safety map and emergency help.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: RouteIcon,
    title: "Safety-aware routing",
    body: "Compare route options by estimated time, distance and a transparent safety indicator.",
  },
  {
    icon: MessageSquareWarning,
    title: "Community reports",
    body: "People on the ground flag poor lighting, hazards and isolated stretches.",
  },
  {
    icon: LifeBuoy,
    title: "Emergency assistance",
    body: "One tap opens location sharing and trusted contacts — nothing is sent without you.",
  },
  {
    icon: Activity,
    title: "Real-time safety insights",
    body: "Indicators update as new reports come in across the network.",
  },
];

function Landing() {
  const reports = useReports();

  return (
    <div>
      <section className="relative overflow-hidden hero-surface">
        <div className="absolute inset-0 grid-fade opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              Tech for a Better Tomorrow · Hackathon prototype
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
              SafeRoute
            </h1>
            <p className="mt-3 font-display text-xl opacity-90 sm:text-2xl">
              Navigate smarter. Travel safer.
            </p>
            <p className="mt-5 max-w-xl text-base opacity-80">
              Plan your journey with safety insights, community reports and emergency
              assistance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/plan">
                  Plan a Route <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 bg-white/10 text-ink-foreground hover:bg-white/20 hover:text-ink-foreground"
              >
                <Link to="/map">
                  <MapIcon className="h-4 w-4" /> Explore Safety Map
                </Link>
              </Button>
            </div>
            <p className="mt-6 max-w-lg text-xs opacity-70">
              SafeRoute shows safety indicators based on available reports and
              safety-related factors. It cannot guarantee that a route is safe.
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur">
            <div className="overflow-hidden rounded-2xl">
              <MapPanel reports={reports.slice(0, 6)} height="340px" />
            </div>
            <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3 text-xs opacity-85">
              <span>{reports.length} demo safety reports nearby</span>
              <Link to="/map" className="underline underline-offset-4">
                Open full map
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">What SafeRoute does</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <article key={f.title} className="card-soft p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Why SafeRoute?</h2>
            <p className="mt-4 text-muted-foreground">
              Conventional navigation optimises mainly for distance and travel time. That
              works well for traffic, but it says nothing about a dark underpass, a
              stretch with no foot traffic at night, or a junction where incidents keep
              getting reported.
            </p>
            <p className="mt-4 text-muted-foreground">
              SafeRoute adds that missing context. Every route shows the factors behind
              its indicator — lighting, recent reports, road conditions, reported
              incidents and community activity — so you can decide for yourself instead of
              trusting a single number.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/plan">Try the route planner</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard">See the dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="card-soft p-6">
            <h3 className="text-lg font-semibold">Marker categories on the map</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Reports are grouped so patterns are easy to spot.
            </p>
            <div className="mt-5">
              <MapLegend />
            </div>
            <div className="mt-6 rounded-xl bg-muted p-4 text-xs text-muted-foreground">
              All data in this prototype is demo data or unverified community input, and
              is clearly labelled as such throughout the app.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
