"use client";
import React from "react";
import { motion, easeOut } from "framer-motion";
import {
  Brain,
  Heart,
  Zap,
  Smile,
  Shield,
  RefreshCw,
} from "lucide-react";
import Container from "./Container";

const benefits = [
  {
    icon: Brain,
    title: "Boosts Brain Power",
    desc: "Sleep strengthens memory, focus, and decision-making.",
    accent: "from-blue-400",
  },
  {
    icon: Heart,
    title: "Supports Heart Health",
    desc: "Reduces risk of high blood pressure and heart disease.",
    accent: "from-rose-400",
  },
  {
    icon: Zap,
    title: "Improves Productivity",
    desc: "Rested minds are sharper, more creative, and efficient.",
    accent: "from-yellow-400",
  },
  {
    icon: Smile,
    title: "Reduces Stress & Anxiety",
    desc: "Quality sleep balances hormones and mood.",
    accent: "from-green-400",
  },
  {
    icon: Shield,
    title: "Strengthens Immunity",
    desc: "Helps the body fight off illness and recover faster.",
    accent: "from-purple-400",
  },
  {
    icon: RefreshCw,
    title: "Regulates Body Clock",
    desc: "A consistent sleep cycle improves energy and daily rhythm.",
    accent: "from-cyan-400",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
};

export const WhySleepMatters = () => {
  return (
    <Container className="py-16 lg:py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="text-center mb-16 space-y-4 max-w-2xl mx-auto"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full surface-high ghost-border backdrop-blur-[20px]">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-label text-[var(--on-surface-variant)]">
            Sleep Science
          </span>
        </div>

        {/* Title */}
        <h2 className="text-headline-md font-medium text-[var(--on-surface)]">
          Why Sleep{" "}
          <span className="text-[var(--on-surface-variant)]">
            Matters?
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-body-md text-[var(--on-surface-variant)] max-w-lg mx-auto">
          Understanding the science behind quality sleep helps you make better
          decisions for your health and wellbeing.
        </p>
      </motion.div>

      {/* Benefits Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={benefit.title}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`card-elevated group cursor-pointer ${
                idx % 3 === 2 ? "lg:translate-y-6" : ""
              }`}
            >
              {/* Top Accent Gradient */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r to-transparent ${benefit.accent}`} />

              {/* Icon Container */}
              <div className="w-14 h-14 rounded-lg surface-high flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-secondary/20 to-primary/10">
                <Icon size={28} className="text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-title-lg font-semibold text-[var(--on-surface)] group-hover:text-primary transition-colors duration-300 mb-3">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-body-md text-[var(--on-surface-variant)] leading-relaxed">
                {benefit.desc}
              </p>

              {/* Indicator Dot */}
              <div className="mt-6 w-2 h-2 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          );
        })}
      </motion.div>
    </Container>
  );
};
