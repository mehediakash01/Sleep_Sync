"use client";
import Container from "./Container";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is SleepSync free to use?",
    a: "Yes! SleepSync is completely free to get started. Create an account, log your sleep, and access insights — no credit card required.",
  },
  {
    q: "How does the streak tracker work?",
    a: "Log your sleep every consecutive day to grow your streak. If you miss a day, your streak resets to zero. Reach milestones at 3, 7, 14, 30, 60, and 100 nights to unlock special badges.",
  },
  {
    q: "How accurate is the AI sleep coach?",
    a: "Our AI coach is powered by Gemini AI and analyzes your logged sleep data — bedtime patterns, wake-up times, duration, and quality scores — to give you personalized recommendations unique to your habits.",
  },
  {
    q: "Does SleepSync track sleep automatically?",
    a: "Currently, SleepSync uses manual logging so your data is always accurate and reflective of how you actually feel. Smart device integration is on our roadmap.",
  },
  {
    q: "Will I receive email notifications?",
    a: "Yes! You can configure bedtime reminders, streak alerts, and poor sleep notifications from your Notification Settings page. We use Gmail SMTP so delivery is reliable.",
  },
  {
    q: "Can I see my sleep history over time?",
    a: "Absolutely. Your Sleep History page shows a full log table and charts, and your Streak page includes a GitHub-style heatmap showing every night you've logged across the past 6 months.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Container className="pt-16 pb-0">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* LEFT: sticky header */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="lg:sticky lg:top-28 lg:w-72 shrink-0 text-center lg:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-widest  mb-3">
            Got questions?
          </p>
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Frequently{" "}
            <span>
              Asked
            </span>
          </h2>
          <p className="text-white/65 text-sm mt-4 leading-relaxed">
            Can&apos;t find the answer you&apos;re looking for? Feel free to reach out
            through our community.
          </p>
        </motion.div>

        {/* RIGHT: accordion */}
        <div className="flex-1 space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                open === i
                  ? "border-[#89CFF0]/50 shadow-md"
                  : "border-white/15"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white/10 hover:bg-white/15 transition-colors duration-150"
              >
                <span className="font-semibold text-white text-sm">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-white/50 shrink-0 transition-transform duration-300 ${
                    open === i ? "rotate-180 text-[#89CFF0]" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="px-6 pb-5 text-white/65 text-sm leading-relaxed border-t border-white/15 pt-4">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default FAQ;
