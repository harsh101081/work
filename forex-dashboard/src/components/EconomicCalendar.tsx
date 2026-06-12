"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "./ui/Card";
import { Skeleton } from "./ui/Skeleton";
import { CalendarIcon, NewsIcon } from "./ui/icons";
import {
  CURRENCY_FLAG,
  EconomicEvent,
  EventCurrency,
  IMPACT_META,
  Impact,
  getUpcomingEvents,
} from "@/lib/calendar";

const CURRENCIES: (EventCurrency | "ALL")[] = ["ALL", "USD", "EUR", "GBP"];
const IMPACTS: (Impact | "ALL")[] = ["ALL", "High", "Medium", "Low"];

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((d0 - t0) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function EconomicCalendar() {
  const [currency, setCurrency] = useState<EventCurrency | "ALL">("ALL");
  const [impact, setImpact] = useState<Impact | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EconomicEvent[]>([]);

  // Simulate a brief data fetch so the loading skeleton is exercised.
  useEffect(() => {
    const id = setTimeout(() => {
      setEvents(getUpcomingEvents(new Date()));
      setLoading(false);
    }, 650);
    return () => clearTimeout(id);
  }, []);

  const filtered = useMemo(
    () =>
      events.filter(
        (e) =>
          (currency === "ALL" || e.currency === currency) &&
          (impact === "ALL" || e.impact === impact),
      ),
    [events, currency, impact],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, EconomicEvent[]>();
    for (const e of filtered) {
      const key = dayLabel(e.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <Card
      title="Economic Calendar"
      subtitle="High-impact events for your pairs"
      icon={<CalendarIcon />}
      action={
        <span className="chip border border-surface-border bg-surface-muted text-muted">
          <NewsIcon width={13} height={13} /> News Filter
        </span>
      }
    >
      {/* News filter controls */}
      <div className="mb-4 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              className={`chip border transition ${
                currency === c
                  ? "border-accent bg-accent/15 text-accent-glow"
                  : "border-surface-border bg-surface-muted text-muted hover:text-white"
              }`}
            >
              {c === "ALL" ? "All FX" : `${CURRENCY_FLAG[c]} ${c}`}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {IMPACTS.map((im) => (
            <button
              key={im}
              type="button"
              onClick={() => setImpact(im)}
              className={`chip border transition ${
                impact === im
                  ? "border-accent bg-accent/15 text-accent-glow"
                  : "border-surface-border bg-surface-muted text-muted hover:text-white"
              }`}
            >
              {im !== "ALL" && (
                <span className={`h-2 w-2 rounded-full ${IMPACT_META[im].dot}`} />
              )}
              {im === "ALL" ? "All Impact" : im}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <p className="rounded-lg border border-surface-border bg-surface-muted/40 p-6 text-center text-sm text-muted">
          No events match your filter.
        </p>
      ) : (
        <div className="max-h-[360px] space-y-4 overflow-y-auto pr-1">
          {grouped.map(([day, dayEvents]) => (
            <div key={day}>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                {day}
              </p>
              <div className="space-y-1.5">
                {dayEvents.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 rounded-lg border border-surface-border bg-surface-muted/40 p-2.5"
                  >
                    <span className="w-12 shrink-0 text-xs tnum text-muted">{e.time}</span>
                    <span className="shrink-0 text-base" aria-hidden>
                      {CURRENCY_FLAG[e.currency]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{e.title}</p>
                      <p className="text-[11px] text-muted">
                        {e.currency} · F: {e.forecast} · P: {e.previous}
                      </p>
                    </div>
                    <span
                      className={`chip shrink-0 ${IMPACT_META[e.impact].text}`}
                      title={`${e.impact} impact`}
                    >
                      <span className={`h-2 w-2 rounded-full ${IMPACT_META[e.impact].dot}`} />
                      {e.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
