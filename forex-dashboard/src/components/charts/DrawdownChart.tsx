"use client";

import { Line } from "react-chartjs-2";
import type { ChartOptions, ScriptableContext } from "chart.js";
import { ensureChartRegistered, CHART_COLORS } from "./registerChart";
import { EquityPoint } from "@/lib/calculations";

ensureChartRegistered();

export function DrawdownChart({
  points,
  maxDrawdownPct,
}: {
  points: EquityPoint[];
  maxDrawdownPct: number;
}) {
  const labels = points.map((p) => p.label);
  const data = points.map((p) => p.drawdownPercent);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Drawdown %",
        data,
        borderColor: CHART_COLORS.danger,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: points.length > 25 ? 0 : 2,
        fill: true,
        backgroundColor: (ctx: ScriptableContext<"line">) => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return "rgba(239,68,68,0.15)";
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(239,68,68,0.35)");
          gradient.addColorStop(1, "rgba(239,68,68,0.01)");
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
        callbacks: { label: (c) => ` Drawdown: ${Number(c.parsed.y).toFixed(2)}%` },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
      y: {
        reverse: true,
        min: 0,
        suggestedMax: Math.max(maxDrawdownPct, 2),
        grid: { color: CHART_COLORS.grid },
        ticks: { callback: (v) => Number(v).toFixed(1) + "%" },
      },
    },
  };

  return (
    <div className="h-56">
      <Line data={chartData} options={options} />
    </div>
  );
}
