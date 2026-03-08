"use client";
import Container from "./Container";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 120000, suffix: "+", label: "Sleep Logs Recorded", color: "text-[#89CFF]" },
  { value: 94,     suffix: "%", label: "Users Sleep Better",   color: "text-[#B19CD9]" },
  { value: 45,     suffix: "K+",label: "Active Streaks",       color: "text-orange-400" },
  { value: 4.9,    suffix: "★", label: "Average Rating",       color: "text-yellow-400" },
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
    <Container className="pt-16 pb-0">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="text-center mb-14"
      >
        <h2 className="text-4xl font-extrabold text-white">
          Trusted by <span >thousands</span> of sleepers
        </h2>
        <p className="text-white/65 mt-3 text-sm max-w-md mx-auto">
          Our community is growing every night. Here&apos;s what the numbers say.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1.04, y: -4 }}
            className="flex flex-col items-center justify-center gap-2 p-8 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 hover:shadow-lg transition-all duration-300 text-center"
          >
            <p className={`text-4xl lg:text-5xl font-extrabold leading-none ${stat.color}`}>
              <CountUp to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-white/65 text-sm font-medium mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </Container>
  );
};

export default SleepStats;
