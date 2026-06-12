"use client";

import { Line } from "react-chartjs-2";
import type { ChartOptions, ScriptableContext } from "chart.js";
import { ensureChartRegistered, CHART_COLORS } from "./registerChart";
import { EquityPoint } from "@/lib/calculations";

ensureChartRegistered();

export function EquityCurveChart({
  points,
  startingBalance,
}: {
  points: EquityPoint[];
  startingBalance: number;
}) {
  const labels = points.map((p) => p.label);
  const data = points.map((p) => p.equity);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Equity",
        data,
        borderColor: CHART_COLORS.accent,
        borderWidth: 2,
        tension: 0.35,
        pointRadius: points.length > 25 ? 0 : 3,
        pointBackgroundColor: CHART_COLORS.accentGlow,
        pointHoverRadius: 5,
        fill: true,
        backgroundColor: (ctx: ScriptableContext<"line">) => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return "rgba(59,130,246,0.15)";
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(59,130,246,0.35)");
          gradient.addColorStop(1, "rgba(59,130,246,0.01)");
          return gradient;
        },
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0F1726",
        borderColor: "#22304C",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (c) => ` Equity: $${Number(c.parsed.y).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
      y: {
        grid: { color: CHART_COLORS.grid },
        ticks: { callback: (v) => "$" + Number(v).toFixed(0) },
        suggestedMin: startingBalance * 0.95,
      },
    },
  };

  return (
    <div className="h-56">
      <Line data={chartData} options={options} />
    </div>
  );
}
