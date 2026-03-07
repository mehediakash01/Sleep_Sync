"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/Components/Container";
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  CalendarCheck,
  Trophy,
  Flame,
  Star,
} from "lucide-react";
import { FaFireAlt } from "react-icons/fa";

//  Milestones
const MILESTONES = [
  { days: 3,   label: "3-Day Starter",     emoji: "", color: "from-green-400 to-emerald-500",   unlocked: true  },
  { days: 7,   label: "7-Day Champ",       emoji: "", color: "from-yellow-400 to-amber-500",    unlocked: true  },
  { days: 14,  label: "2-Week Warrior",    emoji: "", color: "from-blue-400 to-cyan-500",       unlocked: false },
  { days: 30,  label: "Monthly Master",    emoji: "", color: "from-orange-400 to-red-500",      unlocked: false },
  { days: 60,  label: "Sleep Enthusiast",  emoji: "", color: "from-purple-400 to-fuchsia-500",  unlocked: false },
  { days: 100, label: "Sleep Legend",      emoji: "", color: "from-pink-500 to-rose-600",       unlocked: false },
];

//  Steps
const STEPS = [
  {
    icon: <CalendarCheck size={28} className="text-[#89CFF0]" />,
    title: "Log Every Night",
    desc: "Open the app, log your bedtime and wake-up time. Takes under 30 seconds.",
    step: "01",
  },
  {
    icon: <Flame size={28} className="text-orange-400" />,
    title: "Build Your Streak",
    desc: "Log consecutive nights to grow your streak. Miss a day and it resets  so stay consistent!",
    step: "02",
  },
  {
    icon: <Trophy size={28} className="text-amber-500" />,
    title: "Unlock Milestones",
    desc: "Hit 3, 7, 14, 30, 60 and 100-night milestones to earn badges and celebrate your progress.",
    step: "03",
  },
];

