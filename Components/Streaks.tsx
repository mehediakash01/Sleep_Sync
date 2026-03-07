"use client";
import { FaFireAlt, FaMedal, FaStar, FaTrophy } from "react-icons/fa";
import Container from "./Container";
import { motion } from "framer-motion";
import Link from "next/link";

const BADGES = [
  {
    icon: <FaMedal className="text-4xl text-yellow-500" />,
    iconBg: "bg-yellow-50",
    title: "7-Day Champ",
    desc: "Complete your first full week of consecutive sleep logs.",
    days: 7,
    color: "border-t-yellow-400",
    x: -200,
  },
  {
    icon: <FaStar className="text-4xl text-[#89CFF0]" />,
    iconBg: "bg-[#89CFF0]/10",
    title: "Consistency Star",
    desc: "Stay on track for 30 days straight — no days missed.",
    days: 30,
    color: "border-t-[#89CFF0]",
    x: 0,
  },
  {
    icon: <FaTrophy className="text-4xl text-emerald-500" />,
    iconBg: "bg-emerald-50",
    title: "Sleep Master",
    desc: "Achieve an incredible 100+ night streak and join the legends.",
    days: 100,
    color: "border-t-emerald-400",
    x: 200,
  },
];

const Streaks = () => {
  return (
    <Container className="text-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-14"
      >
        <h2 className="text-4xl font-extrabold text-white">
          Stay Consistent,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
            Build Streaks
          </span>
        </h2>
        <p className="text-white/65 mt-3 max-w-lg mx-auto">
          Motivation to keep your sleep schedule on track — like Duolingo
          streaks, but for your health!
        </p>
      </motion.div>

      {/* Streak Stat Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="inline-flex flex-col items-center gap-4 bg-white/15 backdrop-blur-md border border-white/25 rounded-3xl px-12 py-8 shadow-xl mb-14"
      >
        <FaFireAlt className="text-6xl text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.7)] animate-pulse" />
        <div>
          <p className="text-5xl font-extrabold text-white leading-none">25</p>
          <p className="text-white/70 text-sm mt-1">nights in a row 🔥</p>
        </div>
        <div className="w-64">
          <div className="flex justify-between text-xs text-white/55 mb-1.5">
            <span>Progress</span>
            <span>75% to next badge</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "75%" }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
        <Link
          href="/Streak"
          className="text-xs text-white/60 hover:text-white underline underline-offset-2 transition-colors"
        >
          View all milestones →
        </Link>
      </motion.div>

      {/* Badge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {BADGES.map((badge, i) => (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, x: badge.x }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-left border-t-4 ${badge.color}`}
          >
            <div className={`w-14 h-14 ${badge.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              {badge.icon}
            </div>
            <h4 className="font-bold text-gray-800 text-base mb-1">{badge.title}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{badge.desc}</p>
            <div className="mt-4 inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
              {badge.days}-night streak
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
};

export default Streaks;
