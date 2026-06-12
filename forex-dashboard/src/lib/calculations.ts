import { getInstrument } from "./instruments";
import {
  AccountMetrics,
  AccountState,
  JournalEntry,
  PositionMetrics,
  RiskScore,
  TradeState,
} from "./types";

const num = (v: number, fallback = 0) => (isFinite(v) ? v : fallback);

/* -------------------------------------------------------------------------- */
/*  Account / challenge metrics                                               */
/* -------------------------------------------------------------------------- */

export function computeAccountMetrics(account: AccountState): AccountMetrics {
  const {
    startingBalance,
    currentBalance,
    currentEquity,
    dailyDrawdownPct,
    maxDrawdownPct,
    profitTargetPct,
  } = account;

  // Drawdown limits are measured from the starting balance (typical static model).
  const dailyDrawdownLimitAmount = startingBalance * (dailyDrawdownPct / 100);
  const maxDrawdownLimitAmount = startingBalance * (maxDrawdownPct / 100);

  // Equity floor for the max drawdown rule.
  const maxDrawdownFloor = startingBalance - maxDrawdownLimitAmount;
  // Daily floor measured against today's opening (we approximate with current balance).
  const dailyDrawdownFloor = currentBalance - dailyDrawdownLimitAmount;

  // How much further equity can fall before each rule is breached.
  const remainingMaxDrawdown = Math.max(0, currentEquity - maxDrawdownFloor);
  const remainingDailyDrawdown = Math.max(0, currentEquity - dailyDrawdownFloor);

  // Profit / drawdown vs the starting balance.
  const currentProfit = currentBalance - startingBalance;
  const currentProfitPercent = startingBalance > 0 ? (currentProfit / startingBalance) * 100 : 0;

  // Current drawdown is only meaningful when below the starting balance.
  const drawdownReference = Math.max(startingBalance, currentBalance);
  const equityDrawdownAmount = Math.max(0, drawdownReference - currentEquity);
  const currentDrawdownAmount = Math.max(0, startingBalance - currentEquity);
  const currentDrawdownPercent =
    startingBalance > 0 ? (currentDrawdownAmount / startingBalance) * 100 : 0;

  // Profit target.
  const profitTargetAmount = startingBalance * (profitTargetPct / 100);
  const targetBalance = startingBalance + profitTargetAmount;
  const amountToProfitTarget = Math.max(0, targetBalance - currentBalance);
  const challengeCompletionPercent =
    profitTargetAmount > 0 ? clampPct((currentProfit / profitTargetAmount) * 100) : 0;

  return {
    dailyDrawdownLimitAmount,
    maxDrawdownLimitAmount,
    remainingDailyDrawdown,
    remainingMaxDrawdown,
    amountToProfitTarget,
    profitTargetAmount,
    currentDrawdownAmount,
    currentDrawdownPercent,
    currentProfit,
    currentProfitPercent,
    challengeCompletionPercent,
    equityDrawdownAmount,
  };
}

