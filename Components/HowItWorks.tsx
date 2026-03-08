"use client";
import Container from "./Container";
import { motion } from "framer-motion";
import { BedDouble, BarChart3, Flame, BrainCircuit, ArrowRight } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    icon: <BedDouble size={24} className="text-white" />,
    iconBg: "bg-[#89CFF0]",
    number: "01",
    title: "Create Your Account",
    desc: "Sign up in seconds. No credit card required. Your sleep journey starts the moment you join.",
  },
  {
    icon: <BarChart3 size={24} className="text-white" />,
    iconBg: "bg-[#B19CD9]",
    number: "02",
    title: "Log Your First Night",
    desc: "Record your bedtime, wake-up time, and how you feel. It takes under 30 seconds each morning.",
  },
  {
    icon: <Flame size={24} className="text-white" />,
    iconBg: "bg-orange-400",
    number: "03",
    title: "Build Your Streak",
    desc: "Log every night to grow your streak. Hit milestones at 7, 14, 30 and 100 nights to earn badges.",
  },
  {
    icon: <BrainCircuit size={24} className="text-white" />,
    iconBg: "bg-emerald-500",
    number: "04",
    title: "Get AI-Powered Insights",
    desc: "Our AI coach analyzes your patterns and gives you personalized tips to sleep deeper and wake refreshed.",
  },
];

const HowItWorks = () => {
  return (
    <Container className="pt-16 pb-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-extrabold text-white">
          Get started in{" "}
          <span >
            4 simple steps
          </span>
        </h2>
        <p className="text-white/65 mt-3 max-w-md mx-auto text-sm">
          No complicated setup. No guesswork. Just better sleep starting tonight.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="relative">
        {/* Connecting line (desktop) */}
        <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-[#89CFF0] via-[#B19CD9] to-emerald-400 opacity-30" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.13, ease: "easeOut" }}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center text-center gap-4"
              >
                {/* Icon circle */}
                <div className={`relative w-20 h-20 rounded-full ${step.iconBg} flex items-center justify-center shadow-lg`}>
                  {step.icon}
                  {/* Step number badge */}
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-[10px] font-extrabold text-white/80 shadow">
                    {step.number}
                  </span>
                </div>

                {/* Arrow connector (desktop) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute items-center" style={{ left: `${(i + 1) * 25 - 2}%`, top: "2.2rem" }}>
                    <ArrowRight size={14} className="text-white/30" />
                  </div>
                )}

                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          className="text-center mt-14"
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Start for free <ArrowRight size={15} />
          </Link>
        </motion.div>
    </Container>
  );
};

export default HowItWorks;
