export type ReportCategory =
  | "Poor lighting"
  | "Road hazard"
  | "Accident"
  | "Isolated area"
  | "Suspicious activity"
  | "Other";

export type Severity = "Low" | "Medium" | "High";

export type SafetyReport = {
  id: string;
  location: string;
  lat: number;
  lng: number;
  category: ReportCategory;
  description: string;
  severity: Severity;
  createdAt: string;
  demo: boolean;
  imageName?: string;
};

export const CATEGORIES: ReportCategory[] = [
  "Poor lighting",
  "Road hazard",
  "Accident",
  "Isolated area",
  "Suspicious activity",
  "Other",
];

export const SEVERITIES: Severity[] = ["Low", "Medium", "High"];

export const CATEGORY_COLOR: Record<ReportCategory, string> = {
  "Poor lighting": "#f5c542",
  "Road hazard": "#f08a3c",
  Accident: "#ef4d4d",
  "Isolated area": "#8b7cf6",
  "Suspicious activity": "#3fbfd4",
  Other: "#94a3b8",
};

// Demo city centre used for the prototype map (fictional "Northgate" district).
export const CITY_CENTER: [number, number] = [28.6139, 77.209];

export const DEMO_REPORTS: SafetyReport[] = [
  {
    id: "d1",
    location: "Northgate Underpass",
    lat: 28.6205,
    lng: 77.2008,
    category: "Poor lighting",
    description: "Several street lights out along the pedestrian underpass.",
    severity: "Medium",
    createdAt: "2026-09-19T19:40:00.000Z",
    demo: true,
  },
  {
    id: "d2",
    location: "Riverside Junction",
    lat: 28.6082,
    lng: 77.2183,
    category: "Accident",
    description: "Minor collision reported near the signal during peak hours.",
    severity: "High",
    createdAt: "2026-09-19T08:15:00.000Z",
    demo: true,
  },
  {
    id: "d3",
    location: "Mill Road Stretch",
    lat: 28.6164,
    lng: 77.2251,
    category: "Road hazard",
    description: "Open drain cover and loose gravel on the left lane.",
    severity: "Medium",
    createdAt: "2026-09-18T17:05:00.000Z",
    demo: true,
  },
  {
    id: "d4",
    location: "Old Depot Lane",
    lat: 28.6242,
    lng: 77.2149,
    category: "Isolated area",
    description: "Very low foot traffic after 9 PM, no shops open.",
    severity: "High",
    createdAt: "2026-09-18T21:30:00.000Z",
    demo: true,
  },
  {
    id: "d5",
    location: "Central Market Gate 3",
    lat: 28.6108,
    lng: 77.2042,
    category: "Suspicious activity",
    description: "Group loitering near parking exit, reported by two users.",
    severity: "Low",
    createdAt: "2026-09-17T22:10:00.000Z",
    demo: true,
  },
  {
    id: "d6",
    location: "Hilltop Approach Road",
    lat: 28.6301,
    lng: 77.2096,
    category: "Poor lighting",
    description: "No lighting on the final 400m of the approach road.",
    severity: "Medium",
    createdAt: "2026-09-16T20:00:00.000Z",
    demo: true,
  },
  {
    id: "d7",
    location: "Station Link Bridge",
    lat: 28.6051,
    lng: 77.2122,
    category: "Other",
    description: "Footpath partially blocked by construction barriers.",
    severity: "Low",
    createdAt: "2026-09-16T11:25:00.000Z",
    demo: true,
  },
];

export const EMERGENCY_CONTACTS = [
  { name: "Aarav Mehta (Demo)", relation: "Family", phone: "+1 555 0142" },
  { name: "Priya Nair (Demo)", relation: "Friend", phone: "+1 555 0177" },
  { name: "Campus Safety Desk (Demo)", relation: "Institution", phone: "+1 555 0190" },
];

/* ---------- transparent demo scoring model ---------- */

export type ScoreFactor = {
  label: string;
  value: number; // 0-100 contribution score
  weight: number;
  note: string;
};

export type SafetyBreakdown = {
  score: number;
  level: "Lower caution" | "Moderate caution" | "Higher caution";
  factors: ScoreFactor[];
};

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function seeded(input: string, min: number, max: number) {
  return min + (hash(input) % (max - min + 1));
}

export function severityWeight(s: Severity) {
  return s === "High" ? 3 : s === "Medium" ? 2 : 1;
}

