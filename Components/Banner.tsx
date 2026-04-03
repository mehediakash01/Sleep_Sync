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
    icon: <Moon size={20} className="text-secondary" />,
    label: "Sleep Quality",
    value: "92%",
    sub: "Above average",
  },
  {
    icon: <BrainCircuit size={20} className="text-primary" />,
    label: "Avg. Duration",
    value: "7.8 hrs",
    sub: "Near optimal",
  },
];

export const Banner = () => {
  return (
    <Container className="pt-20 pb-12 lg:pb-20">
      <section className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-12">
        {/* ── LEFT: Hero Copy (Asymmetrical Positioning) ── */}
        <motion.div
          initial={{ opacity: 0, x: -200 }}
          viewport={{ once: false, amount: 0.3 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="space-y-8 max-w-2xl lg:pt-6"
        >
          {/* Pill Badge with Ghost Border */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full surface-high ghost-border w-fit backdrop-blur-[20px]"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Sparkles size={14} className="text-secondary fill-secondary" />
            <span className="text-label-sm text-[var(--on-surface-variant)]">
              AI-Powered Sleep Insights
            </span>
          </motion.div>

          {/* Display Typography - Hero Headline */}
          <motion.h1 
            className="font-display text-display-lg font-medium text-[var(--on-surface)] leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            Sleep Better,{" "}
            <span className="text-[var(--on-surface-variant)]">
              Every Single
            </span>{" "}
            Night.
          </motion.h1>

          {/* Body Copy */}
          <motion.p 
            className="text-body-md text-[var(--on-surface-variant)] leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Monitor your sleep patterns, build healthy streaks, and unlock
            AI-powered insights for deeper, more restorative rest.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <SleepTrackBtn />
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Stat Cards (Floating Layout) ── */}
        <div className="w-full lg:w-auto lg:max-w-sm space-y-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 200, y: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ scale: 1.03, x: -6, y: -2 }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
              className="glass-dark rounded-lg p-5 group shadow-ambient hover:shadow-glass transition-smooth"
            >
              <div className="flex items-center gap-4">
                {/* Icon Container with Surface Nesting */}
                <div className="w-12 h-12 rounded-lg surface-highest flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-label-sm text-[var(--on-surface-variant)]">
                    {stat.label}
                  </p>
                  <p className="text-title-lg font-semibold text-[var(--on-surface)] mt-1 leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[var(--on-surface-variant)]/70 mt-0.5">
                    {stat.sub}
                  </p>
                </div>

                {/* Decorative Accent (Breathing Effect) */}
                <div className="w-1 h-12 rounded-full bg-gradient-to-b from-secondary to-primary shrink-0 opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Container>
  );
};
