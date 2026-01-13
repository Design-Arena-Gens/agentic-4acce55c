"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { StatCard } from "@/components/StatCard";
import { calculateRelationshipStats, formatCountdown } from "@/lib/date";

const STORAGE_KEY = "agentic-relationship-start-date";

export default function Home() {
  const [startDateOverride, setStartDateOverride] = useState<string | null>(null);
  const isClient = typeof window !== "undefined";

  const storedStartDate = isClient ? window.localStorage.getItem(STORAGE_KEY) ?? "" : "";

  const startDate = startDateOverride ?? storedStartDate;

  const stats = useMemo(() => {
    if (!startDate) return null;
    const parsed = new Date(startDate);
    if (Number.isNaN(parsed.getTime())) return null;
    return calculateRelationshipStats(parsed, new Date());
  }, [startDate]);

  const todayLabel = useMemo(() => format(new Date(), "EEEE, MMMM d"), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-rose-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 pb-20 pt-16 sm:px-10 lg:px-16">
        <header className="flex flex-col gap-5">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Long distance dashboard
          </p>
          <h1 className="text-4xl font-light leading-tight sm:text-5xl">
            Count every day of your love story.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Set the day your journey together began and keep your shared milestones, next celebrations,
            and rituals in one quiet place you both can revisit.
          </p>
        </header>

        <section className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/70 p-8 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:shadow-[0_12px_32px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
                anchor date
              </p>
              <label htmlFor="start-date" className="mt-2 inline-block text-2xl font-light">
                When did your relationship begin?
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(event) => {
                  const next = event.target.value;
                  setStartDateOverride(next);
                  if (!next) {
                    window.localStorage.removeItem(STORAGE_KEY);
                  } else {
                    window.localStorage.setItem(STORAGE_KEY, next);
                  }
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-base font-medium text-slate-700 transition focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:border-white/20 dark:bg-white/10 dark:text-white dark:focus:border-rose-400 dark:focus:ring-rose-300/40"
              />
              {startDate ? (
                <button
                  type="button"
                  onClick={() => {
                    const today = format(new Date(), "yyyy-MM-dd");
                    setStartDateOverride(today);
                    window.localStorage.setItem(STORAGE_KEY, today);
                  }}
                  className="rounded-full border border-transparent bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white/80 dark:text-slate-900 dark:hover:bg-white"
                >
                  Today
                </button>
              ) : null}
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {startDate
              ? `Tracking your story through ${todayLabel}.`
              : "Pick your start date to begin tracking your shared days."}
          </p>
        </section>

        {stats ? (
          <>
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Days Together"
                value={stats.daysTogether.toLocaleString()}
                footer={`Since ${stats.formattedStart}`}
              />
              <StatCard
                title="Weeks"
                value={stats.weeksTogether.toFixed(1)}
                footer="Shared weeks of memories"
              />
              <StatCard
                title="Months"
                value={stats.monthsTogether.toFixed(1)}
                footer="Chapters in your story"
              />
              <StatCard
                title="Years"
                value={stats.yearsTogether.toFixed(2)}
                footer="Love across time zones"
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/10 dark:shadow-[0_12px_30px_rgba(15,23,42,0.32)]">
                <h2 className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  upcoming milestones
                </h2>
                <ul className="mt-6 flex flex-col gap-4">
                  {stats.nextMilestones.length === 0 ? (
                    <li className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500 dark:border-white/20 dark:text-slate-400">
                      You&apos;ve passed every milestone on this list — time to invent a new one together.
                    </li>
                  ) : (
                    stats.nextMilestones.map((milestone) => (
                      <li
                        key={milestone.label}
                        className="flex items-center justify-between rounded-2xl border border-transparent bg-white px-4 py-5 shadow-sm ring-1 ring-slate-200/70 transition hover:ring-rose-200 dark:bg-white/5 dark:ring-white/15 dark:hover:ring-rose-300/40"
                      >
                        <div>
                          <p className="text-base font-medium text-slate-900 dark:text-white">
                            {milestone.label}
                          </p>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {format(milestone.date, "EEEE, MMMM d")}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-rose-500 dark:text-rose-300">
                          {formatCountdown(milestone.date)}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/10 dark:shadow-[0_12px_30px_rgba(15,23,42,0.32)]">
                  <h2 className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    connection nudge
                  </h2>
                  <p className="mt-4 text-lg font-light text-slate-900 dark:text-white">
                    {stats.upcomingCallSuggestion.label}
                  </p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {format(stats.upcomingCallSuggestion.date, "eeee, MMMM d")} ·{" "}
                    {stats.upcomingCallSuggestion.daysAway < 0
                      ? "Overdue — reach out now"
                      : formatCountdown(stats.upcomingCallSuggestion.date)}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-rose-200/70 via-white/70 to-indigo-200/60 p-6 text-slate-800 shadow-[0_12px_30px_rgba(190,24,93,0.15)] dark:border-white/10 dark:from-rose-500/20 dark:via-white/10 dark:to-indigo-500/20 dark:text-white">
                  <h2 className="text-sm uppercase tracking-[0.3em] text-slate-600 dark:text-slate-200">
                    daily note
                  </h2>
                  <p className="mt-4 text-base leading-relaxed">
                    Send a voice memo about something ordinary from today — it keeps your worlds close even miles apart.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : isClient ? (
          <section className="rounded-3xl border border-dashed border-slate-300/70 bg-white/60 p-10 text-center text-slate-500 backdrop-blur-sm dark:border-white/20 dark:bg-white/5 dark:text-slate-400">
            Add your start date to unlock your timeline.
          </section>
        ) : null}
      </main>
    </div>
  );
}
