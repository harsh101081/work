"use client";

import { JournalStats as Stats } from "@/lib/calculations";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

function Stat({
  label,
  value,
  tone = "text-white",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-muted/50 p-3 text-center">
      <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 text-lg font-bold tnum ${tone}`}>{value}</p>
    </div>
  );
}

export function JournalStatsRow({ stats }: { stats: Stats }) {
  const pf = isFinite(stats.profitFactor) ? formatNumber(stats.profitFactor, 2) : "∞";
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
      <Stat
        label="Win Rate"
        value={formatPercent(stats.winRate, 1)}
        tone={stats.winRate >= 50 ? "text-success" : "text-warning"}
      />
      <Stat label="Average R:R" value={`1:${formatNumber(stats.averageRR, 2)}`} tone="text-accent-glow" />
      <Stat label="Avg Profit" value={formatCurrency(stats.averageProfit)} tone="text-success" />
      <Stat label="Avg Loss" value={formatCurrency(stats.averageLoss)} tone="text-danger" />
      <Stat
        label="Profit Factor"
        value={pf}
        tone={stats.profitFactor >= 1 ? "text-success" : "text-danger"}
      />
      <Stat
        label="Net P&L"
        value={formatCurrency(stats.netProfit)}
        tone={stats.netProfit >= 0 ? "text-success" : "text-danger"}
      />
    </div>
  );
}
