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
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    accent: "border-t-blue-400",
  },
  {
    icon: Heart,
    title: "Supports Heart Health",
    desc: "Reduces risk of high blood pressure and heart disease.",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    accent: "border-t-rose-400",
  },
  {
    icon: Zap,
    title: "Improves Productivity",
    desc: "Rested minds are sharper, more creative, and efficient.",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
    accent: "border-t-yellow-400",
  },
  {
    icon: Smile,
    title: "Reduces Stress & Anxiety",
    desc: "Quality sleep balances hormones and mood.",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    accent: "border-t-green-400",
  },
  {
    icon: Shield,
    title: "Strengthens Immunity",
    desc: "Helps the body fight off illness and recover faster.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    accent: "border-t-purple-400",
  },
  {
    icon: RefreshCw,
    title: "Regulates Body Clock",
    desc: "A consistent sleep cycle improves energy and daily rhythm.",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
    accent: "border-t-sky-400",
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
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="flex flex-col items-center gap-10"
      >
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-semibold text-white tracking-wide uppercase">
              Sleep Science
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-white">
            Why Sleep{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/60 to-white">
              Matters?
            </span>
          </h2>
          <p className="text-white/65 text-base">
            Quality sleep isn&apos;t a luxury — it&apos;s a biological necessity that
            powers every aspect of your health.
          </p>
        </div>

        {/* Benefit Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
        >
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                className={`flex items-start gap-4 p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-t-4 ${item.accent}`}
              >
                <div className={`shrink-0 p-2.5 rounded-xl ${item.iconBg} ${item.iconColor}`}>
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </Container>
  );
};
