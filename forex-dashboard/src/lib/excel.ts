import * as XLSX from "xlsx";
import { JournalEntry } from "./types";
import { computeJournalStats } from "./calculations";

export function exportJournalToExcel(entries: JournalEntry[]): void {
  const rows = entries.map((e) => ({
    Date: e.date,
    Pair: e.symbol,
    Direction: e.direction,
    Entry: e.entryPrice,
    "Stop Loss": e.stopLossPrice,
    Target: e.targetPrice,
    "Lot Size": e.lotSize,
    "Risk %": e.riskPercent,
    "Risk $": e.riskAmount,
    "R:R": `1:${e.rewardRatio}`,
    Result: e.result,
    "Profit / Loss": e.profitLoss,
    Notes: e.notes ?? "",
  }));

  const stats = computeJournalStats(entries);
  const summary = [
    { Metric: "Total Trades", Value: stats.totalTrades },
    { Metric: "Wins", Value: stats.wins },
    { Metric: "Losses", Value: stats.losses },
    { Metric: "Win Rate %", Value: Number(stats.winRate.toFixed(2)) },
    { Metric: "Average R:R", Value: Number(stats.averageRR.toFixed(2)) },
    { Metric: "Average Profit", Value: Number(stats.averageProfit.toFixed(2)) },
    { Metric: "Average Loss", Value: Number(stats.averageLoss.toFixed(2)) },
    {
      Metric: "Profit Factor",
      Value: isFinite(stats.profitFactor) ? Number(stats.profitFactor.toFixed(2)) : "∞",
    },
    { Metric: "Net Profit", Value: Number(stats.netProfit.toFixed(2)) },
  ];

  const workbook = XLSX.utils.book_new();
  const tradesSheet = XLSX.utils.json_to_sheet(rows);
  const summarySheet = XLSX.utils.json_to_sheet(summary);

  XLSX.utils.book_append_sheet(workbook, tradesSheet, "Trades");
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  const stamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `propdesk-journal-${stamp}.xlsx`);
}
