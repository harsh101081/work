"use client";

import { useRef, useState } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { Card } from "./ui/Card";
import { JournalStatsRow } from "./JournalStats";
import {
  JournalIcon,
  DownloadIcon,
  PlusIcon,
  TrashIcon,
  CameraIcon,
} from "./ui/icons";
import { JournalEntry, TradeResult } from "@/lib/types";
import { getInstrument } from "@/lib/instruments";
import { exportJournalToExcel } from "@/lib/excel";
import { readFileAsDataUrl, uid } from "@/lib/file";
import { formatCurrency, formatDate, formatPrice, formatSignedCurrency } from "@/lib/format";

const RESULT_META: Record<TradeResult, { label: string; cls: string }> = {
  WIN: { label: "Win", cls: "border-success/40 bg-success/10 text-success" },
  LOSS: { label: "Loss", cls: "border-danger/40 bg-danger/10 text-danger" },
  BREAKEVEN: { label: "B/E", cls: "border-surface-border bg-surface-muted text-muted" },
  PENDING: { label: "Open", cls: "border-accent/40 bg-accent/10 text-accent-glow" },
};

function pnlForResult(result: TradeResult, riskAmount: number, rr: number): number {
  switch (result) {
    case "WIN":
      return riskAmount * rr;
    case "LOSS":
      return -riskAmount;
    default:
      return 0;
  }
}

