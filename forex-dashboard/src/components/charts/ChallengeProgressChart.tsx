"use client";

import { Doughnut } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import { ensureChartRegistered, CHART_COLORS } from "./registerChart";

ensureChartRegistered();

export function ChallengeProgressChart({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const chartData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [clamped, 100 - clamped],
        backgroundColor: [
          clamped >= 100 ? CHART_COLORS.success : CHART_COLORS.accent,
          "#1A2740",
        ],
        borderWidth: 0,
        circumference: 360,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0F1726",
        borderColor: "#22304C",
        borderWidth: 1,
        callbacks: { label: (c) => ` ${c.label}: ${Number(c.parsed).toFixed(1)}%` },
      },
    },
  };

  return (
    <div className="relative h-56">
      <Doughnut data={chartData} options={options} />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tnum text-white">{clamped.toFixed(0)}%</span>
        <span className="text-[11px] uppercase tracking-wide text-muted">to target</span>
      </div>
    </div>
  );
}
