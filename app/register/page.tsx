"use client";

import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Moon, User, Mail, Lock, ArrowRight, Eye, EyeOff, BrainCircuit, Flame, BarChart3, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";

const PERKS = [
  { icon: Moon, text: "Track your sleep every night" },
  { icon: Flame, text: "Build streaks & earn badges" },
  { icon: BrainCircuit, text: "AI-powered sleep coaching" },
  { icon: BarChart3, text: "Visual insights & trends" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Creating account...");
    try {
      const res = await axios.post("/api/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success(res.data.message || "Account created successfully!", { id: toastId });
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err: unknown) {
      if (axios.isAxiosError<{ message: string }>(err)) {
        toast.error(err.response?.data?.message || "Request failed", { id: toastId });
      } else {
        toast.error("Request failed", { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT: Brand Panel ── */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-tl from-secondary to-primary flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
            <Moon size={20} className="text-white" />
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">SleepSync</span>
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Start sleeping<br />
              <span className="text-white/70">smarter tonight.</span>
            </h2>
            <p className="text-white/60 text-base max-w-xs">
              It&apos;s free forever. No credit card needed. Join thousands already improving their rest.
            </p>
          </div>

          <ul className="space-y-3">
            {PERKS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-white" />
                </div>
                <span className="text-white/75 text-sm">{text}</span>
              </li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="flex gap-6">
            {[["45K+", "Active users"], ["94%", "Sleep better"], ["Free", "Forever"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-white font-extrabold text-xl">{val}</p>
                <p className="text-white/50 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 bg-white/10 border border-white/20 rounded-2xl p-5">
          <p className="text-white/80 text-sm leading-relaxed italic">
            &ldquo;Within 3 weeks my sleep quality improved by 40%. The AI tips are genuinely helpful.&rdquo;
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">S</div>
            <div>
              <p className="text-white text-xs font-semibold">Sarah L.</p>
              <p className="text-white/50 text-xs">Marketing Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#89CFF0] to-[#B19CD9] flex items-center justify-center">
              <Moon size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-xl text-gray-800">SleepSync</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-800">Create account</h1>
            <p className="text-gray-500 text-sm mt-1">Free forever — start your sleep journey.</p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mb-5"
          >
            {googleLoading ? (
              <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">or with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="name"
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-[#89CFF0] focus:ring-2 focus:ring-[#89CFF0]/20 transition"
              />
            </div>

            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-[#89CFF0] focus:ring-2 focus:ring-[#89CFF0]/20 transition"
              />
            </div>

            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-11 pr-11 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-[#89CFF0] focus:ring-2 focus:ring-[#89CFF0]/20 transition"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <div className="relative">
              <CheckCircle2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full pl-11 pr-11 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-[#89CFF0] focus:ring-2 focus:ring-[#89CFF0]/20 transition"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#89CFF0] to-[#B19CD9] text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-gray-700 font-semibold hover:text-[#89CFF0] transition">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
