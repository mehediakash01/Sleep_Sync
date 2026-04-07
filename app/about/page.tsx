"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BrainCircuit,
  HeartHandshake,
  MoonStar,
  ShieldCheck,
  Sparkles,
  Stars,
  Target,
  Users,
} from "lucide-react";

const principles: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: BrainCircuit,
    title: "Science translated clearly",
    body: "We turn sleep research and nightly data into guidance that feels useful, not clinical or overwhelming.",
  },
  {
    icon: HeartHandshake,
    title: "Empathy in every interaction",
    body: "Behind every chart is a real person trying to rest better, recover faster, and feel more like themselves.",
  },
  {
    icon: ShieldCheck,
    title: "Trust built into the product",
    body: "We design for clarity, restraint, and privacy so your sleep routine always feels personal and respected.",
  },
];

const storyMoments = [
  "SleepSync began with a simple frustration: most sleep apps collect plenty of numbers, but very few help people understand what those numbers mean in real life.",
  "Our team set out to build something calmer and more human, where data, design, and coaching work together instead of competing for attention.",
  "Today we are focused on helping more people build sustainable sleep rituals with feedback that feels intelligent, supportive, and grounded.",
] as const;

const team = [
  {
    name: "Mehedi Hasan Akash",
    role: "Founder & Lead Developer",
    initials: "MA",
  },
  {
    name: "Sarah Lee",
    role: "Sleep Research Specialist",
    initials: "SL",
  },
  {
    name: "Jin Park",
    role: "UX Designer",
    initials: "JP",
  },
] as const;

const stars = [
  "left-[6%] top-[10%]",
  "left-[14%] top-[22%]",
  "left-[22%] top-[8%]",
  "left-[33%] top-[18%]",
  "left-[43%] top-[9%]",
  "left-[54%] top-[14%]",
  "left-[64%] top-[24%]",
  "left-[74%] top-[12%]",
  "left-[85%] top-[18%]",
  "left-[93%] top-[8%]",
  "left-[10%] top-[60%]",
  "left-[24%] top-[76%]",
  "left-[39%] top-[68%]",
  "left-[53%] top-[80%]",
  "left-[67%] top-[62%]",
  "left-[81%] top-[74%]",
  "left-[91%] top-[66%]",
];

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const shell =
  "rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl";
