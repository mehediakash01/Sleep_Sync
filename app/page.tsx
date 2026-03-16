"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Flame,
  LineChart,
  MessageSquareHeart,
  MoonStar,
  Play,
  ShieldCheck,
  Sparkles,
  Stars,
  TrendingUp,
  Waves,
  Zap,
} from "lucide-react";

const benefits: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: BrainCircuit,
    title: "Adaptive nightly coaching",
    body: "Personalized guidance that turns raw sleep data into calm, useful next steps.",
  },
  {
    icon: Activity,
    title: "Beautiful recovery tracking",
    body: "Wake up to a premium score view that shows what improved and why.",
  },
  {
    icon: Flame,
    title: "Streaks with restraint",
    body: "Consistency feels motivating and mature, never noisy or overly gamified.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Sleep routines stay personal while insights feel trustworthy and grounded.",
  },
];

const features: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: LineChart,
    title: "30-day trend intelligence",
    body: "See the signals behind your best nights and what quietly disrupts recovery.",
  },
  {
    icon: MessageSquareHeart,
    title: "Empathetic AI coach",
    body: "Ask for a wind-down routine, travel reset, or a clean explanation of last night.",
  },
  {
    icon: Zap,
    title: "Fast nightly logging",
    body: "Capture bedtime, wake time, and mood in seconds without breaking the ritual.",
  },
  {
    icon: Waves,
    title: "Breathing and wind-downs",
    body: "Preview a short calming routine right where your sleep insights already live.",
  },
  {
    icon: TrendingUp,
    title: "Actionable patterns",
    body: "Know what changed, what helped, and what is worth repeating tonight.",
  },
  {
    icon: Sparkles,
    title: "Designed to feel restorative",
    body: "Massive whitespace, soft glass surfaces, and motion that supports calm.",
  },
];

const steps = [
  [
    "01",
    "Track your night",
    "Log bedtime, wake time, mood, and wearable data with almost no friction.",
  ],
  [
    "02",
    "Understand the pattern",
    "See the signals behind your score, from timing and efficiency to deep sleep.",
  ],
  [
    "03",
    "Get a personal plan",
    "Receive tailored coaching prompts instead of generic wellness advice.",
  ],
  [
    "04",
    "Build momentum",
    "Turn better nights into a visible streak that compounds into better days.",
  ],
] as const;

const quotes = [
  [
    "The interface feels as calm as the product promise. I open it before bed and instantly know what to do next.",
    "Ava Chen",
    "Product Lead",
  ],
  [
    "I finally understand why some nights felt good and others did not. The AI coach explains patterns without overwhelming me.",
    "Marcus Reed",
    "Founder",
  ],
  [
    "The streak system is motivating in a mature way. It feels like a premium health product, not gamified noise.",
    "Sofia Alvarez",
    "Creative Director",
  ],
] as const;

const stars = [
  "left-[6%] top-[12%]",
  "left-[14%] top-[28%]",
  "left-[22%] top-[10%]",
  "left-[31%] top-[19%]",
  "left-[40%] top-[8%]",
  "left-[50%] top-[14%]",
  "left-[58%] top-[26%]",
  "left-[68%] top-[12%]",
  "left-[78%] top-[18%]",
  "left-[88%] top-[9%]",
  "left-[12%] top-[62%]",
  "left-[25%] top-[80%]",
  "left-[38%] top-[68%]",
  "left-[52%] top-[78%]",
  "left-[66%] top-[60%]",
  "left-[79%] top-[76%]",
  "left-[92%] top-[70%]",
];

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const shell =
  "rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl";
