import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmergencyPanel } from "@/components/emergency-panel";
import { ReportDialog } from "@/components/report-dialog";
import { hydrateReports } from "@/lib/store";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/plan", label: "Plan Route" },
  { to: "/map", label: "Safety Map" },
  { to: "/report", label: "Report" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [report, setReport] = useState(false);

  useEffect(() => {
    hydrateReports();
  }, []);

  useEffect(() => {
    function onOpenReport() {
      setReport(true);
    }
    window.addEventListener("saferoute:report", onOpenReport);
    return () => window.removeEventListener("saferoute:report", onOpenReport);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 md:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl accent-surface">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-lg font-bold leading-none">
                SafeRoute
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                Navigate smarter. Travel safer.
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-muted data-[status=active]:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button
              variant="destructive"
              size="sm"
              className="shrink-0 gap-1.5 shadow-sm"
              onClick={() => setEmergency(true)}
            >
              <ShieldAlert className="h-4 w-4" />
              <span className="hidden sm:inline">Emergency</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 lg:hidden"
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-border bg-background px-4 pb-4 pt-2 lg:hidden">
            <div className="mx-auto grid max-w-6xl gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted data-[status=active]:bg-muted data-[status=active]:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground md:px-6">
          <p className="font-display text-base font-semibold text-foreground">SafeRoute</p>
          <p className="mt-2 max-w-2xl">
            Hackathon prototype. Safety indicators are estimates derived from demo data
            and unverified community reports — they do not guarantee that any route or
            area is safe. Always use your own judgement.
          </p>
          <p className="mt-3 text-xs">Map data © OpenStreetMap contributors.</p>
        </div>
      </footer>

      <EmergencyPanel open={emergency} onOpenChange={setEmergency} />
      <ReportDialog open={report} onOpenChange={setReport} />
    </div>
  );
}

export function openReportDialog() {
  window.dispatchEvent(new Event("saferoute:report"));
}
