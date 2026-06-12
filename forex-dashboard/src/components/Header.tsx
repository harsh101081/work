"use client";

import { useDashboard } from "@/context/DashboardContext";
import { RefreshIcon } from "./ui/icons";
import { formatCurrency, formatSignedPercent } from "@/lib/format";

export function Header() {
  const { account, accountMetrics, resetAll } = useDashboard();
  const profitUp = accountMetrics.currentProfit >= 0;

  return (
    <header className="sticky top-0 z-30 border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-soft shadow-glow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M14 7h7v7" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-white sm:text-lg">
              PropDesk
            </h1>
            <p className="hidden text-[11px] text-muted sm:block">
              Forex &amp; Prop Firm Trade Manager
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-3 rounded-xl border border-surface-border bg-surface px-4 py-2 md:flex">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-muted">Balance</p>
              <p className="text-sm font-semibold tnum text-white">
                {formatCurrency(account.currentBalance)}
              </p>
            </div>
            <div className="h-8 w-px bg-surface-border" />
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-muted">P&amp;L</p>
              <p
                className={`text-sm font-semibold tnum ${profitUp ? "text-success" : "text-danger"}`}
              >
                {formatSignedPercent(accountMetrics.currentProfitPercent)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm("Reset all account, trade and journal data to defaults?")) resetAll();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs font-semibold text-muted transition hover:border-danger/50 hover:text-danger"
            title="Reset all data"
          >
            <RefreshIcon width={15} height={15} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
