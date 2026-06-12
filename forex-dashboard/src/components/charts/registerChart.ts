"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

let registered = false;

export function ensureChartRegistered() {
  if (registered) return;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  );
  ChartJS.defaults.color = "#8A98B5";
  ChartJS.defaults.font.family =
    "var(--font-geist-sans), system-ui, sans-serif";
  registered = true;
}

export const CHART_COLORS = {
  accent: "#3B82F6",
  accentGlow: "#60A5FA",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  grid: "rgba(138, 152, 181, 0.12)",
  muted: "#8A98B5",
};