const eyebrow =
  "inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9BC5FF]";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A1428] text-[#F5F0E8]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(76,43,140,0.42),_transparent_32%),radial-gradient(circle_at_20%_20%,_rgba(0,229,194,0.12),_transparent_18%),linear-gradient(180deg,_#091224_0%,_#0A1428_42%,_#08101E_100%)]" />
        <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(76,43,140,0.48)_0%,_rgba(30,27,75,0.2)_45%,_transparent_75%)] blur-3xl" />
        <div className="absolute right-[-5rem] top-40 h-80 w-80 rounded-full bg-[#00E5C2]/10 blur-3xl" />
        <div className="absolute left-[-6rem] top-[28rem] h-72 w-72 rounded-full bg-[#4C2B8C]/30 blur-3xl" />
        {stars.map((star, index) => (
          <span
            key={star}
            className={`absolute ${star} h-1 w-1 rounded-full bg-white/70 shadow-[0_0_14px_rgba(255,255,255,0.5)] animate-[stardust_7s_ease-in-out_infinite]`}
            style={{ animationDelay: `${index * 0.35}s` }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <section className="mx-auto grid min-h-screen max-w-7xl gap-16 px-6 pb-16 pt-32 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-24 lg:pt-40">
          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.05}
            className="flex max-w-2xl flex-col justify-center gap-8"
          >
            <div className={eyebrow}>
              <Stars className="h-4 w-4 text-[#00E5C2]" />
              About SleepSync
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                We&apos;re building calmer nights and clearer mornings.
              </h1>
              <p className="max-w-xl text-base leading-8 text-[#F5F0E8]/72 sm:text-lg">
                SleepSync exists to help people understand their sleep, trust
                their habits, and improve with guidance that feels thoughtful,
                beautiful, and genuinely useful.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#00E5C2] px-7 py-4 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_40px_rgba(0,229,194,0.25)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_16px_56px_rgba(0,229,194,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00E5C2]"
              >
                Start Your Sleep Journey
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-7 py-4 text-sm font-semibold backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#00E5C2]/40 hover:bg-white/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00E5C2]"
              >
                Explore the Dashboard
              </Link>
            </div>

            <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl sm:grid-cols-3">
              {[
                ["45K+", "People building healthier nights with SleepSync"],
                ["120K+", "Sleep logs translated into practical patterns"],
                ["4.9/5", "Average product rating from recovery-focused users"],
              ].map(([value, label]) => (
                <div key={value}>
                  <p className="text-3xl font-semibold tracking-[-0.03em]">
                    {value}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-[#F5F0E8]/64">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={rise}
            initial="hidden"
            animate="show"
            custom={0.18}
            className="relative flex min-h-[540px] items-center justify-center lg:min-h-[680px]"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 top-16 hidden w-56 rounded-[28px] border border-white/12 bg-[#111B31]/80 p-5 backdrop-blur-2xl lg:block"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#F5F0E8]/45">
                    Our mission
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    Better sleep for real life
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#00E5C2]/35 bg-[#00E5C2]/12 text-[#00E5C2] shadow-[0_0_24px_rgba(0,229,194,0.18)]">
                  <Target className="h-7 w-7" />
                </div>
              </div>
              <div className="space-y-3 text-sm text-[#F5F0E8]/68">
                <div className="rounded-2xl bg-white/5 px-3 py-2.5">
                  Turn sleep data into daily clarity.
                </div>
                <div className="rounded-2xl bg-white/5 px-3 py-2.5">
                  Make sustainable habits feel achievable.
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 right-2 hidden w-64 rounded-[30px] border border-white/10 bg-[#121B32]/82 p-5 backdrop-blur-2xl lg:block"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00E5C2]/14 text-[#00E5C2]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Who we serve</p>
                  <p className="text-xs text-[#F5F0E8]/50">
                    People chasing calmer routines
                  </p>
                </div>
              </div>
              <p className="text-sm leading-7 text-[#F5F0E8]/72">
                We design for people who want more than charts. They want
                explanations, momentum, and a bedtime ritual that feels
                restorative.
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 0.8, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full rounded-[40px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            >
              <div className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(12,19,36,0.96),rgba(9,14,28,0.92))] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#F5F0E8]/45">
                      The people behind SleepSync
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                      Built by a cross-functional team
                    </p>
                  </div>
                  <div className="rounded-full border border-[#00E5C2]/25 bg-[#00E5C2]/10 px-3 py-1 text-xs font-medium text-[#00E5C2]">
                    Design + research + product
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                    <Image
                      src="/images/sleepSyncTeam.jpg"
                      alt="SleepSync team"
                      width={900}
                      height={720}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#9BC5FF]">
                        Our vision
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
                        Technology that supports mindfulness
                      </h2>
                      <p className="mt-3 text-sm leading-8 text-[#F5F0E8]/62">
                        We imagine a world where better sleep feels accessible,
                        measurable, and emotionally sustainable rather than
                        strict, sterile, or intimidating.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        ["Focus", "Helpful clarity over feature noise"],
                        ["Approach", "Data-informed and deeply human"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-[24px] border border-white/10 bg-[#0E1730]/92 p-4"
                        >
                          <p className="text-xs uppercase tracking-[0.18em] text-[#F5F0E8]/42">
                            {label}
                          </p>
                          <p className="mt-3 text-base font-medium leading-7">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-[24px] border border-[#00E5C2]/14 bg-[#00E5C2]/8 p-4">
                      <div className="flex items-center gap-3">
                        <MoonStar className="h-5 w-5 text-[#00E5C2]" />
                        <p className="text-sm font-medium text-[#D5FFF8]">
                          Sleep should feel understandable, not mysterious.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid gap-4 rounded-[32px] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-2xl md:grid-cols-4">
            {[
              "Designed around calm routines, not noisy wellness tactics",
              "Built to make sleep metrics easier to trust and act on",
              "Grounded in empathy, clarity, and product restraint",
              "Focused on translating data into confident next steps",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-[#F5F0E8]/70"
              >
                <Sparkles className="h-4 w-4 shrink-0 text-[#00E5C2]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr]">
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={0}
              className="space-y-6"
            >
              <div className={eyebrow}>Our Principles</div>
              <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                The values guiding every product decision.
              </h2>
              <p className="text-base leading-8 text-[#F5F0E8]/66 sm:text-lg">
                We want the product to feel as restorative as the outcome it
                promises. That means every screen should earn trust, reduce
                stress, and help the next action feel obvious.
              </p>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-3">
              {principles.map(({ icon: Icon, title, body }, index) => (
                <motion.article
                  key={title}
                  variants={rise}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={0.08 + index * 0.06}
                  className={`${shell} p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00E5C2]/20 hover:shadow-[0_20px_64px_rgba(0,0,0,0.28)]`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00E5C2]/10 text-[#00E5C2]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-8 text-[#F5F0E8]/62">
                    {body}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={0}
              className={`${shell} p-7 sm:p-8`}
            >
              <div className={eyebrow}>Our Story</div>
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Born from frustration, shaped by curiosity.
              </h2>
              <div className="mt-8 space-y-5">
                {storyMoments.map((moment, index) => (
                  <div
                    key={moment}
                    className="flex gap-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 sm:p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#00E5C2]/18 bg-[#0E1730] text-sm font-semibold text-[#00E5C2]">
                      {`0${index + 1}`}
                    </div>
                    <p className="text-sm leading-8 text-[#F5F0E8]/68">
                      {moment}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={0.12}
              className="grid gap-5"
            >
              <div className={`${shell} p-7`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#9BC5FF]">
                      Snapshot
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
                      What progress looks like
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00E5C2]/10 text-[#00E5C2]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    ["Recovery confidence", "People understand why a night felt better."],
                    ["Repeatable routines", "Insights lead to habits worth keeping."],
                    ["Calmer mornings", "Users spend less time guessing what changed."],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-5 rounded-2xl bg-[#F5F0E8]/[0.04] px-4 py-3 text-sm"
                    >
                      <span className="text-[#F5F0E8]/62">{label}</span>
                      <span className="max-w-[14rem] text-right font-medium text-[#F5F0E8]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${shell} p-7`}>
                <p className="text-xs uppercase tracking-[0.2em] text-[#9BC5FF]">
                  What we believe
                </p>
                <blockquote className="mt-4 text-2xl font-semibold leading-10 tracking-[-0.03em] text-[#F5F0E8]">
                  Better sleep products should make people feel steadier, not
                  more anxious.
                </blockquote>
                <p className="mt-4 text-sm leading-8 text-[#F5F0E8]/62">
                  That belief shapes our product voice, interface density,
                  coaching tone, and the way we surface metrics throughout the
                  experience.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            custom={0}
            className="mx-auto max-w-2xl space-y-4 text-center"
          >
            <div className={eyebrow}>The Team</div>
            <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              The humans making calmer sleep tech possible.
            </h2>
            <p className="text-base leading-8 text-[#F5F0E8]/66 sm:text-lg">
              Product thinkers, researchers, and builders working together to
              create a more thoughtful sleep experience.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {team.map((member, index) => (
              <motion.article
                key={member.name}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                custom={0.08 + index * 0.08}
                className={`${shell} p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00E5C2]/20`}
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1E1B4B,#4C2B8C)] text-xl font-semibold text-white shadow-[0_0_30px_rgba(76,43,140,0.28)]">
                  {member.initials}
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">
                  {member.name}
                </h3>
                <p className="mt-2 text-sm text-[#F5F0E8]/58">
                  {member.role}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-28 pt-4 lg:px-8">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            custom={0}
            className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(135deg,rgba(30,27,75,0.86),rgba(76,43,140,0.7),rgba(0,229,194,0.14))] px-8 py-12 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:px-12 lg:px-16 lg:py-16"
          >
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(0,229,194,0.18),_transparent_56%)] lg:block" />
            <div className="relative z-10 max-w-3xl">
              <div className={eyebrow}>Join Us</div>
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Join the sleep experience we always wanted to exist.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#F5F0E8]/76 sm:text-lg">
                Track your nights, understand your patterns, and build a calmer
                routine with a product designed to feel restorative from the
                first session.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00E5C2] px-7 py-4 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_14px_44px_rgba(0,229,194,0.26)] transition-all duration-300 hover:scale-[1.03]"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/AiCoach"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/5 px-7 py-4 text-sm font-semibold backdrop-blur-2xl transition-all duration-300 hover:border-[#00E5C2]/35 hover:bg-white/8"
                >
                  Preview the AI Coach
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes stardust {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }
      `}</style>
    </main>
  );
}
