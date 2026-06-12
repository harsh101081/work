"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Card } from "./ui/Card";
import { TargetIcon } from "./ui/icons";
import { formatCurrency } from "@/lib/format";

export function TargetAnalysisPanel() {
  const { targetAnalysis, trade, position } = useDashboard();
  const t = targetAnalysis;

  const tradesText = t.targetReached
    ? "Profit target reached — challenge passed!"
    : isFinite(t.winningTradesNeeded)
      ? `Approximately ${t.winningTradesNeeded} winning ${
          t.winningTradesNeeded === 1 ? "trade" : "trades"
        } required.`
      : "Set a valid trade to estimate winning trades.";

  return (
    <Card
      title="Target Analysis"
      subtitle="Path to passing the challenge"
      icon={<TargetIcon />}
    >
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-lg border border-surface-border bg-surface-muted/50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-muted">Remaining Profit Needed</p>
          <p className="mt-1 text-lg font-bold tnum text-success">
            {formatCurrency(t.profitNeeded)}
          </p>
        </div>
        <div className="rounded-lg border border-surface-border bg-surface-muted/50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-muted">Profit Per Win</p>
          <p className="mt-1 text-lg font-bold tnum text-accent-glow">
            {position.valid ? formatCurrency(t.profitPerWin) : "—"}
          </p>
        </div>
      </div>

      <div
        className={`mt-3 rounded-xl border p-4 ${
          t.targetReached
            ? "border-success/40 bg-success/5"
            : "border-accent/30 bg-accent/5"
        }`}
      >
        <p className="text-xs text-muted">
          At your current 1:{trade.riskRewardRatio} risk-reward ratio
        </p>
        <p className="mt-1 text-sm font-semibold text-white">{tradesText}</p>
        {!t.targetReached && isFinite(t.winningTradesNeeded) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {Array.from({ length: Math.min(t.winningTradesNeeded, 15) }).map((_, i) => (
              <span
                key={i}
                className="flex h-6 w-6 items-center justify-center rounded-md bg-success/15 text-[11px] font-semibold text-success"
              >
                {i + 1}
              </span>
            ))}
            {t.winningTradesNeeded > 15 && (
              <span className="self-center text-xs text-muted">
                +{t.winningTradesNeeded - 15}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