//  Demo Heatmap
function DemoHeatmap() {
  const seed = [1,0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1,0,1,1];
  const weeks = Array.from({ length: 16 }, (_, wi) =>
    Array.from({ length: 7 }, (_, di) => {
      if (wi < 3) return 0;
      const s = seed[(wi * 7 + di) % seed.length];
      if (!s) return 0;
      const q = ((wi * 3 + di * 2) % 3) + 3;
      return q;
    })
  );
  const color = (v: number) => {
    if (v === 0) return "bg-gray-100 dark:bg-gray-700";
    if (v === 3) return "bg-yellow-300";
    if (v === 4) return "bg-green-400";
    return "bg-emerald-500";
  };
  return (
    <div className="flex gap-[3px]">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((val, di) => (
            <motion.div
              key={di}
              className={`w-3 h-3 rounded-sm ${color(val)}`}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0 }}
              transition={{ delay: (wi * 7 + di) * 0.003, duration: 0.18 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

//  Animated Counter
const DEMO_STEPS = [1, 5, 7, 14, 21, 30];

function AnimatedCounter() {
  const [idx, setIdx] = useState(0);
  const val = DEMO_STEPS[idx];

  useEffect(() => {
    const t = setTimeout(() => setIdx((p) => (p + 1) % DEMO_STEPS.length), 1800);
    return () => clearTimeout(t);
  }, [idx]);

  const nextM = MILESTONES.find((m) => m.days > val);
  const progress = nextM ? Math.min((val / nextM.days) * 100, 100) : 100;
  const next = DEMO_STEPS[(idx + 1) % DEMO_STEPS.length];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex flex-col items-center justify-center w-52 h-52 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-2xl shadow-orange-200">
        <FaFireAlt className="text-5xl text-white/80 mb-1" />
        <motion.p
          key={val}
          initial={{ opacity: 0, y: 20, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-6xl font-extrabold text-white leading-none"
        >
          {val}
        </motion.p>
        <p className="text-white/80 text-sm font-medium mt-1">
          day{val !== 1 ? "s" : ""} streak
        </p>
      </div>

      {nextM && (
        <div className="w-48">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{val} days</span>
            <span>Next: {nextM.days}d {nextM.emoji}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400">
        Next demo value:{" "}
        <span className="font-semibold text-orange-400">{next}</span>-day streak
      </p>
    </div>
  );
}

//  Page
export default function StreakPage() {
  return (
    <div className="bg-gradient-to-b from-[#f0f9ff] via-white to-[#fdf4ff] min-h-screen">

      {/* HERO */}
      <Container className="pt-28 pb-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            className="max-w-xl space-y-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200">
              <FaFireAlt className="text-orange-500 text-sm" />
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                Streak System
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Sleep Better,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                Every Night.
              </span>
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed">
              Build a streak like Duolingo  but for your health. Log your sleep
              consistently, hit milestones, and unlock badges as you go.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/streak"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold shadow-lg hover:shadow-orange-200 hover:scale-105 transition-all duration-200"
              >
                View My Streaks <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard/sleepTracking"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold hover:border-orange-300 hover:text-orange-500 transition-all duration-200"
              >
                Log Tonights Sleep
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <AnimatedCounter />
          </motion.div>
        </div>
      </Container>

      {/* HOW IT WORKS */}
      <Container className="pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-extrabold text-gray-800">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#89CFF0] to-[#B19CD9]">
              Streaks Work
            </span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Three simple steps to turn sleep into a rewarding daily habit.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <span className="absolute top-4 right-5 text-6xl font-extrabold text-gray-50 select-none leading-none">
                {step.step}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* HEATMAP PREVIEW */}
      <div className="bg-white py-20">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-14">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex-1 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#89CFF0]/15 border border-[#89CFF0]/30">
                <Star size={14} className="text-[#4a9fc0]" />
                <span className="text-xs font-semibold text-[#4a9fc0] uppercase tracking-wider">
                  Activity Heatmap
                </span>
              </div>
              <h2 className="text-4xl font-extrabold text-gray-800 leading-tight">
                See Your Consistency{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#89CFF0] to-[#B19CD9]">
                  at a Glance
                </span>
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Your personal heatmap shows every night you logged, color-coded
                by sleep quality. Like a GitHub contribution graph  but for your
                health. Build a wall of green.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-gray-400">Quality:</span>
                {[
                  { color: "bg-gray-100", label: "None" },
                  { color: "bg-yellow-300", label: "Fair" },
                  { color: "bg-green-400", label: "Good" },
                  { color: "bg-emerald-500", label: "Excellent" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-sm ${l.color}`} />
                    <span className="text-xs text-gray-400">{l.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm overflow-x-auto"
            >
              <p className="text-xs text-gray-400 mb-3 font-medium">
                Last 16 weeks (demo)
              </p>
              <DemoHeatmap />
            </motion.div>
          </div>
        </Container>
      </div>

      {/* MILESTONE BADGES */}
      <Container className="py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-extrabold text-gray-800">
            Earn{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Milestone Badges
            </span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Six badges to unlock across your sleep journey. The rarer the badge,
            the sweeter the achievement.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.days}
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: i * 0.09,
                type: "spring",
                stiffness: 200,
                damping: 18,
              }}
              whileHover={{ scale: 1.07, y: -4 }}
              className={`relative flex flex-col items-center p-5 rounded-2xl border text-center cursor-default transition-shadow duration-200 hover:shadow-lg ${
                m.unlocked
                  ? `bg-gradient-to-br ${m.color} text-white border-transparent shadow-md`
                  : "bg-white border-gray-100 text-gray-400"
              }`}
            >
              <div className="absolute top-2.5 right-2.5">
                {m.unlocked ? (
                  <CheckCircle2 size={14} className="text-white/80" />
                ) : (
                  <Lock size={12} className="text-gray-300" />
                )}
              </div>
              <div className={`text-4xl mb-2 ${m.unlocked ? "" : "grayscale opacity-30"}`}>
                {m.emoji}
              </div>
              <p className={`text-xs font-bold leading-tight ${m.unlocked ? "text-white" : "text-gray-600"}`}>
                {m.label}
              </p>
              <p className={`text-[11px] mt-1 ${m.unlocked ? "text-white/75" : "text-gray-400"}`}>
                {m.days} nights
              </p>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* CTA */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center text-white space-y-6"
          >
            <p className="text-6xl"></p>
            <h2 className="text-4xl font-extrabold">
              Your streak starts tonight.
            </h2>
            <p className="text-white/80 text-lg max-w-md mx-auto">
              Every legend started at Day 1. Log your sleep tonight and ignite
              your first flame.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/dashboard/sleepTracking"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-orange-500 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Log Tonights Sleep <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard/streak"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/20 border border-white/40 text-white font-semibold hover:bg-white/30 transition-all duration-200"
              >
                View My Dashboard
              </Link>
            </div>
          </motion.div>
        </Container>
      </div>

    </div>
  );
}
