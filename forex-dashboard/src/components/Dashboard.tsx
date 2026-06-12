"use client";

import { useDashboard } from "@/context/DashboardContext";
import { Header } from "./Header";
import { DashboardCards } from "./DashboardCards";
import { AccountSection } from "./AccountSection";
import { TradeInputSection } from "./TradeInputSection";
import { PositionSizingPanel } from "./PositionSizingPanel";
import { PnLSimulator } from "./PnLSimulator";
import { PropFirmPanel } from "./PropFirmPanel";
import { TargetAnalysisPanel } from "./TargetAnalysisPanel";
import { RiskScorePanel } from "./RiskScorePanel";
import { ChartsSection } from "./ChartsSection";
import { EconomicCalendar } from "./EconomicCalendar";
import { TradingJournal } from "./TradingJournal";
import { DashboardSkeleton } from "./DashboardSkeleton";

function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3 mt-2 flex items-baseline gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h2>
      {hint && <span className="text-xs text-muted">{hint}</span>}
      <span className="h-px flex-1 bg-gradient-to-r from-surface-border to-transparent" />
    </div>
  );
}

export function Dashboard() {
  const { hydrated } = useDashboard();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        {!hydrated ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-8">
            {/* KPI overview */}
            <section>
              <SectionTitle title="Overview" hint="Live account & trade KPIs" />
              <DashboardCards />
            </section>

            {/* Inputs */}
            <section>
              <SectionTitle title="Setup" hint="Account parameters & trade entry" />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <AccountSection />
                <TradeInputSection />
              </div>
            </section>

            {/* Sizing & simulation */}
            <section>
              <SectionTitle title="Position & Simulation" hint="Auto position sizing" />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <PositionSizingPanel />
                <PnLSimulator />
              </div>
            </section>

            {/* Risk analysis */}
            <section>
              <SectionTitle title="Risk Analysis" hint="Prop firm rules, targets & discipline" />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <PropFirmPanel />
                <TargetAnalysisPanel />
                <RiskScorePanel />
              </div>
            </section>

            {/* Charts + calendar */}
            <section>
              <SectionTitle title="Analytics" hint="Performance visualisations & calendar" />
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 xl:items-start">
                <div className="xl:col-span-3">
                  <ChartsSection />
                </div>
                <div className="xl:col-span-1">
                  <EconomicCalendar />
                </div>
              </div>
            </section>

            {/* Journal */}
            <section>
              <SectionTitle title="Journal" hint="Logged trades & performance stats" />
              <TradingJournal />
            </section>

            <footer className="border-t border-surface-border pt-5 text-center">
              <p className="text-xs text-muted">
                PropDesk · For risk-management planning only. Figures are estimates — always confirm
                with your broker &amp; prop firm rules.
              </p>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}