function clampPct(v: number): number {
  if (!isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
}

/* -------------------------------------------------------------------------- */
/*  Position sizing engine                                                    */
/* -------------------------------------------------------------------------- */

export function computePositionMetrics(
  trade: TradeState,
  account: AccountState,
): PositionMetrics {
  const spec = getInstrument(trade.symbol);
  const entry = num(trade.entryPrice);
  const stop = num(trade.stopLossPrice);
  const balance = num(account.currentBalance);
  const leverage = Math.max(1, num(account.leverage, 100));

  const priceDistance = Math.abs(entry - stop);
  const dollarRisk = balance * (num(trade.riskPercent) / 100);

  const empty: PositionMetrics = {
    valid: false,
    dollarRisk,
    lotSize: 0,
    units: 0,
    pipDistance: 0,
    pointDistance: 0,
    priceDistance: 0,
    marginRequired: 0,
    maxLoss: 0,
    potentialProfit: 0,
    targetPrice: entry,
    rewardAmount: 0,
    notionalValue: 0,
    pipValue: 0,
  };

  if (priceDistance <= 0 || dollarRisk <= 0 || entry <= 0) {
    return empty;
  }

  const pipDistance = priceDistance / spec.pipSize;
  const pointDistance = priceDistance / spec.pointSize;

  // Loss for a single standard lot at this stop distance.
  const lossPerLot = pipDistance * spec.pipValuePerLot;
  // Lot size auto-adjusts to keep dollar risk constant: wider stop -> smaller lots.
  const rawLotSize = dollarRisk / lossPerLot;
  const lotSize = Math.max(0, roundLot(rawLotSize));
  const units = lotSize * spec.contractSize;

  // Pip value for the chosen position size.
  const pipValue = spec.pipValuePerLot * lotSize;
  // Actual max loss using the (rounded) lot size.
  const maxLoss = pipDistance * pipValue;

  // Reward side.
  const rewardDistance = priceDistance * num(trade.riskRewardRatio);
  const targetPrice =
    trade.direction === "BUY" ? entry + rewardDistance : entry - rewardDistance;
  const potentialProfit = maxLoss * num(trade.riskRewardRatio);

  // Notional & margin.
  const notionalValue = units * entry;
  const marginRequired = notionalValue / leverage;

  return {
    valid: true,
    dollarRisk,
    lotSize,
    units,
    pipDistance,
    pointDistance,
    priceDistance,
    marginRequired,
    maxLoss,
    potentialProfit,
    targetPrice,
    rewardAmount: potentialProfit,
    notionalValue,
    pipValue,
  };
}

/** Round a lot size to a broker-friendly 0.01 increment. */
function roundLot(lot: number): number {
  return Math.round(lot * 100) / 100;
}

/* -------------------------------------------------------------------------- */
/*  Prop firm analysis                                                        */
/* -------------------------------------------------------------------------- */

export interface PropFirmAnalysis {
  riskPerTrade: number;
  losingTradesUntilDailyBreach: number;
  losingTradesUntilMaxBreach: number;
  limitingRule: "daily" | "max";
  losingTradesRemaining: number;
}

export function computePropFirmAnalysis(
  position: PositionMetrics,
  accountMetrics: AccountMetrics,
): PropFirmAnalysis {
  const riskPerTrade = position.maxLoss > 0 ? position.maxLoss : position.dollarRisk;

  const dailyTrades =
    riskPerTrade > 0 ? Math.floor(accountMetrics.remainingDailyDrawdown / riskPerTrade) : 0;
  const maxTrades =
    riskPerTrade > 0 ? Math.floor(accountMetrics.remainingMaxDrawdown / riskPerTrade) : 0;

  const losingTradesRemaining = Math.max(0, Math.min(dailyTrades, maxTrades));
  const limitingRule = dailyTrades <= maxTrades ? "daily" : "max";

  return {
    riskPerTrade,
    losingTradesUntilDailyBreach: Math.max(0, dailyTrades),
    losingTradesUntilMaxBreach: Math.max(0, maxTrades),
    limitingRule,
    losingTradesRemaining,
  };
}

/* -------------------------------------------------------------------------- */
/*  Target analysis                                                           */
/* -------------------------------------------------------------------------- */

export interface TargetAnalysis {
  profitNeeded: number;
  profitPerWin: number;
  winningTradesNeeded: number;
  targetReached: boolean;
}

export function computeTargetAnalysis(
  position: PositionMetrics,
  accountMetrics: AccountMetrics,
): TargetAnalysis {
  const profitNeeded = accountMetrics.amountToProfitTarget;
  const profitPerWin = position.potentialProfit;
  const targetReached = profitNeeded <= 0;
  const winningTradesNeeded =
    profitPerWin > 0 ? Math.ceil(profitNeeded / profitPerWin) : Infinity;

  return {
    profitNeeded,
    profitPerWin,
    winningTradesNeeded: targetReached ? 0 : winningTradesNeeded,
    targetReached,
  };
}

/* -------------------------------------------------------------------------- */
/*  Profit & loss simulator                                                   */
/* -------------------------------------------------------------------------- */

export interface PnLSimulation {
  win: { amount: number; percent: number; newBalance: number };
  loss: { amount: number; percent: number; newBalance: number };
}

export function computePnLSimulation(
  position: PositionMetrics,
  account: AccountState,
): PnLSimulation {
  const balance = num(account.currentBalance);
  const profit = position.potentialProfit;
  const loss = position.maxLoss;

  return {
    win: {
      amount: profit,
      percent: balance > 0 ? (profit / balance) * 100 : 0,
      newBalance: balance + profit,
    },
    loss: {
      amount: loss,
      percent: balance > 0 ? (loss / balance) * 100 : 0,
      newBalance: balance - loss,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Risk management score                                                     */
/* -------------------------------------------------------------------------- */

export function computeRiskScore(
  trade: TradeState,
  position: PositionMetrics,
  openPositions: number,
): RiskScore {
  let score = 100;
  const factors: RiskScore["factors"] = [];

  // Risk-per-trade penalty.
  const risk = num(trade.riskPercent);
  if (risk > 2) {
    score -= 40;
    factors.push({
      label: "Risk per trade",
      status: "danger",
      detail: `${risk.toFixed(2)}% is dangerous (> 2%).`,
    });
  } else if (risk > 1.5) {
    score -= 20;
    factors.push({
      label: "Risk per trade",
      status: "warning",
      detail: `${risk.toFixed(2)}% is elevated (> 1.5%).`,
    });
  } else if (risk > 0) {
    factors.push({
      label: "Risk per trade",
      status: "good",
      detail: `${risk.toFixed(2)}% is within a safe range.`,
    });
  }

  // Risk:reward penalty.
  const rr = num(trade.riskRewardRatio);
  if (rr > 0 && rr < 1.2) {
    score -= 25;
    factors.push({
      label: "Risk : reward",
      status: "danger",
      detail: `1:${rr.toFixed(2)} is poor (< 1:1.2).`,
    });
  } else if (rr >= 1.2 && rr < 1.5) {
    score -= 10;
    factors.push({
      label: "Risk : reward",
      status: "warning",
      detail: `1:${rr.toFixed(2)} is below ideal.`,
    });
  } else if (rr >= 1.5) {
    factors.push({
      label: "Risk : reward",
      status: "good",
      detail: `1:${rr.toFixed(2)} is a healthy ratio.`,
    });
  }

  // Open positions penalty.
  if (openPositions > 3) {
    score -= 25;
    factors.push({
      label: "Open positions",
      status: "danger",
      detail: `${openPositions} open trades increases correlated risk.`,
    });
  } else if (openPositions === 3) {
    score -= 10;
    factors.push({
      label: "Open positions",
      status: "warning",
      detail: `${openPositions} open trades — watch correlation.`,
    });
  } else {
    factors.push({
      label: "Open positions",
      status: "good",
      detail: `${openPositions} open trade${openPositions === 1 ? "" : "s"}.`,
    });
  }

  // Stop loss defined?
  if (!position.valid) {
    score -= 15;
    factors.push({
      label: "Stop loss",
      status: "warning",
      detail: "No valid stop loss / risk defined yet.",
    });
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let rating: RiskScore["rating"];
  if (score >= 80) rating = "SAFE";
  else if (score >= 60) rating = "MODERATE";
  else if (score >= 40) rating = "AGGRESSIVE";
  else rating = "DANGEROUS";

  return { score, rating, factors };
}

/* -------------------------------------------------------------------------- */
/*  Journal statistics                                                        */
/* -------------------------------------------------------------------------- */

export interface JournalStats {
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  averageRR: number;
  averageProfit: number;
  averageLoss: number;
  profitFactor: number;
  netProfit: number;
  grossProfit: number;
  grossLoss: number;
}

export function computeJournalStats(entries: JournalEntry[]): JournalStats {
  const closed = entries.filter((e) => e.result === "WIN" || e.result === "LOSS");
  const wins = closed.filter((e) => e.result === "WIN");
  const losses = closed.filter((e) => e.result === "LOSS");

  const grossProfit = wins.reduce((s, e) => s + Math.max(0, e.profitLoss), 0);
  const grossLoss = losses.reduce((s, e) => s + Math.abs(Math.min(0, e.profitLoss)), 0);
  const netProfit = entries.reduce((s, e) => s + (e.profitLoss || 0), 0);

  const averageRR =
    closed.length > 0
      ? closed.reduce((s, e) => s + (e.rewardRatio || 0), 0) / closed.length
      : 0;

  return {
    totalTrades: entries.length,
    wins: wins.length,
    losses: losses.length,
    winRate: closed.length > 0 ? (wins.length / closed.length) * 100 : 0,
    averageRR,
    averageProfit: wins.length > 0 ? grossProfit / wins.length : 0,
    averageLoss: losses.length > 0 ? grossLoss / losses.length : 0,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0,
    netProfit,
    grossProfit,
    grossLoss,
  };
}

/* -------------------------------------------------------------------------- */
/*  Equity / drawdown curve series for charts                                 */
/* -------------------------------------------------------------------------- */

export interface EquityPoint {
  label: string;
  equity: number;
  drawdownPercent: number;
}

export function buildEquityCurve(
  startingBalance: number,
  entries: JournalEntry[],
): EquityPoint[] {
  const closed = entries
    .filter((e) => e.result === "WIN" || e.result === "LOSS" || e.result === "BREAKEVEN")
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let equity = startingBalance;
  let peak = startingBalance;
  const points: EquityPoint[] = [
    { label: "Start", equity: startingBalance, drawdownPercent: 0 },
  ];

  closed.forEach((entry, i) => {
    equity += entry.profitLoss || 0;
    peak = Math.max(peak, equity);
    const drawdownPercent = peak > 0 ? ((peak - equity) / peak) * 100 : 0;
    points.push({
      label: `#${i + 1}`,
      equity,
      drawdownPercent,
    });
  });

  return points;
}
