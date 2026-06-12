type Tone = "accent" | "success" | "warning" | "danger";

const fill: Record<Tone, string> = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

interface ProgressProps {
  value: number; // 0-100
  tone?: Tone;
  className?: string;
  showStripes?: boolean;
}

export function Progress({ value, tone = "accent", className = "", showStripes }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-surface-muted ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${fill[tone]} ${
          showStripes ? "bg-[length:1rem_1rem]" : ""
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