function JournalRow({
  entry,
  onUpdate,
  onRemove,
  onView,
}: {
  entry: JournalEntry;
  onUpdate: (patch: Partial<JournalEntry>) => void;
  onRemove: () => void;
  onView: (src: string) => void;
}) {
  const spec = getInstrument(entry.symbol);
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onUpdate({ screenshot: dataUrl });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  return (
    <tr className="border-b border-surface-border/50 text-sm hover:bg-surface-raised/30">
      <td className="whitespace-nowrap px-3 py-2.5 text-muted">{formatDate(entry.date)}</td>
      <td className="px-3 py-2.5 font-medium text-white">{entry.symbol}</td>
      <td className="px-3 py-2.5">
        <span
          className={`chip ${
            entry.direction === "BUY" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
          }`}
        >
          {entry.direction}
        </span>
      </td>
      <td className="px-3 py-2.5 tnum text-muted">{formatPrice(entry.entryPrice, spec.priceDigits)}</td>
      <td className="px-3 py-2.5 tnum text-danger/80">
        {formatPrice(entry.stopLossPrice, spec.priceDigits)}
      </td>
      <td className="px-3 py-2.5 tnum text-success/80">
        {formatPrice(entry.targetPrice, spec.priceDigits)}
      </td>
      <td className="px-3 py-2.5 tnum text-muted">{entry.lotSize.toFixed(2)}</td>
      <td className="px-3 py-2.5 tnum text-warning">{formatCurrency(entry.riskAmount)}</td>
      <td className="px-3 py-2.5">
        <select
          value={entry.result}
          onChange={(e) => {
            const result = e.target.value as TradeResult;
            onUpdate({
              result,
              profitLoss: pnlForResult(result, entry.riskAmount, entry.rewardRatio),
            });
          }}
          className={`rounded-md border px-2 py-1 text-xs font-semibold outline-none ${RESULT_META[entry.result].cls}`}
        >
          {(Object.keys(RESULT_META) as TradeResult[]).map((r) => (
            <option key={r} value={r} className="bg-surface text-white">
              {RESULT_META[r].label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-2.5">
        <input
          type="number"
          step={0.01}
          value={Number.isFinite(entry.profitLoss) ? entry.profitLoss : 0}
          onChange={(e) => onUpdate({ profitLoss: parseFloat(e.target.value) || 0 })}
          className={`w-24 rounded-md border border-surface-border bg-surface-muted px-2 py-1 text-right text-xs font-semibold tnum outline-none focus:border-accent ${
            entry.profitLoss > 0 ? "text-success" : entry.profitLoss < 0 ? "text-danger" : "text-white"
          }`}
        />
      </td>
      <td className="px-3 py-2.5">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {entry.screenshot ? (
          <button
            type="button"
            onClick={() => onView(entry.screenshot!)}
            className="group relative h-8 w-12 overflow-hidden rounded border border-surface-border"
            title="View screenshot"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={entry.screenshot} alt="trade" className="h-full w-full object-cover" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-surface-border text-muted transition hover:text-accent-glow"
            title="Upload screenshot"
          >
            <CameraIcon width={15} height={15} />
          </button>
        )}
        {error && <span className="ml-1 text-[10px] text-danger">{error}</span>}
      </td>
      <td className="px-3 py-2.5 text-right">
        <button
          type="button"
          onClick={onRemove}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-surface-border text-muted transition hover:border-danger/50 hover:text-danger"
          title="Delete trade"
        >
          <TrashIcon width={15} height={15} />
        </button>
      </td>
    </tr>
  );
}

export function TradingJournal() {
  const {
    journal,
    journalStats,
    trade,
    position,
    addJournalEntry,
    updateJournalEntry,
    removeJournalEntry,
    clearJournal,
  } = useDashboard();

  const [lightbox, setLightbox] = useState<string | null>(null);

  function logCurrentSetup() {
    if (!position.valid) return;
    const entry: JournalEntry = {
      id: uid(),
      date: new Date().toISOString(),
      symbol: trade.symbol,
      direction: trade.direction,
      entryPrice: trade.entryPrice,
      stopLossPrice: trade.stopLossPrice,
      targetPrice: position.targetPrice,
      lotSize: position.lotSize,
      riskAmount: position.maxLoss,
      riskPercent: trade.riskPercent,
      rewardRatio: trade.riskRewardRatio,
      result: "PENDING",
      profitLoss: 0,
    };
    addJournalEntry(entry);
  }

  return (
    <Card
      title="Trading Journal"
      subtitle={`${journal.length} trade${journal.length === 1 ? "" : "s"} logged`}
      icon={<JournalIcon />}
      action={
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={logCurrentSetup}
            disabled={!position.valid}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-accent-glow disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PlusIcon width={15} height={15} /> Log Setup
          </button>
          <button
            type="button"
            onClick={() => exportJournalToExcel(journal)}
            disabled={journal.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-muted px-3 py-1.5 text-xs font-semibold text-white transition hover:border-success/50 hover:text-success disabled:cursor-not-allowed disabled:opacity-40"
          >
            <DownloadIcon width={15} height={15} /> Export Excel
          </button>
          {journal.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Clear the entire trading journal?")) clearJournal();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-muted px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-danger/50 hover:text-danger"
            >
              <TrashIcon width={15} height={15} /> Clear
            </button>
          )}
        </div>
      }
    >
      <JournalStatsRow stats={journalStats} />

      <div className="mt-4 overflow-x-auto">
        {journal.length === 0 ? (
          <div className="rounded-lg border border-dashed border-surface-border bg-surface-muted/30 p-8 text-center">
            <p className="text-sm text-muted">No trades logged yet.</p>
            <p className="mt-1 text-xs text-muted">
              Set up a trade above, then press <span className="text-accent-glow">Log Setup</span> to
              start your journal.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[860px] border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-left text-[11px] uppercase tracking-wide text-muted">
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Pair</th>
                <th className="px-3 py-2 font-medium">Side</th>
                <th className="px-3 py-2 font-medium">Entry</th>
                <th className="px-3 py-2 font-medium">Stop</th>
                <th className="px-3 py-2 font-medium">Target</th>
                <th className="px-3 py-2 font-medium">Lot</th>
                <th className="px-3 py-2 font-medium">Risk</th>
                <th className="px-3 py-2 font-medium">Result</th>
                <th className="px-3 py-2 font-medium">P&amp;L</th>
                <th className="px-3 py-2 font-medium">Shot</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {journal.map((entry) => (
                <JournalRow
                  key={entry.id}
                  entry={entry}
                  onUpdate={(patch) => updateJournalEntry(entry.id, patch)}
                  onRemove={() => removeJournalEntry(entry.id)}
                  onView={(src) => setLightbox(src)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {journal.length > 0 && (
        <p className="mt-3 text-right text-xs text-muted">
          Net P&amp;L:{" "}
          <span
            className={`font-semibold tnum ${
              journalStats.netProfit >= 0 ? "text-success" : "text-danger"
            }`}
          >
            {formatSignedCurrency(journalStats.netProfit)}
          </span>
        </p>
      )}

      {/* Screenshot lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="trade screenshot"
            className="max-h-[85vh] max-w-[90vw] rounded-xl border border-surface-border shadow-2xl"
          />
        </div>
      )}
    </Card>
  );
}
