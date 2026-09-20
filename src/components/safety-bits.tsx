import { CATEGORY_COLOR, CATEGORIES, type SafetyBreakdown } from "@/lib/safety";

export function ScoreRing({
  score,
  size = 96,
}: {
  score: number;
  size?: number;
}) {
  const tone =
    score >= 75 ? "var(--safe)" : score >= 55 ? "var(--caution)" : "var(--alert)";
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${tone} ${score * 3.6}deg, var(--muted) 0deg)`,
      }}
    >
      <div
        className="grid place-items-center rounded-full bg-card"
        style={{ width: size - 16, height: size - 16 }}
      >
        <span className="font-display text-xl font-bold">{score}</span>
      </div>
    </div>
  );
}

export function LevelBadge({ level }: { level: SafetyBreakdown["level"] }) {
  const cls =
    level === "Lower caution"
      ? "bg-safe/20 text-foreground"
      : level === "Moderate caution"
        ? "bg-caution/25 text-foreground"
        : "bg-alert/15 text-alert";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{level}</span>
  );
}

export function FactorList({ factors }: { factors: SafetyBreakdown["factors"] }) {
  return (
    <ul className="space-y-3">
      {factors.map((f) => (
        <li key={f.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium">{f.label}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {Math.round(f.value)} · weight {Math.round(f.weight * 100)}%
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full accent-surface transition-[width] duration-700"
              style={{ width: `${f.value}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{f.note}</p>
        </li>
      ))}
    </ul>
  );
}

export function MapLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {CATEGORIES.map((c) => (
        <span key={c} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: CATEGORY_COLOR[c] }}
          />
          {c}
        </span>
      ))}
    </div>
  );
}
