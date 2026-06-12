"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Card } from "./ui/Card";
import { ShieldIcon } from "./ui/icons";
import { formatCurrency } from "@/lib/format";

function MiniBar({
  label,
  trades,
  remaining,
  tone,
}: {
  label: string;
  trades: number;
  remaining: number;
  tone: "warning" | "danger";
}) {
  const toneClass = tone === "danger" ? "text-danger" : "text-warning";
  const bg = tone === "danger" ? "bg-danger" : "bg-warning";
  const cells = Math.min(trades, 12);
  return (
    <div className="rounded-lg border border-surface-border bg-surface-muted/50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <span className={`text-sm font-bold tnum ${toneClass}`}>{trades}</span>
      </div>
      <p className="mt-0.5 text-[11px] text-muted">{formatCurrency(remaining)} remaining</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {Array.from({ length: cells }).map((_, i) => (
          <span key={i} className={`h-1.5 w-3 rounded-full ${bg} opacity-80`} />
        ))}
        {trades > 12 && <span className="text-[10px] text-muted">+{trades - 12}</span>}
        {trades === 0 && <span className="text-[10px] text-danger">limit reached</span>}
      </div>
    </div>
  );
}

export function PropFirmPanel() {
  const { propFirm, accountMetrics, position } = useDashboard();

  const remaining = propFirm.losingTradesRemaining;
  const limiting = propFirm.limitingRule === "daily" ? "daily drawdown" : "max drawdown";

  return (
    <Card
      title="Prop Firm Analysis"
      subtitle="Losing trades before a rule breach"
      icon={<ShieldIcon />}
    >
      <div
        className={`rounded-xl border p-4 ${
          remaining <= 1
            ? "border-danger/40 bg-danger/5"
            : remaining <= 3
              ? "border-warning/40 bg-warning/5"
              : "border-success/40 bg-success/5"
        }`}
      >
        <p className="text-sm text-white">
          You can take approximately{" "}
          <span
            className={`text-xl font-bold tnum ${
              remaining <= 1
                ? "text-danger"
                : remaining <= 3
                  ? "text-warning"
                  : "text-success"
            }`}
          >
            {position.valid ? remaining : "—"}
          </span>{" "}
          more full losing {remaining === 1 ? "trade" : "trades"} before violating challenge rules.
        </p>
        {position.valid && (
          <p className="mt-1 text-xs text-muted">
            Risk per trade {formatCurrency(propFirm.riskPerTrade)} · limited by your {limiting}.
          </p>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <MiniBar
          label="Daily drawdown"
          trades={position.valid ? propFirm.losingTradesUntilDailyBreach : 0}
          remaining={accountMetrics.remainingDailyDrawdown}
          tone="warning"
        />
        <MiniBar
          label="Max drawdown"
          trades={position.valid ? propFirm.losingTradesUntilMaxBreach : 0}
          remaining={accountMetrics.remainingMaxDrawdown}
          tone="danger"
        />
      </div>
    </Card>
  );
}
