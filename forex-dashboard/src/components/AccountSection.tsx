"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Card } from "./ui/Card";
import { NumberField } from "./ui/Field";
import { Progress } from "./ui/Progress";
import { WalletIcon } from "./ui/icons";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/lib/format";

function MetricRow({
  label,
  value,
  tone = "text-white",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-surface-border/60 py-2 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className={`text-sm font-semibold tnum ${tone}`}>{value}</span>
    </div>
  );
}

export function AccountSection() {
  const { account, setAccount, accountMetrics } = useDashboard();
  const m = accountMetrics;

  const profitTone = m.currentProfit >= 0 ? "text-success" : "text-danger";

  return (
    <Card
      title="Account & Challenge"
      subtitle="Enter your prop firm parameters"
      icon={<WalletIcon />}
    >
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label="Starting Balance"
          prefix="$"
          step={1}
          value={account.startingBalance}
          onChange={(v) => setAccount({ startingBalance: v })}
        />
        <NumberField
          label="Current Balance"
          prefix="$"
          step={0.01}
          value={account.currentBalance}
          onChange={(v) => setAccount({ currentBalance: v })}
        />
        <NumberField
          label="Current Equity"
          prefix="$"
          step={0.01}
          value={account.currentEquity}
          onChange={(v) => setAccount({ currentEquity: v })}
        />
        <NumberField
          label="Leverage (1:n)"
          step={1}
          value={account.leverage}
          onChange={(v) => setAccount({ leverage: v })}
        />
        <NumberField
          label="Daily Drawdown"
          suffix="%"
          step={0.1}
          value={account.dailyDrawdownPct}
          onChange={(v) => setAccount({ dailyDrawdownPct: v })}
        />
        <NumberField
          label="Max Drawdown"
          suffix="%"
          step={0.1}
          value={account.maxDrawdownPct}
          onChange={(v) => setAccount({ maxDrawdownPct: v })}
        />
        <NumberField
          label="Profit Target"
          suffix="%"
          step={0.1}
          value={account.profitTargetPct}
          onChange={(v) => setAccount({ profitTargetPct: v })}
        />
        <div className="flex flex-col justify-end">
          <span className="field-label">Net P&L</span>
          <div
            className={`flex h-[42px] items-center rounded-lg border border-surface-border bg-surface-muted px-3 text-sm font-semibold tnum ${profitTone}`}
          >
            {formatSignedCurrency(m.currentProfit)}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-surface-border bg-surface-muted/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Challenge Completion
          </span>
          <span className="text-sm font-bold text-accent-glow tnum">
            {formatPercent(m.challengeCompletionPercent, 1)}
          </span>
        </div>
        <Progress
          value={m.challengeCompletionPercent}
          tone={m.challengeCompletionPercent >= 100 ? "success" : "accent"}
        />

        <div className="mt-3 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
          <MetricRow
            label="Remaining Daily Drawdown"
            value={formatCurrency(m.remainingDailyDrawdown)}
            tone="text-warning"
          />
          <MetricRow
            label="Remaining Max Drawdown"
            value={formatCurrency(m.remainingMaxDrawdown)}
            tone="text-danger"
          />
          <MetricRow
            label="To Reach Profit Target"
            value={formatCurrency(m.amountToProfitTarget)}
            tone="text-success"
          />
          <MetricRow
            label="Profit Target Amount"
            value={formatCurrency(m.profitTargetAmount)}
          />
          <MetricRow
            label="Current Drawdown ($)"
            value={formatCurrency(m.currentDrawdownAmount)}
            tone={m.currentDrawdownAmount > 0 ? "text-danger" : "text-success"}
          />
          <MetricRow
            label="Current Drawdown (%)"
            value={formatPercent(m.currentDrawdownPercent)}
            tone={m.currentDrawdownPercent > 0 ? "text-danger" : "text-success"}
          />
        </div>
      </div>
    </Card>
  );
}
