"use client";

import { useDashboard } from "@/context/DashboardContext";
import { StatCard } from "./ui/StatCard";
import {
  WalletIcon,
  TargetIcon,
  TrendDownIcon,
  TrendUpIcon,
  ShieldIcon,
  ScaleIcon,
  LayersIcon,
} from "./ui/icons";
import {
  formatCurrency,
  formatPercent,
  formatSignedCurrency,
} from "@/lib/format";

export function DashboardCards() {
  const { account, accountMetrics, position, propFirm, targetAnalysis } = useDashboard();
  const m = accountMetrics;

  const equityDelta = account.currentEquity - account.startingBalance;
  const riskPctOfBalance =
    account.currentBalance > 0 ? (position.maxLoss / account.currentBalance) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard
        label="Current Balance"
        value={formatCurrency(account.currentBalance)}
        sub={formatSignedCurrency(m.currentProfit) + " vs start"}
        tone={m.currentProfit >= 0 ? "success" : "danger"}
        icon={<WalletIcon />}
      />
      <StatCard
        label="Current Equity"
        value={formatCurrency(account.currentEquity)}
        sub={formatSignedCurrency(equityDelta) + " vs start"}
        tone="accent"
        icon={<WalletIcon />}
      />
      <StatCard
        label="Profit Target"
        value={formatCurrency(m.profitTargetAmount)}
        sub={`${formatPercent(m.challengeCompletionPercent, 0)} complete`}
        tone="success"
        icon={<TargetIcon />}
        progress={m.challengeCompletionPercent}
      />
      <StatCard
        label="Current Drawdown"
        value={formatPercent(m.currentDrawdownPercent)}
        sub={formatCurrency(m.currentDrawdownAmount)}
        tone={m.currentDrawdownPercent > 0 ? "danger" : "neutral"}
        icon={<TrendDownIcon />}
      />
      <StatCard
        label="Remaining Drawdown"
        value={formatCurrency(m.remainingMaxDrawdown)}
        sub={`Daily: ${formatCurrency(m.remainingDailyDrawdown)}`}
        tone="warning"
        icon={<ShieldIcon />}
      />
      <StatCard
        label="Risk Per Trade"
        value={position.valid ? formatCurrency(position.maxLoss) : "—"}
        sub={`${formatPercent(riskPctOfBalance, 2)} of balance`}
        tone="warning"
        icon={<ScaleIcon />}
      />
      <StatCard
        label="Potential Profit"
        value={position.valid ? formatCurrency(position.potentialProfit) : "—"}
        sub={position.valid ? `Lot ${position.lotSize.toFixed(2)}` : "no setup"}
        tone="success"
        icon={<TrendUpIcon />}
      />
      <StatCard
        label="Potential Loss"
        value={position.valid ? formatCurrency(position.maxLoss) : "—"}
        sub={position.valid ? `${position.pipDistance.toFixed(0)} pips` : "no setup"}
        tone="danger"
        icon={<TrendDownIcon />}
      />
      <StatCard
        label="Trades Remaining"
        value={position.valid ? String(propFirm.losingTradesRemaining) : "—"}
        sub="before rule breach"
        tone={
          propFirm.losingTradesRemaining <= 1
            ? "danger"
            : propFirm.losingTradesRemaining <= 3
              ? "warning"
              : "success"
        }
        icon={<ShieldIcon />}
      />
      <StatCard
        label="Winning Trades Needed"
        value={
          targetAnalysis.targetReached
            ? "0"
            : position.valid && isFinite(targetAnalysis.winningTradesNeeded)
              ? String(targetAnalysis.winningTradesNeeded)
              : "—"
        }
        sub="to pass challenge"
        tone="accent"
        icon={<LayersIcon />}
      />
    </div>
  );
}
