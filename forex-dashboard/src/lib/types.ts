export type InstrumentSymbol = "EURUSD" | "GBPUSD" | "XAUUSD";

export type TradeDirection = "BUY" | "SELL";

export type TradeResult = "WIN" | "LOSS" | "BREAKEVEN" | "PENDING";

/** Static contract specification used by the position-sizing engine. */
export interface InstrumentSpec {
  symbol: InstrumentSymbol;
  label: string;
  /** Number of base units in one standard lot (1.0). */
  contractSize: number;
  /** Price increment representing one conventional pip. */
  pipSize: number;
  /** Smallest quoted price increment (a "point"). */
  pointSize: number;
  /** Decimal places used when displaying the price. */
  priceDigits: number;
  /** USD value of a one-pip move for one standard lot. */
  pipValuePerLot: number;
  /** Typical reference price used for examples / fallbacks. */
  referencePrice: number;
}

/** User-controlled account / challenge parameters. */
export interface AccountState {
  startingBalance: number;
  currentBalance: number;
  currentEquity: number;
  dailyDrawdownPct: number;
  maxDrawdownPct: number;
  profitTargetPct: number;
  leverage: number;
}

/** User-controlled trade setup parameters. */
export interface TradeState {
  symbol: InstrumentSymbol;
  direction: TradeDirection;
  entryPrice: number;
  stopLossPrice: number;
  riskPercent: number;
  riskRewardRatio: number;
}

/** A persisted trading-journal entry. */
export interface JournalEntry {
  id: string;
  date: string;
  symbol: InstrumentSymbol;
  direction: TradeDirection;
  entryPrice: number;
  stopLossPrice: number;
  targetPrice: number;
  lotSize: number;
  riskAmount: number;
  riskPercent: number;
  rewardRatio: number;
  result: TradeResult;
  profitLoss: number;
  notes?: string;
  screenshot?: string;
}

/** Derived account analytics. */
export interface AccountMetrics {
  dailyDrawdownLimitAmount: number;
  maxDrawdownLimitAmount: number;
  remainingDailyDrawdown: number;
  remainingMaxDrawdown: number;
  amountToProfitTarget: number;
  profitTargetAmount: number;
  currentDrawdownAmount: number;
  currentDrawdownPercent: number;
  currentProfit: number;
  currentProfitPercent: number;
  challengeCompletionPercent: number;
  equityDrawdownAmount: number;
}

/** Derived position-sizing analytics. */
export interface PositionMetrics {
  valid: boolean;
  dollarRisk: number;
  lotSize: number;
  units: number;
  pipDistance: number;
  pointDistance: number;
  priceDistance: number;
  marginRequired: number;
  maxLoss: number;
  potentialProfit: number;
  targetPrice: number;
  rewardAmount: number;
  notionalValue: number;
  pipValue: number;
}

export type RiskRating = "SAFE" | "MODERATE" | "AGGRESSIVE" | "DANGEROUS";

export interface RiskScore {
  score: number;
  rating: RiskRating;
  factors: { label: string; status: "good" | "warning" | "danger"; detail: string }[];
}
