import { InstrumentSpec, InstrumentSymbol } from "./types";

/**
 * Contract specifications for the supported instruments.
 *
 * For these USD-quoted instruments the value of a full 1.0 price move per
 * standard lot equals the contract size in USD, so:
 *   pipValuePerLot = pipSize * contractSize
 *
 *   EURUSD: 0.0001 * 100,000 = $10 per pip / lot
 *   GBPUSD: 0.0001 * 100,000 = $10 per pip / lot
 *   XAUUSD: 0.1    * 100     = $10 per pip / lot   (100 oz contract)
 */
export const INSTRUMENTS: Record<InstrumentSymbol, InstrumentSpec> = {
  EURUSD: {
    symbol: "EURUSD",
    label: "EUR / USD",
    contractSize: 100_000,
    pipSize: 0.0001,
    pointSize: 0.00001,
    priceDigits: 5,
    pipValuePerLot: 10,
    referencePrice: 1.085,
  },
  GBPUSD: {
    symbol: "GBPUSD",
    label: "GBP / USD",
    contractSize: 100_000,
    pipSize: 0.0001,
    pointSize: 0.00001,
    priceDigits: 5,
    pipValuePerLot: 10,
    referencePrice: 1.27,
  },
  XAUUSD: {
    symbol: "XAUUSD",
    label: "XAU / USD · Gold",
    contractSize: 100,
    pipSize: 0.1,
    pointSize: 0.01,
    priceDigits: 2,
    pipValuePerLot: 10,
    referencePrice: 2350,
  },
};

export const INSTRUMENT_LIST: InstrumentSpec[] = Object.values(INSTRUMENTS);

export function getInstrument(symbol: InstrumentSymbol): InstrumentSpec {
  return INSTRUMENTS[symbol];
}

export const RISK_REWARD_PRESETS = [1, 1.5, 2, 3, 4, 5];
