import { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "accent";

const toneStyles: Record<Tone, { ring: string; value: string; iconBg: string }> = {
  neutral: { ring: "border-surface-border", value: "text-white", iconBg: "bg-white/5 text-muted" },
  success: {
    ring: "border-success/30",
    value: "text-success",
    iconBg: "bg-success/10 text-success",
  },
  warning: {
    ring: "border-warning/30",
    value: "text-warning",
    iconBg: "bg-warning/10 text-warning",
  },
  danger: { ring: "border-danger/30", value: "text-danger", iconBg: "bg-danger/10 text-danger" },
  accent: { ring: "border-accent/30", value: "text-accent-glow", iconBg: "bg-accent/10 text-accent" },
};

interface StatCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  progress?: number; // 0-100
}

export function StatCard({ label, value, sub, tone = "neutral", icon, progress }: StatCardProps) {
  const s = toneStyles[tone];
  return (
    <div
      className={`card animate-scale-in border ${s.ring} p-4 transition hover:border-opacity-80 hover:shadow-glow`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        {icon && (
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.iconBg}`}>
            {icon}
          </span>
        )}
      </div>
      <p className={`mt-2 text-2xl font-semibold tnum ${s.value}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              tone === "danger"
                ? "bg-danger"
                : tone === "warning"
                  ? "bg-warning"
                  : tone === "success"
                    ? "bg-success"
                    : "bg-accent"
            }`}
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
