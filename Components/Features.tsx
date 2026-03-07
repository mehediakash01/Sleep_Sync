"use client";
import { FaRegClock, FaChartLine, FaFireAlt, FaRobot } from "react-icons/fa";
import Container from "./Container";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <FaRegClock className="text-2xl text-[#89CFF0]" />,
      bg: "bg-[#89CFF0]/15",
      title: "Daily Sleep Log",
      desc: "Keep track of your bedtime and wake-up time effortlessly every night.",
      accent: "border-t-[#89CFF0]",
    },
    {
      icon: <FaChartLine className="text-2xl text-[#B19CD9]" />,
      bg: "bg-[#B19CD9]/15",
      title: "Smart Insights",
      desc: "Visualize your sleep data with clear, beautiful charts and trends.",
      accent: "border-t-[#B19CD9]",
    },
    {
      icon: <FaFireAlt className="text-2xl text-orange-400" />,
      bg: "bg-orange-100",
      title: "Streak Tracker",
      desc: "Stay consistent by maintaining healthy sleep streaks and earn badges.",
      accent: "border-t-orange-400",
    },
    {
      icon: <FaRobot className="text-2xl text-emerald-500" />,
      bg: "bg-emerald-50",
      title: "AI Sleep Coach",
      desc: "Get personalized tips powered by AI to improve your sleep quality.",
      accent: "border-t-emerald-400",
    },
  ];

  return (
    <Container>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/25 border border-white/30 backdrop-blur-sm mb-5">
          <Zap size={13} className="text-yellow-300 fill-yellow-300" />
          <span className="text-xs font-semibold text-white tracking-wide">What We Offer</span>
        </div>
        <h2 className="text-4xl font-extrabold text-white">
          Features{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/60 to-white">
            &amp; How It Works
          </span>
        </h2>
        <p className="text-white/65 mt-3 max-w-md mx-auto text-sm">
          Everything you need to understand and improve your sleep — in one place.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.55, delay: idx * 0.13, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className={`p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-left border-t-4 ${feature.accent}`}
          >
            <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}>
              {feature.icon}
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </Container>
  );
};

export default Features;
