"use client";

import Container from "@/Components/Container";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Moon, Lightbulb, Heart, Eye, ArrowRight, Users, Star } from "lucide-react";

const FADE_UP = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const SLIDE_LEFT = {
  initial: { opacity: 0, x: -80 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.6, ease: "easeInOut" as const },
};

const SLIDE_RIGHT = {
  initial: { opacity: 0, x: 80 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.6, ease: "easeInOut" as const },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* ── HERO ── */}
      <div className="bg-gradient-to-tl from-secondary to-primary pt-28 pb-24">
        <Container className="pb-0">
          <motion.div {...FADE_UP} className="text-center space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm">
              <Moon size={13} className="text-white" />
              <span className="text-xs font-semibold text-white tracking-wide uppercase">About Us</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
              We&apos;re building a{" "}
              <span className="text-white/70">healthier world,</span>
              {" "}one night at a time.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              SleepSync is your trusted companion in understanding and improving
              sleep quality — powered by science, real data, and thoughtful design.
            </p>
          </motion.div>
        </Container>
      </div>

      {/* ── MISSION & VISION ── */}
      <section className="py-24 bg-white">
        <Container className="pb-0">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            {/* Image */}
            <motion.div {...SLIDE_LEFT} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#89CFF0]/20 to-[#B19CD9]/20 rounded-3xl blur-2xl" />
              <Image
                src="/images/sleepSyncTeam.jpg"
                alt="SleepSync Team"
                width={600}
                height={400}
                className="relative rounded-2xl shadow-xl object-cover w-full"
              />
            </motion.div>

            {/* Copy */}
            <div className="space-y-10">
              <motion.div
                {...SLIDE_RIGHT}
                className="space-y-3 pl-5 border-l-4 border-[#89CFF0]"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-[#89CFF0]">Our Mission</p>
                <h2 className="text-2xl font-extrabold text-gray-800">Empowering you to sleep better</h2>
                <p className="text-gray-500 leading-relaxed text-sm">
                  At <span className="font-semibold text-[#4a9fc0]">SleepSync</span>, our mission is to
                  empower individuals to take control of their sleep habits and live healthier, more
                  energized lives. We believe that quality sleep fuels productivity, creativity,
                  and emotional well-being.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeInOut" }}
                className="space-y-3 pl-5 border-l-4 border-[#B19CD9]"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-[#B19CD9]">Our Vision</p>
                <h2 className="text-2xl font-extrabold text-gray-800">Technology meets mindfulness</h2>
                <p className="text-gray-500 leading-relaxed text-sm">
                  We envision a world where technology and mindfulness coexist — helping people reconnect with
                  their natural sleep rhythms. Our platform uses data-driven insights and simple interfaces
                  to make better sleep achievable for everyone.
                </p>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="bg-gradient-to-br from-[#f0f9ff] to-[#fdf4ff] py-24">
        <Container className="pb-0">
          <motion.div {...FADE_UP} className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-800">
              What we{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#89CFF0] to-[#B19CD9]">
                stand for
              </span>
            </h2>
            <p className="text-gray-500 mt-3 text-sm max-w-md mx-auto">
              Three values that guide every decision we make.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Lightbulb size={22} className="text-yellow-500" />,
                bg: "bg-yellow-50",
                border: "border-t-yellow-400",
                title: "Innovation",
                desc: "We blend cutting-edge sleep research with technology to deliver real, measurable impact.",
              },
              {
                icon: <Heart size={22} className="text-pink-500" />,
                bg: "bg-pink-50",
                border: "border-t-pink-400",
                title: "Empathy",
                desc: "We care deeply about the human experience — behind every data point is a person who deserves better rest.",
              },
              {
                icon: <Eye size={22} className="text-[#89CFF0]" />,
                bg: "bg-[#89CFF0]/10",
                border: "border-t-[#89CFF0]",
                title: "Transparency",
                desc: "We prioritize honesty and clarity in how we collect, use, and present your sleep data.",
              },
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`bg-white p-7 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border-t-4 ${v.border}`}
              >
                <div className={`w-12 h-12 ${v.bg} rounded-2xl flex items-center justify-center mb-5`}>
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-24 bg-white">
        <Container className="pb-0">
          <div className="max-w-3xl mx-auto">
            <motion.div {...FADE_UP} className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#89CFF0] mb-2">Our Story</p>
              <h2 className="text-4xl font-extrabold text-gray-800">
                Born from{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#89CFF0] to-[#B19CD9]">
                  frustration & curiosity
                </span>
              </h2>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  text: "SleepSync was born out of frustration and curiosity. Our founders — a team of developers, neuroscientists, and wellness enthusiasts — realized that most sleep apps track data but fail to help people truly understand it.",
                  delay: 0,
                },
                {
                  text: "So we set out to build a smarter solution that interprets, educates, and motivates. Not just charts and numbers, but real guidance you can act on every night.",
                  delay: 0.12,
                },
                {
                  text: "Today, SleepSync serves thousands of users worldwide, bridging the gap between data and better rest — and we're just getting started.",
                  delay: 0.24,
                },
              ].map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.55, delay: p.delay, ease: "easeOut" }}
                  className="text-gray-500 leading-relaxed text-base"
                >
                  {p.text}
                </motion.p>
              ))}
            </div>

            {/* Stats row */}
            <motion.div
              {...FADE_UP}
              className="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-gray-100"
            >
              {[
                { icon: <Users size={18} className="text-[#89CFF0]" />, value: "45K+", label: "Active Users" },
                { icon: <Star size={18} className="text-yellow-400" />,  value: "4.9★", label: "Average Rating" },
                { icon: <Moon size={18} className="text-[#B19CD9]" />,   value: "120K+", label: "Sleep Logs" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-1.5">{stat.icon}</div>
                  <p className="text-2xl font-extrabold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── TEAM ── */}
      <section className="bg-gradient-to-br from-[#f0f9ff] to-[#fdf4ff] py-24">
        <Container className="pb-0">
          <motion.div {...FADE_UP} className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-800">
              Meet the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#89CFF0] to-[#B19CD9]">
                Team
              </span>
            </h2>
            <p className="text-gray-500 mt-3 text-sm">The humans making better sleep possible.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-7">
            {[
              {
                name: "Mehedi Akash",
                role: "Founder & Lead Developer",
                img: "https://randomuser.me/api/portraits/men/22.jpg",
                x: -80,
              },
              {
                name: "Sarah Lee",
                role: "Sleep Research Specialist",
                img: "https://randomuser.me/api/portraits/women/5.jpg",
                x: 0,
              },
              {
                name: "James Park",
                role: "UX Designer",
                img: "https://randomuser.me/api/portraits/men/19.jpg",
                x: 80,
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: member.x, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center gap-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#89CFF0] to-[#B19CD9] blur-md opacity-30 scale-110" />
                  <Image
                    src={member.img}
                    alt={member.name}
                    width={84}
                    height={84}
                    className="relative rounded-full ring-2 ring-[#89CFF0]/40 object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{member.name}</h3>
                  <span className="inline-block mt-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-500 font-medium">
                    {member.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <div className="bg-gradient-to-tl from-secondary to-primary py-24">
        <Container className="pb-0">
          <motion.div {...FADE_UP} className="text-center space-y-6 max-w-xl mx-auto">
            <p className="text-5xl">🌙</p>
            <h2 className="text-4xl font-extrabold text-white">
              Join the Sleep Revolution
            </h2>
            <p className="text-white/70 text-lg">
              Start tracking, improving, and understanding your sleep today.
              Free forever. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-gray-800 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Get Started Free <ArrowRight size={15} />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/15 border border-white/30 text-white font-semibold hover:bg-white/25 transition-all duration-200"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </Container>
      </div>

    </div>
  );
}