const eyebrow =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9BC5FF]";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A1428] text-[#F5F0E8]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(76,43,140,0.42),_transparent_32%),radial-gradient(circle_at_20%_20%,_rgba(0,229,194,0.12),_transparent_18%),linear-gradient(180deg,_#091224_0%,_#0A1428_42%,_#08101E_100%)]" />
        <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(76,43,140,0.48)_0%,_rgba(30,27,75,0.2)_45%,_transparent_75%)] blur-3xl" />
        <div className="absolute right-[-5rem] top-40 h-80 w-80 rounded-full bg-[#00E5C2]/10 blur-3xl" />
        <div className="absolute left-[-6rem] top-[28rem] h-72 w-72 rounded-full bg-[#4C2B8C]/30 blur-3xl" />
        {stars.map((star, index) => (
          <span
            key={star}
            className={`absolute ${star} h-1 w-1 rounded-full bg-white/70 shadow-[0_0_14px_rgba(255,255,255,0.5)] animate-[stardust_7s_ease-in-out_infinite]`}
            style={{ animationDelay: `${index * 0.35}s` }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <section className="mx-auto grid min-h-screen max-w-7xl gap-16 px-6 pb-16 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24 lg:pt-40">
          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.05}
            className="flex  max-w-2xl flex-col justify-center gap-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9BC5FF] w-fit">
              <Stars className="h-4 w-4 text-[#00E5C2]" />
              AI-Powered Sleep Coaching Platform
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl flex flex-col font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Sleep Better.
                <span className="mt-4">Live Better.</span>
              </h1>
              <p className="max-w-xl text-base leading-8 text-[#F5F0E8]/72 sm:text-lg">
                AI sleep coaching that understands you. Track. Understand.
                Improve. Every night, with a calm ritual that turns data into
                confidence.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#00E5C2] px-7 py-4 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_40px_rgba(0,229,194,0.25)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_16px_56px_rgba(0,229,194,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00E5C2]"
              >
                Start Free
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#dashboard-preview"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-7 py-4 text-sm font-semibold backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#00E5C2]/40 hover:bg-white/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00E5C2]"
              >
                <Play className="h-4 w-4 text-[#00E5C2]" />
                Watch Demo
              </Link>
            </div>

            <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl sm:grid-cols-3">
              {[
                ["92", "Average recovery score after 30 nights"],
                ["18%", "Higher deep sleep after guided wind-downs"],
                ["14-day", "Streaks become visible and motivating fast"],
              ].map(([value, label]) => (
                <div key={value}>
                  <p className="text-3xl font-semibold tracking-[-0.03em]">
                    {value}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-[#F5F0E8]/64">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.18}
            className="relative flex min-h-[520px] items-center justify-center lg:min-h-[680px]"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 top-20 hidden w-56 rounded-[28px] border border-white/12 bg-[#111B31]/80 p-5 backdrop-blur-2xl lg:block"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#F5F0E8]/45">
                    Tonight
                  </p>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
                    92
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#00E5C2]/35 bg-[#00E5C2]/12 text-[#00E5C2] shadow-[0_0_24px_rgba(0,229,194,0.18)]">
                  <MoonStar className="h-7 w-7" />
                </div>
              </div>
              <div className="space-y-3 text-sm text-[#F5F0E8]/68">
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5">
                  <span>Deep sleep</span>
                  <span className="font-medium text-[#F5F0E8]">2h 08m</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5">
                  <span>Consistency</span>
                  <span className="font-medium text-[#F5F0E8]">14 nights</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-14 right-2 hidden w-64 rounded-[30px] border border-white/10 bg-[#121B32]/82 p-5 backdrop-blur-2xl lg:block"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00E5C2]/14 text-[#00E5C2]">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI Coach</p>
                  <p className="text-xs text-[#F5F0E8]/50">
                    Suggested for tonight
                  </p>
                </div>
              </div>
              <p className="text-sm leading-7 text-[#F5F0E8]/72">
                “Your deep sleep rose 18% when screens ended before 10:30 PM.
                Want a 12-minute wind-down tonight?”
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 0.8, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full  rounded-[40px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            >
              <div className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(12,19,36,0.96),rgba(9,14,28,0.92))] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#F5F0E8]/45">
                      Sleep Dashboard
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                      Last night
                    </p>
                  </div>
                  <div className="rounded-full border border-[#00E5C2]/25 bg-[#00E5C2]/10 px-3 py-1 text-xs font-medium text-[#00E5C2]">
                    Synced 6:42 AM
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                  <div className="rounded-[28px]  border border-white/10 bg-white/5 p-5">
                    <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle,_rgba(0,229,194,0.16),_transparent_58%)]">
                      <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-[#00E5C2]/35 bg-[#091224]/80 text-center shadow-[0_0_30px_rgba(0,229,194,0.16)]">
                        <span className="text-xs uppercase tracking-[0.18em] text-[#F5F0E8]/48">
                          Score
                        </span>
                        <span className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-[#00E5C2]">
                          92
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 space-y-3">
                      {[
                        ["Duration", "8h 14m"],
                        ["Efficiency", "95%"],
                        ["Deep Sleep", "2h 08m"],
                        ["REM Sleep", "1h 46m"],
                        ["Light Sleep", "4h 20m"],
                        ["Awake Time", "18m"],
                        ["Bedtime", "10:47 PM"],
["Wake Time", "7:01 AM"],

                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between rounded-2xl bg-[#F5F0E8]/[0.04] px-3 py-2 text-sm"
                        >
                          <span className="text-[#F5F0E8]/62">{label}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            7-night recovery trend
                          </p>
                          <p className="text-xs text-[#F5F0E8]/48">
                            A steadier bedtime is lifting your baseline
                          </p>
                        </div>
                        <div className="rounded-full bg-[#00E5C2]/12 px-3 py-1 text-xs font-medium text-[#00E5C2]">
                          +18%
                        </div>
                      </div>
                      <div className="flex h-28 items-end gap-3">
                        {[40, 56, 52, 68, 70, 82, 92].map((value, index) => (
                          <div
                            key={value}
                            className="flex flex-1 flex-col items-center gap-3"
                          >
                            <div className="flex h-24 w-full items-end rounded-full bg-white/[0.03] p-1">
                              <motion.div
                                initial={{ height: 0 }}
                                whileInView={{ height: `${value}%` }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.8,
                                  delay: index * 0.08,
                                }}
                                className="w-full rounded-full bg-[linear-gradient(180deg,rgba(0,229,194,0.95),rgba(76,43,140,0.8))]"
                              />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.18em] text-[#F5F0E8]/38">
                              {["M", "T", "W", "T", "F", "S", "S"][index]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-1">
                      {[
                        [
                          "Next ritual",
                          "12 min breathing",
                          "Lower your resting alertness before bed.",
                        ],
                        [
                          "Coach note",
                          "Screens off by 10:30",
                          "Repeating this pattern is likely to improve REM tonight.",
                        ],
                      ].map(([eyebrowText, title, body]) => (
                        <div
                          key={title}
                          className="rounded-[24px] border border-white/10 bg-[#0E1730]/92 p-4"
                        >
                          <p className="text-xs uppercase tracking-[0.18em] text-[#F5F0E8]/42">
                            {eyebrowText}
                          </p>
                          <p className="mt-3 text-lg font-medium">{title}</p>
                          <p className="mt-2 text-sm leading-7 text-[#F5F0E8]/58">
                            {body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="grid gap-4 rounded-[32px] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-2xl md:grid-cols-4">
            {[
              "Used by recovery-focused teams",
              "Built for wearable-linked routines",
              "Designed for calm nightly rituals",
              "AI guidance with human tone",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-[#F5F0E8]/70"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00E5C2]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            custom={0}
            className="max-w-2xl space-y-4"
          >
            <div className={eyebrow}>Benefits</div>
            <h2 className="text-4xl flex flex-col gap-3 font-semibold tracking-[-0.03em] sm:text-5xl">
              A sleep platform designed to{" "}
              <span>feel restorative before you</span>{" "}
              <span>even read the data.</span>
            </h2>
            <p className="text-base leading-8 text-[#F5F0E8]/66 sm:text-lg">
              Every surface is built to help you feel calm, informed, and ready
              to act, not buried under charts you have to decode yourself.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, body }, index) => (
              <motion.article
                key={title}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                custom={0.08 + index * 0.08}
                className={`${shell} group p-7 transition-all duration-300 hover:scale-[1.02] hover:border-[#00E5C2]/25 hover:shadow-[0_24px_80px_rgba(0,0,0,0.26)]`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00E5C2]/20 bg-[#00E5C2]/10 text-[#00E5C2] transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-[#F5F0E8]/66">
                  {body}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        <section
          id="dashboard-preview"
          className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
        >
          <div className="lg:flex   gap-10 justify-center">
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              custom={0}
              className="space-y-6 sm:mb-8"
            >
              <div className={eyebrow}>Live Dashboard Preview</div>
              <h2 className="text-4xl  flex flex-col gap-3 font-semibold tracking-[-0.03em] sm:text-5xl">
                Your entire sleep story, <span>translated into </span>{" "}
                <span>one beautiful view.</span>
              </h2>
              <p className="text-base leading-8 text-[#F5F0E8]/66 sm:text-lg">
                A premium dashboard with score rings, streak momentum, and AI
                context that tells you what mattered and what to repeat.
              </p>
              <div className="space-y-3 text-sm leading-7 text-[#F5F0E8]/68">
                {[
                  "Nightly score circle with deeper breakdowns",
                  "7 and 30-day trends with quick comparisons",
                  "AI insight card with behavior-based explanations",
                  "Fast bedtime logging and routine suggestions",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#00E5C2]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.12}
              className={`${shell} bg-[#111A31]/82 p-6`}
            >
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <div className={`${shell} p-6`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">Morning score</p>
                        <p className="mt-2 text-sm leading-7 text-[#F5F0E8]/54">
                          Recovery is up thanks to steadier sleep timing.
                        </p>
                      </div>
                      <div className="rounded-full bg-[#00E5C2]/12 px-3 py-1 text-xs font-medium text-[#00E5C2]">
                        +6 vs avg
                      </div>
                    </div>
                    <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
                      <div className="flex items-center justify-center">
                        <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/10 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,229,194,0.12)_0deg,rgba(0,229,194,0.95)_212deg,rgba(76,43,140,0.62)_300deg,rgba(255,255,255,0.06)_360deg)]">
                          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#0A1428] shadow-[0_0_30px_rgba(0,229,194,0.12)]">
                            <span className="text-xs uppercase tracking-[0.18em] text-[#F5F0E8]/46">
                              Sleep score
                            </span>
                            <span className="mt-2 text-5xl font-semibold tracking-[-0.04em]">
                              92
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        {[
                          ["Duration", "8h 14m", "Excellent"],
                          ["Efficiency", "95%", "Steady"],
                          ["Deep sleep", "2h 08m", "Improved"],
                        ].map(([label, value, tag]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between rounded-[22px] border border-white/8 bg-[#0D1630]/88 px-4 py-3"
                          >
                            <div>
                              <p className="text-sm text-[#F5F0E8]/58">
                                {label}
                              </p>
                              <p className="mt-1 text-lg font-medium">
                                {value}
                              </p>
                            </div>
                            <span className="rounded-full bg-[#00E5C2]/12 px-3 py-1 text-xs font-medium text-[#00E5C2]">
                              {tag}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`${shell} p-6`}>
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Trend overview</p>
                        <p className="text-xs text-[#F5F0E8]/48">
                          Recovery has become more stable across the last month
                        </p>
                      </div>
                      <LineChart className="h-5 w-5 text-[#F5F0E8]/42" />
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                      {[61, 68, 66, 73, 74, 82, 92].map((value, index) => (
                        <div key={value} className="space-y-3">
                          <div className="flex h-28 items-end rounded-full bg-white/[0.04] p-1">
                            <motion.div
                              initial={{ height: 0 }}
                              whileInView={{ height: `${value}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.85,
                                delay: index * 0.08,
                              }}
                              className="w-full rounded-full bg-[linear-gradient(180deg,rgba(0,229,194,0.92),rgba(76,43,140,0.82))]"
                            />
                          </div>
                          <p className="text-center text-[10px] uppercase tracking-[0.18em] text-[#F5F0E8]/34">
                            {["M", "T", "W", "T", "F", "S", "S"][index]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                       <div className={`${shell} p-6`}>
                    <p className="text-sm font-medium">Current streak</p>
                    <div className="mt-4 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-4xl font-semibold tracking-[-0.03em]">
                          14 nights
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[#F5F0E8]/58">
                          You&apos;re on fire. Consistency is becoming your
                          superpower.
                        </p>
                      </div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00E5C2]/12 text-[#00E5C2] shadow-[0_0_30px_rgba(0,229,194,0.16)]">
                        <Flame className="h-7 w-7" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 lg:w-80">
                  <div
                    className={`${shell} bg-[linear-gradient(180deg,rgba(16,28,53,0.92),rgba(8,16,30,0.92))] p-6`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00E5C2]/12 text-[#00E5C2]">
                        <Bot className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">AI Insight</p>
                        <p className="text-xs text-[#F5F0E8]/46">
                          Generated from your recent pattern
                        </p>
                      </div>
                    </div>
                    <p className="mt-5 text-lg leading-8 text-[#F5F0E8]/78">
                      Last night your deep sleep improved 18%. The strongest
                      signal: screens ended earlier and your bedtime stayed
                      within a 20-minute window.
                    </p>
                    <div className="mt-5 rounded-[22px] border border-[#00E5C2]/14 bg-[#00E5C2]/8 p-4 text-sm leading-7 text-[#C6FFF5]">
                      Suggested tonight: repeat the same timing and use a short
                      breathing routine at 10:15 PM.
                    </div>
                  </div>

                  <div className={`${shell} p-6`}>
                    <p className="text-sm font-medium">
                      Tonight&apos;s routine
                    </p>
                    <div className="mt-5 space-y-4">
                      {[
                        "Log bedtime in one tap",
                        "Start 12-minute breath session",
                        "Review coach note before lights out",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-[20px] bg-white/[0.04] px-4 py-3"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00E5C2]/12 text-[#00E5C2]">
                            <CheckCircle2 className="h-4 w-4" />
                          </span>
                          <span className="text-sm text-[#F5F0E8]/72">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

             
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={0}
              className="space-y-6"
            >
              <div className={eyebrow}>Features</div>
              <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Premium product details that turn data into trust.
              </h2>
              <p className="text-base leading-8 text-[#F5F0E8]/66 sm:text-lg">
                This is wellness software designed with restraint: fewer
                distractions, better context, and tiny interactions that make
                the product feel alive.
              </p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {features.map(({ icon: Icon, title, body }, index) => (
                <motion.article
                  key={title}
                  variants={rise}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={0.08 + index * 0.06}
                  className={`${shell} p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00E5C2]/20 hover:shadow-[0_20px_64px_rgba(0,0,0,0.28)]`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00E5C2]/10 text-[#00E5C2]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-8 text-[#F5F0E8]/62">
                    {body}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            custom={0}
            className="mx-auto max-w-2xl space-y-4 text-center"
          >
            <div className={eyebrow}>How It Works</div>
            <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Four calm steps from bedtime to better days.
            </h2>
            <p className="text-base leading-8 text-[#F5F0E8]/66 sm:text-lg">
              A moon-phase inspired timeline that mirrors how SleepSync builds
              clarity and momentum night after night.
            </p>
          </motion.div>

          <div className="relative mt-14 grid gap-6 lg:grid-cols-4">
            <div className="absolute left-10 right-10 top-10 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)] lg:block" />
            {steps.map(([step, title, body], index) => (
              <motion.article
                key={step}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.22 }}
                custom={0.08 + index * 0.08}
                className={`${shell} relative p-7`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#00E5C2]/18 bg-[#0E1730] text-lg font-semibold text-[#00E5C2] shadow-[0_0_24px_rgba(0,229,194,0.14)]">
                    {step}
                  </div>
                  <MoonStar className="h-5 w-5 text-[#F5F0E8]/36" />
                </div>
                <p className="mt-6 text-xs uppercase tracking-[0.24em] text-[#9BC5FF]">
                  Moon phase {step}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-[#F5F0E8]/62">
                  {body}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              custom={0}
              className="space-y-6"
            >
              <div className={eyebrow}>Streak System</div>
              <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Consistency becomes visible, elegant, and deeply motivating.
              </h2>
              <p className="text-base leading-8 text-[#F5F0E8]/66 sm:text-lg">
                SleepSync turns routine into momentum with a streak interface
                that feels premium, not gamified. Celebrate real effort with a
                flame that earns its glow.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/Streak"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3.5 text-sm font-semibold backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#00E5C2]/40"
                >
                  Explore Streaks
                  <ArrowRight className="h-4 w-4 text-[#00E5C2]" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-[#00E5C2] transition-colors duration-300 hover:text-[#7EF7E2]"
                >
                  Begin your first night
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.12}
              className={`${shell} bg-[#111B32]/80 p-6`}
            >
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className={`${shell} p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#F5F0E8]/58">
                        Current streak
                      </p>
                      <p className="mt-2 text-5xl font-semibold tracking-[-0.04em]">
                        14
                      </p>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00E5C2]/12 text-[#00E5C2] shadow-[0_0_30px_rgba(0,229,194,0.18)]">
                      <Flame className="h-8 w-8 animate-[breathe_4s_ease-in-out_infinite]" />
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-8 text-[#F5F0E8]/66">
                    You&apos;re on fire. Fourteen nights of consistency is
                    lifting your recovery baseline and making better sleep feel
                    repeatable.
                  </p>
                  <div className="mt-6 rounded-[24px] bg-[#0D1630]/90 p-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#F5F0E8]/38">
                      <span>Next badge</span>
                      <span>21 nights</span>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/8">
                      <div className="h-2 w-2/3 rounded-full bg-[linear-gradient(90deg,#00E5C2,#4C2B8C)]" />
                    </div>
                  </div>
                </div>

                <div className={`${shell} p-6`}>
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm font-medium">Consistency heatmap</p>
                    <span className="text-xs text-[#F5F0E8]/42">
                      Last 8 weeks
                    </span>
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((column) => (
                      <div key={column} className="grid gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map((row) => {
                          const value = (column * 7 + row + 2) % 5;
                          const color =
                            value === 0
                              ? "bg-white/5"
                              : value === 1
                                ? "bg-[#153D4A]"
                                : value === 2
                                  ? "bg-[#126B72]"
                                  : value === 3
                                    ? "bg-[#00BDA4]"
                                    : "bg-[#00E5C2]";

                          return (
                            <div
                              key={row}
                              className={`h-7 rounded-lg ${color}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              custom={0}
              className={`${shell} bg-[#111B32]/80 p-6`}
            >
              <div
                className={`${shell} bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00E5C2]/12 text-[#00E5C2] shadow-[0_0_24px_rgba(0,229,194,0.18)]">
                    <Bot className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Sleep Coach</p>
                    <p className="text-sm text-[#F5F0E8]/48">
                      Empathetic, contextual, and ready every morning
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="ml-auto max-w-md rounded-[24px] border border-[#00E5C2]/14 bg-[#00E5C2]/8 px-5 py-4 text-sm leading-7 text-[#D5FFF8]">
                    I noticed my REM felt low. What should I change tonight?
                  </div>
                  <div className="max-w-xl rounded-[24px] border border-white/10 bg-[#0D1630]/90 px-5 py-4 text-sm leading-7 text-[#F5F0E8]/72">
                    Your bedtime drifted later for two nights, which often cuts
                    into REM. Want a 20-minute wind-down that helps you reset
                    without feeling strict?
                  </div>
                  <div className="ml-auto max-w-sm rounded-[24px] border border-[#00E5C2]/14 bg-[#00E5C2]/8 px-5 py-4 text-sm leading-7 text-[#D5FFF8]">
                    Yes. Keep it realistic for work travel.
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {[
                    "Travel reset",
                    "Wind-down plan",
                    "Explain my score",
                    "Breathing cue",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#F5F0E8]/70 transition-colors duration-300 hover:border-[#00E5C2]/30 hover:text-[#F5F0E8]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              custom={0.12}
              className="space-y-6"
            >
              <div className={eyebrow}>AI Coach Preview</div>
              <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                An AI coach that sounds reassuring, not robotic.
              </h2>
              <p className="text-base leading-8 text-[#F5F0E8]/66 sm:text-lg">
                Ask about last night, request a wind-down routine, or get a
                short explanation of what changed. The tone stays warm, precise,
                and useful.
              </p>
              <div className="space-y-3 text-sm leading-7 text-[#F5F0E8]/66">
                {[
                  "Context-aware coaching built around your trends",
                  "Natural prompts for bedtime, stress, travel, and recovery",
                  "A calmer interpretation layer between you and the raw metrics",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00E5C2]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/AiCoach"
                className="inline-flex items-center gap-2 rounded-full bg-[#00E5C2] px-6 py-3.5 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_40px_rgba(0,229,194,0.22)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_16px_52px_rgba(0,229,194,0.3)]"
              >
                Meet the Coach
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            custom={0}
            className="mx-auto max-w-2xl space-y-4 text-center"
          >
            <div className={eyebrow}>Testimonials</div>
            <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Trusted by people who want better nights without noisy wellness
              fluff.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {quotes.map(([quote, name, role], index) => (
              <motion.article
                key={name}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                custom={0.08 + index * 0.08}
                className={`${shell} p-7`}
              >
                <p className="text-lg leading-8 text-[#F5F0E8]/78">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1E1B4B,#4C2B8C)] text-sm font-semibold">
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-[#F5F0E8]/48">{role}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28 pt-8 lg:px-8">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            custom={0}
            className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(135deg,rgba(30,27,75,0.86),rgba(76,43,140,0.7),rgba(0,229,194,0.14))] px-8 py-12 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:px-12 lg:px-16 lg:py-16"
          >
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(0,229,194,0.18),_transparent_56%)] lg:block" />
            <div className="relative z-10 max-w-3xl">
              <div className={eyebrow}>Final CTA</div>
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Your first AI insight is one night away.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#F5F0E8]/76 sm:text-lg">
                Build a calmer bedtime ritual, see your progress, and let
                SleepSync turn your nights into your superpower.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00E5C2] px-7 py-4 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_14px_44px_rgba(0,229,194,0.26)] transition-all duration-300 hover:scale-[1.03]"
                >
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/AiCoach"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/5 px-7 py-4 text-sm font-semibold backdrop-blur-2xl transition-all duration-300 hover:border-[#00E5C2]/35 hover:bg-white/8"
                >
                  Preview the Coach
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes stardust {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 0 rgba(0, 229, 194, 0.15));
          }
          50% {
            transform: scale(1.08);
            filter: drop-shadow(0 0 14px rgba(0, 229, 194, 0.4));
          }
        }
      `}</style>
    </main>
  );
}
