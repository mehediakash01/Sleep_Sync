"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Clock3, Flame, Waves } from "lucide-react";

type SleepLog = {
  date: string;
  duration: number;
  quality: number;
  bedTime: string;
  wakeTime: string;
};

type DashboardStats = {
  lastNightDuration: string;
  lastNightQuality: number;
  currentStreak: number;
  avgBedTime: string;
  avgWakeTime: string;
  avgDuration: number;
  avgQuality: number;
};

type RawSleepLog = {
  timeInBed: string;
  wakeUpTime: string;
  dateOfSession: string;
  sleepQuality: number | string;
};

export default function DashboardOverview() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    lastNightDuration: "--",
    lastNightQuality: 0,
    currentStreak: 0,
    avgBedTime: "--:--",
    avgWakeTime: "--:--",
    avgDuration: 0,
    avgQuality: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/sleepLogs?email=${session.user.email}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const logs = await res.json();
        if (!Array.isArray(logs) || logs.length === 0) {
          setLoading(false);
          return;
        }

        const processed = (logs as RawSleepLog[])
          .map((log) => {
            const start = new Date(log.timeInBed);
            const end = new Date(log.wakeUpTime);
            let duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            if (duration < 0) duration += 24;

            return {
              date: new Date(log.dateOfSession).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              duration: Number(duration.toFixed(1)),
              quality: Number(log.sleepQuality) || 0,
              bedTime: new Date(log.timeInBed).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
              wakeTime: new Date(log.wakeUpTime).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
            };
          })
          .filter((log) => log.duration > 0 && log.duration < 24);

        setSleepLogs(processed.slice(-7));

        if (processed.length > 0) {
          const lastNight = processed[processed.length - 1];
          const avgDur = processed.reduce((sum, log) => sum + log.duration, 0) / processed.length;
          const avgQual = processed.reduce((sum, log) => sum + log.quality, 0) / processed.length;

          let streak = 1;
          for (let i = processed.length - 1; i > 0; i -= 1) {
            const curr = new Date(processed[i].date);
            const prev = new Date(processed[i - 1].date);
            const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays <= 1) streak += 1;
            else break;
          }

          setStats({
            lastNightDuration: `${lastNight.duration}h`,
            lastNightQuality: lastNight.quality,
            currentStreak: streak,
            avgBedTime: lastNight.bedTime,
            avgWakeTime: lastNight.wakeTime,
            avgDuration: Number(avgDur.toFixed(1)),
            avgQuality: Number(avgQual.toFixed(1)),
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const score = useMemo(() => {
    if (!sleepLogs.length) return 0;
    const latest = sleepLogs[sleepLogs.length - 1];
    return Math.max(0, Math.min(100, Math.round(latest.quality * 10 || stats.avgQuality * 10)));
  }, [sleepLogs, stats.avgQuality]);

  if (!session) {
    return (
      <div className="premium-panel-strong mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center rounded-[36px] p-10 text-center">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#9BC5FF]">Dashboard locked</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">Please log in to view your sleep dashboard.</h1>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full bg-[var(--app-accent-strong)] px-6 py-3 text-sm font-semibold text-[#062019]"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="premium-panel-strong mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center rounded-[36px] p-10">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[var(--app-line)] border-t-[var(--app-accent-strong)]" />
          <p className="mt-4 text-sm text-[var(--app-text-muted)]">Loading your sleep data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="premium-panel-strong rounded-[34px] p-6 lg:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#9BC5FF]">{greeting()}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em]">
            {session.user?.name || "Sleeper"}, your recovery rhythm is taking shape.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--app-text-muted)]">
            Last night&apos;s data is ready. Review your score, spot the signal behind it, and carry the best parts into tonight.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Last duration", stats.lastNightDuration],
              ["Average bedtime", stats.avgBedTime],
              ["Current streak", `${stats.currentStreak} nights`],
            ].map(([label, value]) => (
              <div key={label} className="premium-panel rounded-[24px] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">{label}</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/sleepTracking"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--app-accent-strong)] px-6 py-3.5 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_14px_44px_rgba(0,229,194,0.22)] transition-all duration-300 hover:scale-[1.02]"
            >
              Log bedtime
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/AiCoach"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--app-line)] bg-white/5 px-6 py-3.5 text-sm font-semibold text-[var(--app-text)] transition-colors duration-300 hover:bg-white/10"
            >
              Ask AI coach
            </Link>
          </div>
        </div>

        <div className="premium-panel-strong rounded-[34px] p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9BC5FF]">Nightly score</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Recovery snapshot</h2>
            </div>
            <div className="rounded-full bg-[var(--app-accent-strong)]/12 px-3 py-1 text-xs font-medium text-[var(--app-accent-strong)]">
              +18% deep sleep
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
            <div className="flex items-center justify-center">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-[var(--app-line)] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,229,194,0.16)_0deg,rgba(0,229,194,0.92)_220deg,rgba(76,43,140,0.7)_305deg,rgba(255,255,255,0.06)_360deg)]">
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[var(--app-bg)]">
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Score</span>
                  <span className="mt-2 text-5xl font-semibold tracking-[-0.04em]">{score}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                ["Duration", stats.lastNightDuration || "--", "Steady"],
                ["Average quality", `${stats.avgQuality || 0}/10`, "Improving"],
                ["Wake time", stats.avgWakeTime, "Consistent"],
              ].map(([label, value, tag]) => (
                <div key={label} className="premium-panel rounded-[22px] px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--app-text-muted)]">{label}</p>
                      <p className="mt-1 text-xl font-medium">{value}</p>
                    </div>
                    <span className="rounded-full bg-[var(--app-accent-strong)]/12 px-3 py-1 text-xs font-medium text-[var(--app-accent-strong)]">
                      {tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="premium-panel-strong rounded-[34px] p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9BC5FF]">7-day trend</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Your sleep is stabilizing.</h2>
            </div>
            <div className="rounded-full border border-[var(--app-line)] bg-white/5 px-3 py-1 text-xs text-[var(--app-text-muted)]">
              Last 7 nights
            </div>
          </div>

          <div className="mt-8 grid grid-cols-7 gap-3">
            {sleepLogs.length > 0
              ? sleepLogs.map((log, index) => {
                  const height = Math.max(24, Math.round((log.quality || 1) * 10));
                  return (
                    <div key={`${log.date}-${index}`} className="space-y-3">
                      <div className="flex h-40 items-end rounded-full bg-white/[0.05] p-1">
                        <div
                          className="w-full rounded-full bg-[linear-gradient(180deg,var(--app-accent-strong),var(--app-gradient-end))]"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--app-text-muted)]">
                          {log.date}
                        </p>
                        <p className="mt-1 text-xs text-[var(--app-text)]">{log.duration}h</p>
                      </div>
                    </div>
                  );
                })
              : Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex h-40 items-end rounded-full bg-white/[0.05] p-1">
                      <div className="h-[18%] w-full rounded-full bg-[linear-gradient(180deg,var(--app-accent-strong),var(--app-gradient-end))]" />
                    </div>
                    <p className="text-center text-[10px] uppercase tracking-[0.18em] text-[var(--app-text-muted)]">Soon</p>
                  </div>
                ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-panel-strong rounded-[34px] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-accent-strong)]/12 text-[var(--app-accent-strong)]">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium">AI insight</p>
                <p className="text-xs text-[var(--app-text-muted)]">Behavior-based guidance</p>
              </div>
            </div>
            <p className="mt-5 text-base leading-8 text-[var(--app-text-muted)]">
              Last night your deep sleep likely improved because your timing stayed steadier. Keep the same pre-bed window and avoid a late scroll tonight.
            </p>
          </div>

          <div className="premium-panel-strong rounded-[34px] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-accent-strong)]/12 text-[var(--app-accent-strong)]">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium">Streak pulse</p>
                <p className="text-xs text-[var(--app-text-muted)]">Momentum is compounding</p>
              </div>
            </div>
            <p className="mt-4 text-4xl font-semibold tracking-[-0.04em]">{stats.currentStreak}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--app-text-muted)]">You&apos;re on fire. Consistency is making your recovery easier to trust.</p>
          </div>

          <div className="premium-panel-strong rounded-[34px] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-accent-strong)]/12 text-[var(--app-accent-strong)]">
                <Waves className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium">Tonight&apos;s ritual</p>
                <p className="text-xs text-[var(--app-text-muted)]">Suggested next action</p>
              </div>
            </div>
            <div className="mt-5 rounded-[24px] border border-[var(--app-line)] bg-white/5 p-4">
              <p className="font-medium">12-minute breathing reset</p>
              <p className="mt-2 text-sm leading-7 text-[var(--app-text-muted)]">A short breathing flow can lower alertness before bed and help you hold onto tonight&apos;s recovery gains.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-panel-strong rounded-[34px] p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9BC5FF]">Recent logs</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Your latest nights, at a glance.</h2>
          </div>
          <Link
            href="/dashboard/sleepHistory"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--app-line)] bg-white/5 px-4 py-2.5 text-sm font-medium text-[var(--app-text)] transition-colors duration-300 hover:bg-white/10"
          >
            Full history
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-[var(--app-line)]">
          <div className="grid grid-cols-4 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">
            <span>Date</span>
            <span>Duration</span>
            <span>Bedtime</span>
            <span>Wake</span>
          </div>
          <div className="divide-y divide-[var(--app-line)]">
            {(sleepLogs.slice(-5).length ? sleepLogs.slice(-5) : [{ date: "No logs", duration: 0, quality: 0, bedTime: "--", wakeTime: "--" }]).map((log, index) => (
              <div key={`${log.date}-${index}`} className="grid grid-cols-4 px-4 py-4 text-sm text-[var(--app-text)]">
                <span>{log.date}</span>
                <span>{log.duration ? `${log.duration}h` : "--"}</span>
                <span>{log.bedTime}</span>
                <span>{log.wakeTime}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          ["Wind-down", "Screens off by 10:30 PM improved your rhythm."],
          ["Recovery cue", "Try repeating the same wake time tomorrow."],
          ["Sleep window", `Average duration: ${stats.avgDuration || 0}h over recent logs.`],
        ].map(([title, body]) => (
          <div key={title} className="premium-panel rounded-[28px] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--app-accent-strong)]/12 text-[var(--app-accent-strong)]">
                <Clock3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.02em]">{title}</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--app-text-muted)]">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
