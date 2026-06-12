export type Impact = "High" | "Medium" | "Low";
export type EventCurrency = "USD" | "EUR" | "GBP";

export interface EconomicEvent {
  id: string;
  date: string; // ISO date (no time component significance beyond day)
  time: string; // local-style display time
  currency: EventCurrency;
  title: string;
  impact: Impact;
  forecast: string;
  previous: string;
}

interface Template {
  dayOffset: number; // days from "today"
  time: string;
  currency: EventCurrency;
  title: string;
  impact: Impact;
  forecast: string;
  previous: string;
}

/**
 * A representative rolling schedule of macro events that matter for EURUSD,
 * GBPUSD and XAUUSD. Offsets are relative to "now" so the widget always shows
 * an upcoming week. (Static sample data — not a live feed.)
 */
const TEMPLATES: Template[] = [
  { dayOffset: 0, time: "08:30", currency: "USD", title: "Core CPI (MoM)", impact: "High", forecast: "0.3%", previous: "0.4%" },
  { dayOffset: 0, time: "10:00", currency: "USD", title: "Fed Chair Speech", impact: "High", forecast: "—", previous: "—" },
  { dayOffset: 0, time: "04:00", currency: "EUR", title: "ECB Economic Bulletin", impact: "Medium", forecast: "—", previous: "—" },
  { dayOffset: 1, time: "07:00", currency: "GBP", title: "GDP (MoM)", impact: "High", forecast: "0.2%", previous: "0.1%" },
  { dayOffset: 1, time: "08:30", currency: "USD", title: "Unemployment Claims", impact: "Medium", forecast: "232K", previous: "229K" },
  { dayOffset: 1, time: "05:00", currency: "EUR", title: "Industrial Production", impact: "Low", forecast: "-0.1%", previous: "0.3%" },
  { dayOffset: 2, time: "08:30", currency: "USD", title: "Non-Farm Payrolls", impact: "High", forecast: "185K", previous: "175K" },
  { dayOffset: 2, time: "08:30", currency: "USD", title: "Average Hourly Earnings", impact: "Medium", forecast: "0.3%", previous: "0.2%" },
  { dayOffset: 3, time: "07:45", currency: "EUR", title: "ECB Rate Decision", impact: "High", forecast: "4.25%", previous: "4.25%" },
  { dayOffset: 3, time: "08:30", currency: "EUR", title: "ECB Press Conference", impact: "High", forecast: "—", previous: "—" },
  { dayOffset: 3, time: "02:00", currency: "GBP", title: "BoE Gov Speech", impact: "Medium", forecast: "—", previous: "—" },
  { dayOffset: 4, time: "07:00", currency: "GBP", title: "BoE Rate Decision", impact: "High", forecast: "5.00%", previous: "5.25%" },
  { dayOffset: 4, time: "10:00", currency: "USD", title: "ISM Services PMI", impact: "Medium", forecast: "51.8", previous: "51.4" },
  { dayOffset: 5, time: "09:00", currency: "EUR", title: "German Ifo Sentiment", impact: "Low", forecast: "88.2", previous: "87.9" },
  { dayOffset: 6, time: "08:30", currency: "USD", title: "Retail Sales (MoM)", impact: "High", forecast: "0.4%", previous: "0.2%" },
  { dayOffset: 6, time: "14:00", currency: "USD", title: "FOMC Meeting Minutes", impact: "High", forecast: "—", previous: "—" },
];

export function getUpcomingEvents(now: Date = new Date()): EconomicEvent[] {
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return TEMPLATES.map((t, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + t.dayOffset);
    return {
      id: `evt-${i}`,
      date: d.toISOString(),
      time: t.time,
      currency: t.currency,
      title: t.title,
      impact: t.impact,
      forecast: t.forecast,
      previous: t.previous,
    };
  });
}

export const IMPACT_META: Record<Impact, { dot: string; text: string }> = {
  High: { dot: "bg-danger", text: "text-danger" },
  Medium: { dot: "bg-warning", text: "text-warning" },
  Low: { dot: "bg-muted", text: "text-muted" },
};

export const CURRENCY_FLAG: Record<EventCurrency, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
};
