"use client";

import { Doughnut } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import { ensureChartRegistered, CHART_COLORS } from "./registerChart";

export interface RiskSlice {
  label: string;
  value: number;
  color: string;
}

ensureChartRegistered();

export function RiskDistributionChart({ slices }: { slices: RiskSlice[] }) {
  const filtered = slices.filter((s) => s.value > 0);
  const hasData = filtered.length > 0;

  const chartData = {
    labels: filtered.map((s) => s.label),
    datasets: [
      {
        data: filtered.map((s) => s.value),
        backgroundColor: filtered.map((s) => s.color),
        borderColor: "#0B1220",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, padding: 14, color: CHART_COLORS.muted, font: { size: 11 } },
      },
      tooltip: {
        backgroundColor: "#0F1726",
        borderColor: "#22304C",
        borderWidth: 1,
        callbacks: { label: (c) => ` ${c.label}: $${Number(c.parsed).toFixed(2)}` },
      },
    },
  };

  if (!hasData) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted">
        No capital allocation to display yet.
      </div>
    );
  }

  return (
    <div className="h-56">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
