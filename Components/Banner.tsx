"use client";
import React from "react";
import Container from "./Container";
import { SleepTrackBtn } from "@/Action/SleepTrackBtn";
import { motion } from "framer-motion";
import { Flame, Moon, BrainCircuit, Sparkles } from "lucide-react";

const STATS = [
  {
    icon: <Flame size={20} className="text-orange-400" />,
    label: "Current Streak",
    value: "14 Days",
    sub: "Keep it going 🔥",
  },
  {
    icon: <Moon size={20} className="text-[#89CFF0]" />,
    label: "Sleep Quality",
    value: "92%",
    sub: "Above average",
  },
  {
    icon: <BrainCircuit size={20} className="text-[#B19CD9]" />,
    label: "Avg. Duration",
    value: "7.8 hrs",
    sub: "Near optimal",
  },
];

export const Banner = () => {
  return (
    <Container className="pt-20">
      <section className="flex flex-col lg:flex-row justify-between items-center gap-14">

        {/* ── LEFT: copy ── */}
        <motion.div
          initial={{ opacity: 0, x: -200 }}
          viewport={{ once: false, amount: 0.3 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="space-y-7 max-w-xl"
        >
          {/* pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm w-fit">
            <Sparkles size={13} className="text-yellow-300 fill-yellow-300" />
            <span className="text-xs font-semibold text-white tracking-wide">
              AI-Powered Sleep Coaching
            </span>
          </div>

          <h1 className="font-extrabold text-4xl lg:text-6xl text-white leading-tight">
            Sleep Better, <br />
            <span className="text-white/70">Every Single</span> Night.
          </h1>

          <p className="text-white/75 text-base lg:text-lg leading-relaxed max-w-md">
            Monitor your sleep patterns, build healthy streaks, and unlock
            AI-powered insights for deeper, more restorative rest.
          </p>

          <SleepTrackBtn />
        </motion.div>

        {/* ── RIGHT: stat cards ── */}
        <div className="flex flex-col gap-4 w-full lg:max-w-sm">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 200 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.13, ease: "easeInOut" }}
              whileHover={{ scale: 1.02, x: -4 }}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/55 font-medium">{stat.label}</p>
                <p className="text-2xl font-extrabold text-white leading-tight">{stat.value}</p>
                <p className="text-xs text-white/50 mt-0.5">{stat.sub}</p>
              </div>
              {/* decorative bar */}
              <div className="w-1 h-10 rounded-full bg-white/20 shrink-0" />
            </motion.div>
          ))}
        </div>

      </section>
    </Container>
  );
};
