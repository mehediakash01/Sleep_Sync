"use client";
import { FaRegClock, FaChartLine, FaFireAlt, FaRobot } from "react-icons/fa";
import Container from "./Container";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <FaRegClock className="text-2xl text-secondary" />,
      title: "Daily Sleep Log",
      desc: "Keep track of your bedtime and wake-up time effortlessly every night.",
      accent: "from-secondary",
      category: "Tracking",
    },
    {
      icon: <FaChartLine className="text-2xl text-primary" />,
      title: "Smart Insights",
      desc: "Visualize your sleep data with clear, beautiful charts and trends.",
      accent: "from-primary",
      category: "Analytics",
    },
    {
      icon: <FaFireAlt className="text-2xl text-orange-400" />,
      title: "Streak Tracker",
      desc: "Stay consistent by maintaining healthy sleep streaks and earn badges.",
      accent: "from-orange-400",
      category: "Motivation",
    },
    {
      icon: <FaRobot className="text-2xl text-quality-high" />,
      title: "AI Sleep Coach",
      desc: "Get personalized tips powered by AI to improve your sleep quality.",
      accent: "from-quality-high",
      category: "Intelligence",
    },
  ];

  return (
    <Container className="py-16 lg:py-24">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16 lg:mb-20"
      >
        {/* Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full surface-high ghost-border backdrop-blur-[20px] mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Zap size={14} className="fill-secondary text-secondary" />
          <span className="text-label-sm text-[var(--on-surface-variant)]">
            What We Offer
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h2 
          className="font-display text-headline-md font-medium text-[var(--on-surface)] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          Features &{" "}
          <span className="text-[var(--on-surface-variant)]">
            How It Works
          </span>
        </motion.h2>

        {/* Subheading */}
        <motion.p 
          className="text-body-md text-[var(--on-surface-variant)] max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Everything you need to understand and improve your sleep — in one place.
        </motion.p>
      </motion.div>

      {/* Feature Cards Grid - Asymmetrical Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className={`card-elevated group cursor-pointer ${
              idx % 2 === 1 ? "lg:translate-y-8" : ""
            }`}
          >
            {/* Top Gradient Accent Line */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r to-transparent ${feature.accent === "from-secondary" ? "from-secondary" : feature.accent === "from-primary" ? "from-primary" : "from-orange-400"}`} />

            {/* Icon Container with Surface Nesting */}
            <div className="w-12 h-12 rounded-lg surface-high flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>

            {/* Category Label */}
            <span className="text-label-sm text-[var(--on-surface-variant)] mb-3 inline-block opacity-75">
              {feature.category}
            </span>

            {/* Title */}
            <h3 className="text-title-lg font-semibold text-[var(--on-surface)] mb-3 group-hover:text-primary transition-colors duration-300">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-body-md text-[var(--on-surface-variant)] leading-relaxed">
              {feature.desc}
            </p>

            {/* Hover Indicator */}
            <div className="mt-6 flex items-center gap-2 text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm font-medium">Learn more</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
};

export default Features;