export function computeSafety(
  seed: string,
  reports: SafetyReport[],
  bias = 0,
): SafetyBreakdown {
  const recent = reports.filter(
    (r) => Date.now() - new Date(r.createdAt).getTime() < 1000 * 60 * 60 * 24 * 14,
  );
  const load = recent.reduce((sum, r) => sum + severityWeight(r.severity), 0);
  const reportPressure = Math.max(0, 100 - load * 4);

  const factors: ScoreFactor[] = [
    {
      label: "Street lighting coverage",
      value: Math.min(100, seeded(seed + "light", 45, 92) + bias),
      weight: 0.25,
      note: "Estimated from lighting-related community reports along the corridor.",
    },
    {
      label: "Recent community reports",
      value: Math.min(100, reportPressure + bias),
      weight: 0.25,
      note: `${recent.length} report(s) logged in the last 14 days.`,
    },
    {
      label: "Road conditions",
      value: Math.min(100, seeded(seed + "road", 50, 95) + bias),
      weight: 0.2,
      note: "Based on hazard and surface-issue reports.",
    },
    {
      label: "Reported incidents",
      value: Math.min(100, seeded(seed + "incident", 40, 90) + bias),
      weight: 0.2,
      note: "Accidents and suspicious-activity reports near the path.",
    },
    {
      label: "Community activity",
      value: Math.min(100, seeded(seed + "people", 45, 95) + bias),
      weight: 0.1,
      note: "How actively this area is reported on and travelled.",
    },
  ];

  const score = Math.round(
    factors.reduce((sum, f) => sum + f.value * f.weight, 0) /
      factors.reduce((sum, f) => sum + f.weight, 0),
  );

  const level: SafetyBreakdown["level"] =
    score >= 75 ? "Lower caution" : score >= 55 ? "Moderate caution" : "Higher caution";

  return { score, level, factors };
}

export type RouteOption = {
  id: string;
  name: string;
  kind: "Shortest" | "Balanced" | "Safety-focused";
  minutes: number;
  km: number;
  safety: SafetyBreakdown;
  path: [number, number][];
};

function offsetPath(
  from: [number, number],
  to: [number, number],
  bend: number,
): [number, number][] {
  const mid: [number, number] = [
    (from[0] + to[0]) / 2 + bend,
    (from[1] + to[1]) / 2 - bend * 0.6,
  ];
  const pts: [number, number][] = [];
  for (let t = 0; t <= 1.0001; t += 0.1) {
    const lat =
      (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * mid[0] + t * t * to[0];
    const lng =
      (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * mid[1] + t * t * to[1];
    pts.push([lat, lng]);
  }
  return pts;
}

export function buildRoutes(
  start: string,
  destination: string,
  reports: SafetyReport[],
): { from: [number, number]; to: [number, number]; routes: RouteOption[] } {
  const from: [number, number] = [
    CITY_CENTER[0] - 0.012 + (seeded(start, 0, 40) / 10000),
    CITY_CENTER[1] - 0.014 + (seeded(start + "x", 0, 40) / 10000),
  ];
  const to: [number, number] = [
    CITY_CENTER[0] + 0.014 - (seeded(destination, 0, 40) / 10000),
    CITY_CENTER[1] + 0.016 - (seeded(destination + "x", 0, 40) / 10000),
  ];

  const baseKm = 3 + seeded(start + destination, 0, 40) / 10;

  const specs: { name: string; kind: RouteOption["kind"]; km: number; pace: number; bias: number; bend: number }[] =
    [
      { name: "Route A", kind: "Shortest", km: baseKm, pace: 3.6, bias: -8, bend: 0.004 },
      { name: "Route B", kind: "Balanced", km: baseKm * 1.12, pace: 3.4, bias: 4, bend: -0.006 },
      {
        name: "Route C",
        kind: "Safety-focused",
        km: baseKm * 1.28,
        pace: 3.2,
        bias: 14,
        bend: 0.012,
      },
    ];

  return {
    from,
    to,
    routes: specs.map((s) => ({
      id: s.name,
      name: s.name,
      kind: s.kind,
      km: Math.round(s.km * 10) / 10,
      minutes: Math.round(s.km * s.pace + 4),
      safety: computeSafety(start + destination + s.name, reports, s.bias),
      path: offsetPath(from, to, s.bend),
    })),
  };
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
}
