"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Card } from "./ui/Card";
import { NumberField, SelectField } from "./ui/Field";
import { CalculatorIcon, BoltIcon } from "./ui/icons";
import { INSTRUMENT_LIST, RISK_REWARD_PRESETS, getInstrument } from "@/lib/instruments";
import { InstrumentSymbol, TradeDirection } from "@/lib/types";

const RISK_PRESETS = [0.25, 0.5, 1, 1.5, 2];

export function TradeInputSection() {
  const { trade, setTrade, account, openPositions, setOpenPositions } = useDashboard();
  const spec = getInstrument(trade.symbol);

  const isCustomRR = !RISK_REWARD_PRESETS.includes(trade.riskRewardRatio);

  return (
    <Card title="Trade Setup" subtitle="Define your entry & stop" icon={<CalculatorIcon />}>
      <div className="grid grid-cols-2 gap-3">
        <SelectField<InstrumentSymbol>
          label="Trading Pair"
          value={trade.symbol}
          onChange={(symbol) => {
            const next = getInstrument(symbol);
            // Reseed prices with a sensible default when switching markets.
            setTrade({
              symbol,
              entryPrice: next.referencePrice,
              stopLossPrice:
                trade.direction === "BUY"
                  ? next.referencePrice - next.pipSize * 25
                  : next.referencePrice + next.pipSize * 25,
            });
          }}
          options={INSTRUMENT_LIST.map((i) => ({ value: i.symbol, label: i.label }))}
        />

        <div>
          <span className="field-label">Direction</span>
          <div className="grid grid-cols-2 gap-2">
            {(["BUY", "SELL"] as TradeDirection[]).map((d) => {
              const active = trade.direction === d;
              const isBuy = d === "BUY";
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setTrade({ direction: d })}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? isBuy
                        ? "border-success bg-success/15 text-success"
                        : "border-danger bg-danger/15 text-danger"
                      : "border-surface-border bg-surface-muted text-muted hover:text-white"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <NumberField
          label="Entry Price"
          step={spec.pipSize}
          value={trade.entryPrice}
          onChange={(v) => setTrade({ entryPrice: v })}
        />
        <NumberField
          label="Stop Loss Price"
          step={spec.pipSize}
          value={trade.stopLossPrice}
          onChange={(v) => setTrade({ stopLossPrice: v })}
        />
      </div>

      <div className="mt-3">
        <NumberField
          label="Risk Percentage (of balance)"
          suffix="%"
          step={0.05}
          value={trade.riskPercent}
          onChange={(v) => setTrade({ riskPercent: v })}
          hint={`≈ ${(account.currentBalance * (trade.riskPercent / 100)).toFixed(2)} USD at risk`}
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="mr-1 inline-flex items-center gap-1 text-[11px] text-muted">
            <BoltIcon width={13} height={13} /> Quick risk
          </span>
          {RISK_PRESETS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTrade({ riskPercent: r })}
              className={`chip border transition ${
                trade.riskPercent === r
                  ? "border-accent bg-accent/15 text-accent-glow"
                  : "border-surface-border bg-surface-muted text-muted hover:text-white"
              }`}
            >
              {r}%
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <span className="field-label">Risk : Reward Ratio</span>
        <div className="flex flex-wrap gap-1.5">
          {RISK_REWARD_PRESETS.map((rr) => (
            <button
              key={rr}
              type="button"
              onClick={() => setTrade({ riskRewardRatio: rr })}
              className={`chip border transition ${
                trade.riskRewardRatio === rr
                  ? "border-accent bg-accent/15 text-accent-glow"
                  : "border-surface-border bg-surface-muted text-muted hover:text-white"
              }`}
            >
              1:{rr}
            </button>
          ))}
          <span
            className={`chip border ${
              isCustomRR
                ? "border-accent bg-accent/15 text-accent-glow"
                : "border-surface-border bg-surface-muted text-muted"
            }`}
          >
            Custom
            <input
              type="number"
              step={0.1}
              min={0.1}
              value={trade.riskRewardRatio}
              onChange={(e) => setTrade({ riskRewardRatio: parseFloat(e.target.value) || 0 })}
              className="ml-1 w-12 bg-transparent text-right text-xs font-semibold text-white outline-none tnum"
            />
          </span>
        </div>
      </div>

      <div className="mt-4">
        <NumberField
          label="Open Positions (correlated risk)"
          step={1}
          min={0}
          value={openPositions}
          onChange={(v) => setOpenPositions(v)}
        />
      </div>
    </Card>
  );
}
