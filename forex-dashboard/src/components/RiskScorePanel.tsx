"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Card } from "./ui/Card";
import { GaugeIcon } from "./ui/icons";
import { RiskRating } from "@/lib/types";

const ratingMeta: Record<
  RiskRating,
  { label: string; ring: string; text: string; bg: string; stroke: string }
> = {
  SAFE: {
    label: "Safe",
    ring: "border-success/40",
    text: "text-success",
    bg: "bg-success/10",
    stroke: "#22C55E",
  },
  MODERATE: {
    label: "Moderate",
    ring: "border-accent/40",
    text: "text-accent-glow",
    bg: "bg-accent/10",
    stroke: "#3B82F6",
  },
  AGGRESSIVE: {
    label: "Aggressive",
    ring: "border-warning/40",
    text: "text-warning",
    bg: "bg-warning/10",
    stroke: "#F59E0B",
  },
  DANGEROUS: {
    label: "Dangerous",
    ring: "border-danger/40",
    text: "text-danger",
    bg: "bg-danger/10",
    stroke: "#EF4444",
  },
};

const dotColor: Record<"good" | "warning" | "danger", string> = {
  good: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

function Gauge({ score, stroke }: { score: number; stroke: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative h-32 w-32">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#1A2740" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tnum text-white">{score}</span>
        <span className="text-[10px] uppercase tracking-wide text-muted">/ 100</span>
      </div>
    </div>
  );
}

export function RiskScorePanel() {
  const { riskScore } = useDashboard();
  const meta = ratingMeta[riskScore.rating];

  return (
    <Card title="Risk Management Score" subtitle="Live discipline check" icon={<GaugeIcon />}>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <Gauge score={riskScore.score} stroke={meta.stroke} />
        <div className="flex-1">
          <div
            className={`mb-3 inline-flex items-center rounded-lg border px-3 py-1.5 ${meta.ring} ${meta.bg}`}
          >
            <span className={`text-sm font-bold uppercase tracking-wide ${meta.text}`}>
              {meta.label}
            </span>
          </div>
          <ul className="space-y-1.5">
            {riskScore.factors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${dotColor[f.status]}`} />
                <span className="text-muted">
                  <span className="font-medium text-white">{f.label}:</span> {f.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rating legend */}
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {(["SAFE", "MODERATE", "AGGRESSIVE", "DANGEROUS"] as RiskRating[]).map((r) => {
          const rm = ratingMeta[r];
          const active = riskScore.rating === r;
          return (
            <div
              key={r}
              className={`rounded-md border px-2 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide transition ${
                active ? `${rm.ring} ${rm.bg} ${rm.text}` : "border-surface-border text-muted"
              }`}
            >
              {rm.label}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
