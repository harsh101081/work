"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Card } from "./ui/Card";
import { ScaleIcon } from "./ui/icons";
import { getInstrument } from "@/lib/instruments";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatPrice,
} from "@/lib/format";

function Stat({
  label,
  value,
  tone = "text-white",
  highlight = false,
}: {
  label: string;
  value: string;
  tone?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        highlight
          ? "border-accent/40 bg-accent/5"
          : "border-surface-border bg-surface-muted/50"
      }`}
    >
      <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 text-base font-semibold tnum ${tone}`}>{value}</p>
    </div>
  );
}

export function PositionSizingPanel() {
  const { trade, position } = useDashboard();
  const spec = getInstrument(trade.symbol);
  const p = position;

  const directionTone = trade.direction === "BUY" ? "text-success" : "text-danger";

  return (
    <Card
      title="Position Sizing Engine"
      subtitle="Lot size auto-adjusts to your stop distance"
      icon={<ScaleIcon />}
      action={
        <span
          className={`chip border ${
            trade.direction === "BUY"
              ? "border-success/40 bg-success/10 text-success"
              : "border-danger/40 bg-danger/10 text-danger"
          }`}
        >
          {trade.symbol} · {trade.direction}
        </span>
      }
    >
      {!p.valid ? (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm text-warning">
          Enter a valid entry, stop loss and risk percentage to calculate position size.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <Stat
              label="Recommended Lot Size"
              value={formatNumber(p.lotSize, 2)}
              tone="text-accent-glow"
              highlight
            />
            <Stat label="Dollar Risk" value={formatCurrency(p.dollarRisk)} tone="text-warning" />
            <Stat label="Risk %" value={formatPercent(trade.riskPercent)} />
            <Stat label="Pip Distance" value={`${formatNumber(p.pipDistance, 1)} pips`} />
            <Stat label="Point Distance" value={`${formatNumber(p.pointDistance, 0)} pts`} />
            <Stat label="Units" value={formatNumber(p.units, 0)} />
            <Stat label="Pip Value" value={formatCurrency(p.pipValue)} />
            <Stat label="Margin Required" value={formatCurrency(p.marginRequired)} />
            <Stat label="Notional Value" value={formatCurrency(p.notionalValue)} />
            <Stat label="Maximum Loss" value={formatCurrency(p.maxLoss)} tone="text-danger" />
            <Stat
              label="Potential Profit"
              value={formatCurrency(p.potentialProfit)}
              tone="text-success"
            />
            <Stat
              label="Reward Amount"
              value={formatCurrency(p.rewardAmount)}
              tone="text-success"
            />
          </div>

          {/* Buy / Sell trade logic */}
          <div className="mt-4 rounded-xl border border-surface-border bg-surface-muted/40 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              {trade.direction} Trade Logic
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
              <div>
                <p className="text-[11px] text-muted">Entry Price</p>
                <p className="text-sm font-semibold tnum text-white">
                  {formatPrice(trade.entryPrice, spec.priceDigits)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Stop Loss</p>
                <p className="text-sm font-semibold tnum text-danger">
                  {formatPrice(trade.stopLossPrice, spec.priceDigits)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted">SL Distance</p>
                <p className="text-sm font-semibold tnum text-white">
                  {formatPrice(p.priceDistance, spec.priceDigits)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted">Target Price</p>
                <p className={`text-sm font-semibold tnum ${directionTone}`}>
                  {formatPrice(p.targetPrice, spec.priceDigits)}
                </p>
              </div>
            </div>
            <p className="mt-3 rounded-md bg-surface px-3 py-2 font-mono text-[11px] text-muted">
              Target = Entry {trade.direction === "BUY" ? "+" : "−"} (SL Distance ×{" "}
              {trade.riskRewardRatio}) = {formatPrice(p.targetPrice, spec.priceDigits)}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
