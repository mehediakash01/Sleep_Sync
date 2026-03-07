"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "./Container";

const benefits = [
  {
    emoji: "🌟",
    title: "Boosts Brain Power",
    desc: "Sleep strengthens memory, focus, and decision-making.",
    color: "bg-blue-50 border-blue-200",
  },
  {
    emoji: "❤️",
    title: "Supports Heart Health",
    desc: "Reduces risk of high blood pressure and heart disease.",
    color: "bg-rose-50 border-rose-200",
  },
  {
    emoji: "⚡",
    title: "Improves Productivity",
    desc: "Rested minds are sharper, more creative, and efficient.",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    emoji: "🙂",
    title: "Reduces Stress & Anxiety",
    desc: "Quality sleep balances hormones and mood.",
    color: "bg-green-50 border-green-200",
  },
  {
    emoji: "🛡️",
    title: "Strengthens Immunity",
    desc: "Helps the body fight off illness and recover faster.",
    color: "bg-purple-50 border-purple-200",
  },
  {
    emoji: "🔄",
    title: "Regulates Body Clock",
    desc: "A consistent sleep cycle improves energy and daily rhythm.",
    color: "bg-sky-50 border-sky-200",
  },
];

export const WhySleepMatters = () => {
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, x: -200 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="flex flex-col lg:flex-row justify-between items-center gap-12"
      >
        {/* Left Content */}
        <div className="flex-1 space-y-8">
          {/* Section label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#89CFF0]/20 border border-[#89CFF0]/40">
            <span className="w-2 h-2 rounded-full bg-[#89CFF0] animate-pulse" />
            <span className="text-sm font-medium text-[#4a9fc0] tracking-wide uppercase">
              Sleep Science
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-gray-800">
              Why Sleep{" "}
              <span className="">
                Matters?
              </span>
            </h2>
            <p className="text-gray-500 text-base max-w-md">
              Quality sleep isn&apos;t a luxury — it&apos;s a biological necessity that powers every aspect of your health.
            </p>
          </div>

          {/* Benefit Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {benefits.map((item) => (
              <div
                key={item.title}
                className={`flex items-start gap-3 p-4 rounded-2xl border ${item.color} hover:shadow-md transition-shadow duration-200`}
              >
                <div className="text-2xl shrink-0 mt-0.5">{item.emoji}</div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative flex-shrink-0"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#89CFF0]/20 to-[#B19CD9]/20 blur-2xl" />
          <div className="relative rounded-3xl overflow-hidden">
            <Image
              src="/images/brainHeart.png"
              width={500}
              height={420}
              alt="brain and Heart"
              className="relative z-10 drop-shadow-xl"
            />
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
};
