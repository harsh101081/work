"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AccountMetrics,
  AccountState,
  JournalEntry,
  PositionMetrics,
  RiskScore,
  TradeState,
} from "@/lib/types";
import {
  PnLSimulation,
  PropFirmAnalysis,
  TargetAnalysis,
  buildEquityCurve,
  computeAccountMetrics,
  computeJournalStats,
  computePnLSimulation,
  computePositionMetrics,
  computePropFirmAnalysis,
  computeRiskScore,
  computeTargetAnalysis,
  EquityPoint,
  JournalStats,
} from "@/lib/calculations";
import { STORAGE_KEYS, loadState, saveState } from "@/lib/storage";

const DEFAULT_ACCOUNT: AccountState = {
  startingBalance: 2500,
  currentBalance: 2488.76,
  currentEquity: 2488.76,
  dailyDrawdownPct: 3,
  maxDrawdownPct: 6,
  profitTargetPct: 3,
  leverage: 100,
};

const DEFAULT_TRADE: TradeState = {
  symbol: "XAUUSD",
  direction: "BUY",
  entryPrice: 2350.0,
  stopLossPrice: 2347.5,
  riskPercent: 0.6,
  riskRewardRatio: 2,
};

interface DashboardContextValue {
  account: AccountState;
  trade: TradeState;
  journal: JournalEntry[];
  openPositions: number;
  hydrated: boolean;

  setAccount: (patch: Partial<AccountState>) => void;
  setTrade: (patch: Partial<TradeState>) => void;
  setOpenPositions: (n: number) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (id: string, patch: Partial<JournalEntry>) => void;
  removeJournalEntry: (id: string) => void;
  clearJournal: () => void;
  resetAll: () => void;

  accountMetrics: AccountMetrics;
  position: PositionMetrics;
  propFirm: PropFirmAnalysis;
  targetAnalysis: TargetAnalysis;
  pnl: PnLSimulation;
  riskScore: RiskScore;
  journalStats: JournalStats;
  equityCurve: EquityPoint[];
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccountState] = useState<AccountState>(DEFAULT_ACCOUNT);
  const [trade, setTradeState] = useState<TradeState>(DEFAULT_TRADE);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [openPositions, setOpenPositionsState] = useState<number>(0);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    setAccountState(loadState(STORAGE_KEYS.account, DEFAULT_ACCOUNT));
    setTradeState(loadState(STORAGE_KEYS.trade, DEFAULT_TRADE));
    setJournal(loadState<JournalEntry[]>(STORAGE_KEYS.journal, []));
    setOpenPositionsState(loadState<number>(STORAGE_KEYS.openPositions, 0));
    setHydrated(true);
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (hydrated) saveState(STORAGE_KEYS.account, account);
  }, [account, hydrated]);
  useEffect(() => {
    if (hydrated) saveState(STORAGE_KEYS.trade, trade);
  }, [trade, hydrated]);
  useEffect(() => {
    if (hydrated) saveState(STORAGE_KEYS.journal, journal);
  }, [journal, hydrated]);
  useEffect(() => {
    if (hydrated) saveState(STORAGE_KEYS.openPositions, openPositions);
  }, [openPositions, hydrated]);

  const setAccount = useCallback((patch: Partial<AccountState>) => {
    setAccountState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setTrade = useCallback((patch: Partial<TradeState>) => {
    setTradeState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setOpenPositions = useCallback((n: number) => {
    setOpenPositionsState(Math.max(0, Math.floor(n)));
  }, []);

  const addJournalEntry = useCallback((entry: JournalEntry) => {
    setJournal((prev) => [entry, ...prev]);
  }, []);

  const updateJournalEntry = useCallback((id: string, patch: Partial<JournalEntry>) => {
    setJournal((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const removeJournalEntry = useCallback((id: string) => {
    setJournal((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearJournal = useCallback(() => setJournal([]), []);

  const resetAll = useCallback(() => {
    setAccountState(DEFAULT_ACCOUNT);
    setTradeState(DEFAULT_TRADE);
    setJournal([]);
    setOpenPositionsState(0);
  }, []);

  // Derived analytics.
  const accountMetrics = useMemo(() => computeAccountMetrics(account), [account]);
  const position = useMemo(
    () => computePositionMetrics(trade, account),
    [trade, account],
  );
  const propFirm = useMemo(
    () => computePropFirmAnalysis(position, accountMetrics),
    [position, accountMetrics],
  );
  const targetAnalysis = useMemo(
    () => computeTargetAnalysis(position, accountMetrics),
    [position, accountMetrics],
  );
  const pnl = useMemo(() => computePnLSimulation(position, account), [position, account]);
  const riskScore = useMemo(
    () => computeRiskScore(trade, position, openPositions),
    [trade, position, openPositions],
  );
  const journalStats = useMemo(() => computeJournalStats(journal), [journal]);
  const equityCurve = useMemo(
    () => buildEquityCurve(account.startingBalance, journal),
    [account.startingBalance, journal],
  );

  const value: DashboardContextValue = {
    account,
    trade,
    journal,
    openPositions,
    hydrated,
    setAccount,
    setTrade,
    setOpenPositions,
    addJournalEntry,
    updateJournalEntry,
    removeJournalEntry,
    clearJournal,
    resetAll,
    accountMetrics,
    position,
    propFirm,
    targetAnalysis,
    pnl,
    riskScore,
    journalStats,
    equityCurve,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return ctx;
}
