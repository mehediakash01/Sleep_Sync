"use client";
import Container from "./Container";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 120000, suffix: "+", label: "Sleep Logs Recorded", icon: "📊" },
  { value: 94,     suffix: "%", label: "Users Sleep Better",   icon: "😴" },
  { value: 45,     suffix: "K+",label: "Active Streaks",       icon: "🔥" },
  { value: 4.9,    suffix: "★", label: "Average Rating",       icon: "⭐" },
];

function CountUp({ to, suffix, duration = 2 }: { to: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 60;
          const increment = to / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= to) { setCount(to); clearInterval(interval); }
            else { setCount(parseFloat(current.toFixed(to < 10 ? 1 : 0))); }
          }, (duration * 1000) / steps);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {to < 10 ? count.toFixed(1) : count >= 1000 ? (count / 1000).toFixed(0) + "K" : Math.round(count)}
      {suffix}
    </span>
  );
}

const SleepStats = () => {
  return (
    <Container className="py-16 lg:py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16 space-y-4"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full surface-high ghost-border backdrop-blur-[20px]">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-label text-[var(--on-surface-variant)]">Community Stats</span>
        </div>

        {/* Title */}
        <h2 className="text-headline-md font-medium text-[var(--on-surface)]">
          Trusted by{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
            thousands
          </span>{" "}
          of sleepers
        </h2>

        {/* Subtitle */}
        <p className="text-body-md text-[var(--on-surface-variant)] max-w-lg mx-auto">
          Our community is growing every night. Here&apos;s what the numbers say about sleep quality improvement across our platform.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: -6 }}
            className="card-elevated group text-center space-y-3"
          >
            {/* Icon */}
            <div className="text-4xl opacity-70 group-hover:opacity-100 transition-opacity">
              {stat.icon}
            </div>

            {/* Number */}
            <div className="text-4xl lg:text-5xl font-bold leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </div>

            {/* Label */}
            <p className="text-label text-[var(--on-surface-variant)]">
              {stat.label}
            </p>

            {/* Accent line */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </Container>
  );
};

export default SleepStats;
