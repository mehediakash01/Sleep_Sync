"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Flame, Lock, MoonStar, Sparkles, Star, Trophy } from "lucide-react";

const badges = [
  { name: "7-Day Champ", status: "Unlocked", icon: Trophy, active: true },
  { name: "Consistency Star", status: "Unlocked", icon: Star, active: true },
  { name: "Sleep Master", status: "In progress", icon: MoonStar, active: false },
  { name: "Recovery Flame", status: "In progress", icon: Flame, active: false },
];

export default function StreakPage() {
  return (
    <main className="premium-page relative min-h-screen overflow-hidden px-6 pb-24 pt-28 text-[var(--app-text)] lg:px-8">
      <div className="relative mx-auto max-w-7xl space-y-6">
        <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="premium-panel-strong rounded-[36px] p-8 lg:p-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-line)] bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9BC5FF]">
              <Flame className="h-4 w-4 text-[var(--app-accent-strong)]" />
              Streak progress
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em] lg:text-5xl">
              You&apos;re on fire. 14 nights strong.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--app-text-muted)]">
              Consistency is becoming visible now. Keep the same bedtime window and let small, repeatable wins compound into better mornings.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["Current streak", "14 nights"],
                ["Best run", "21 nights"],
                ["Next unlock", "21-day badge"],
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
                Log tonight
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--app-line)] bg-white/5 px-6 py-3.5 text-sm font-semibold text-[var(--app-text)] transition-colors duration-300 hover:bg-white/10"
              >
                View dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="premium-panel-strong rounded-[36px] p-8 lg:p-10"
          >
            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
              <div className="flex flex-col items-center justify-center">
                <div className="flex h-52 w-52 items-center justify-center rounded-full border border-[var(--app-line)] bg-[radial-gradient(circle,color-mix(in_srgb,var(--app-accent-strong)_18%,transparent),transparent_58%)]">
                  <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border border-[var(--app-accent-strong)]/30 bg-[var(--app-surface-muted)] shadow-[0_0_28px_rgba(0,229,194,0.16)]">
                    <Flame className="h-9 w-9 text-[var(--app-accent-strong)] animate-[breathe_4s_ease-in-out_infinite]" />
                    <p className="mt-3 text-5xl font-semibold tracking-[-0.04em]">14</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">night streak</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#9BC5FF]">Streak heatmap</p>
                <div className="mt-5 rounded-[28px] border border-[var(--app-line)] bg-white/5 p-5">
                  <div className="grid grid-cols-8 gap-2">
                    {Array.from({ length: 8 }).map((_, col) => (
                      <div key={col} className="grid gap-2">
                        {Array.from({ length: 7 }).map((__, row) => {
                          const value = (col * 7 + row + 3) % 5;
                          const color =
                            value === 0
                              ? "bg-white/5"
                              : value === 1
                                ? "bg-[#153D4A]"
                                : value === 2
                                  ? "bg-[#126B72]"
                                  : value === 3
                                    ? "bg-[#00BDA4]"
                                    : "bg-[var(--app-accent-strong)]";

                          return <div key={row} className={`h-8 rounded-xl ${color}`} />;
                        })}
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--app-text-muted)]">
                    Your consistency map shows a much steadier rhythm over the last eight weeks.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="premium-panel-strong rounded-[34px] p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[#9BC5FF]">Badges</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Your unlock gallery</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {badges.map(({ name, status, icon: Icon, active }) => (
                <div key={name} className="premium-panel rounded-[26px] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${active ? "bg-[var(--app-accent-strong)]/12 text-[var(--app-accent-strong)]" : "bg-white/5 text-[var(--app-text-muted)]"}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {active ? <CheckCircle2 className="h-5 w-5 text-[var(--app-accent-strong)]" /> : <Lock className="h-5 w-5 text-[var(--app-text-muted)]" />}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{name}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--app-text-muted)]">{status}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="premium-panel-strong rounded-[34px] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--app-accent-strong)]/12 text-[var(--app-accent-strong)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Motivation</p>
                  <p className="text-xs text-[var(--app-text-muted)]">What this streak means</p>
                </div>
              </div>
              <p className="mt-4 text-base leading-8 text-[var(--app-text-muted)]">
                Fourteen nights is no longer a lucky streak. Your rhythm is turning into an actual habit, and the sleep gains are getting easier to preserve.
              </p>
            </div>

            <div className="premium-panel-strong rounded-[34px] p-6">
              <p className="text-sm font-medium">Milestone progress</p>
              <div className="mt-5 rounded-[24px] bg-white/5 p-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--app-text-muted)]">
                  <span>14 / 21 nights</span>
                  <span>Next badge</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/8">
                  <div className="h-2 w-2/3 rounded-full bg-[linear-gradient(90deg,var(--app-accent-strong),var(--app-gradient-end))]" />
                </div>
              </div>
            </div>

            <div className="premium-panel-strong rounded-[34px] p-6">
              <p className="text-sm font-medium">Historical trend</p>
              <div className="mt-5 grid grid-cols-6 gap-3">
                {[5, 7, 9, 12, 14, 18].map((value, index) => (
                  <div key={value} className="space-y-3">
                    <div className="flex h-28 items-end rounded-full bg-white/[0.05] p-1">
                      <div
                        className="w-full rounded-full bg-[linear-gradient(180deg,var(--app-accent-strong),var(--app-gradient-end))]"
                        style={{ height: `${Math.min(100, value * 5)}%` }}
                      />
                    </div>
                    <p className="text-center text-[10px] uppercase tracking-[0.18em] text-[var(--app-text-muted)]">
                      W{index + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
