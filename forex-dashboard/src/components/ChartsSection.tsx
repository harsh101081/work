"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Card } from "./ui/Card";
import { ChartIcon, TrendDownIcon, TargetIcon, LayersIcon } from "./ui/icons";
import { EquityCurveChart } from "./charts/EquityCurveChart";
import { DrawdownChart } from "./charts/DrawdownChart";
import { ChallengeProgressChart } from "./charts/ChallengeProgressChart";
import { RiskDistributionChart, RiskSlice } from "./charts/RiskDistributionChart";
import { CHART_COLORS } from "./charts/registerChart";

export function ChartsSection() {
  const { equityCurve, account, accountMetrics, position } = useDashboard();

  const riskSlices: RiskSlice[] = [
    {
      label: "Used Drawdown",
      value: Math.min(accountMetrics.currentDrawdownAmount, accountMetrics.maxDrawdownLimitAmount),
      color: CHART_COLORS.danger,
    },
    {
      label: "This Trade Risk",
      value: position.valid ? position.maxLoss : 0,
      color: CHART_COLORS.warning,
    },
    {
      label: "Safe Buffer",
      value: Math.max(
        0,
        accountMetrics.remainingMaxDrawdown - (position.valid ? position.maxLoss : 0),
      ),
      color: CHART_COLORS.success,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card title="Equity Curve" subtitle="Account balance over closed trades" icon={<ChartIcon />}>
        <EquityCurveChart points={equityCurve} startingBalance={account.startingBalance} />
      </Card>

      <Card title="Drawdown Progress" subtitle="Peak-to-trough decline" icon={<TrendDownIcon />}>
        <DrawdownChart points={equityCurve} maxDrawdownPct={account.maxDrawdownPct} />
      </Card>

      <Card
        title="Challenge Progress"
        subtitle="Completion toward profit target"
        icon={<TargetIcon />}
      >
        <ChallengeProgressChart percent={accountMetrics.challengeCompletionPercent} />
      </Card>

      <Card
        title="Risk Distribution"
        subtitle="Allocation of your max drawdown budget"
        icon={<LayersIcon />}
      >
        <RiskDistributionChart slices={riskSlices} />
      </Card>
    </div>
  );
}
