"use client"
import Image from "next/image";
import Container from "./Container";
import { AskAiBtn } from "@/Action/AskAiBtn";
import { motion } from "framer-motion";
import { BrainCircuit, CheckCircle2 } from "lucide-react";

const PERKS = [
  "Personalized sleep schedule recommendations",
  "Habit analysis based on your logged data",
  "Tips to fall asleep faster & stay asleep longer",
  "Weekly AI-generated sleep quality reports",
];

const AiSleepCoach = () => {
  return (
    <Container className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, x: -200 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-6"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm">
          <BrainCircuit size={13} className="text-white" />
          <span className="text-xs font-semibold text-white tracking-wide">Powered by Gemini AI</span>
        </div>

        <h2 className="text-4xl font-extrabold text-white leading-tight">
          Your Personal{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#89CFF0] to-white">
            AI Sleep Coach
          </span>
        </h2>

        <p className="text-white/70 leading-relaxed">
          Our AI coach learns from your sleep habits and guides you toward
          deeper, more restorative rest — one insight at a time.
        </p>

        {/* Perks list */}
        <ul className="space-y-2.5">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-[#89CFF0] mt-0.5 shrink-0" />
              <span className="text-white/75 text-sm">{perk}</span>
            </li>
          ))}
        </ul>

        <AskAiBtn />
      </motion.div>

      {/* Right: image with glow */}
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex justify-center lg:justify-end relative"
      >
        {/* glow blob */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-72 rounded-full bg-[#89CFF0]/25 blur-3xl" />
        </div>
        <Image
          src="/images/Ai.png"
          alt="AI Sleep Coach"
          width={420}
          height={420}
          className="relative drop-shadow-2xl rounded-2xl"
        />
      </motion.div>
    </Container>
  );
};

export default AiSleepCoach;
