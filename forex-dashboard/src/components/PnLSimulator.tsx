"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Card } from "./ui/Card";
import { TrendUpIcon, TrendDownIcon } from "./ui/icons";
import { formatCurrency, formatSignedCurrency, formatSignedPercent } from "@/lib/format";

function Outcome({
  win,
  amount,
  percent,
  newBalance,
}: {
  win: boolean;
  amount: number;
  percent: number;
  newBalance: number;
}) {
  const textTone = win ? "text-success" : "text-danger";
  return (
    <div
      className={`flex-1 rounded-xl border p-4 ${
        win ? "border-success/30 bg-success/5" : "border-danger/30 bg-danger/5"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`chip ${
            win ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
          }`}
        >
          {win ? <TrendUpIcon width={14} height={14} /> : <TrendDownIcon width={14} height={14} />}
          {win ? "If Trade Wins" : "If Trade Loses"}
        </span>
      </div>
      <p className={`text-2xl font-bold tnum ${textTone}`}>
        {win ? formatSignedCurrency(amount) : formatSignedCurrency(-amount)}
      </p>
      <p className={`text-sm font-medium tnum ${textTone}`}>
        {win ? formatSignedPercent(percent) : formatSignedPercent(-percent)}
      </p>
      <div className="mt-3 border-t border-surface-border/60 pt-2">
        <p className="text-[11px] uppercase tracking-wide text-muted">New Balance</p>
        <p className="text-lg font-semibold tnum text-white">{formatCurrency(newBalance)}</p>
      </div>
    </div>
  );
}

export function PnLSimulator() {
  const { pnl, position } = useDashboard();

  return (
    <Card
      title="Profit & Loss Simulator"
      subtitle="Project the outcome of this setup"
      icon={<TrendUpIcon />}
    >
      {!position.valid ? (
        <p className="rounded-lg border border-surface-border bg-surface-muted/50 p-4 text-sm text-muted">
          Define a valid trade to simulate outcomes.
        </p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Outcome
            win
            amount={pnl.win.amount}
            percent={pnl.win.percent}
            newBalance={pnl.win.newBalance}
          />
          <Outcome
            win={false}
            amount={pnl.loss.amount}
            percent={pnl.loss.percent}
            newBalance={pnl.loss.newBalance}
          />
        </div>
      )}
    </Card>
  );
}
