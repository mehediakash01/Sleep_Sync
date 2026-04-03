"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Eye,
  EyeOff,
  Flame,
  Lock,
  Mail,
  MoonStar,
  ScanFace,
} from "lucide-react";

const cues = [
  { icon: BrainCircuit, label: "Pick up where your sleep insights left off" },
  { icon: Flame, label: "Keep your streak alive tonight" },
  { icon: ScanFace, label: "Use Google now, biometrics later" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Signing in...");
    const res = await signIn("credentials", { redirect: false, email, password });
    toast.dismiss(toastId);
    setLoading(false);

    if (res?.ok) {
      toast.success("Welcome back!");
      router.push("/");
    } else {
      toast.error(res?.error || "Invalid credentials");
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <main className="premium-page relative min-h-screen overflow-hidden px-6 pb-20 pt-28 text-[var(--app-text)] lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[12%] top-28 h-56 w-56 rounded-full bg-[var(--app-accent-strong)]/10 blur-3xl" />
        <div className="absolute right-[10%] top-20 h-64 w-64 rounded-full bg-[var(--app-gradient-end)]/30 blur-3xl" />
        <div className="absolute bottom-16 right-[20%] h-48 w-48 rounded-full bg-[var(--app-gradient-start)]/22 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="premium-panel-strong rounded-[36px] p-8 lg:p-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-line)] bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9BC5FF]">
            <MoonStar className="h-4 w-4 text-[var(--app-accent-strong)]" />
            Welcome back
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em] lg:text-5xl">
            Return to your calmest version of the dashboard.
          </h1>
          <p className="mt-5 text-base leading-8 text-[var(--app-text-muted)]">
            Log back in, review last night, and keep your momentum moving with a sleep routine that already knows you.
          </p>

          <div className="mt-8 grid gap-4">
            {cues.map(({ icon: Icon, label }) => (
              <div key={label} className="premium-panel rounded-[24px] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--app-accent-strong)]/12 text-[var(--app-accent-strong)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm leading-7 text-[var(--app-text-muted)]">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[28px] border border-[var(--app-line)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--app-gradient-start)_22%,transparent),color-mix(in_srgb,var(--app-gradient-end)_18%,transparent))] p-5">
            <p className="text-sm font-medium">Biometric-ready experience</p>
            <p className="mt-2 text-sm leading-7 text-[var(--app-text-muted)]">
              Sign in now with email or Google. Device unlock and faster return flows can sit on top later without changing your account.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="premium-panel-strong rounded-[36px] p-8 lg:p-10"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9BC5FF]">Sign in</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Your streak is waiting.</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--app-text-muted)]">
            Continue with Google or use your email and password to jump back in.
          </p>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="premium-panel mt-8 flex w-full items-center justify-center gap-3 rounded-[22px] px-4 py-4 text-sm font-semibold transition-all duration-300 hover:scale-[1.01] hover:border-[var(--app-accent-strong)]/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--app-text-muted)] border-t-transparent" />
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--app-line)]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--app-text-muted)]">or use email</span>
            <div className="h-px flex-1 bg-[var(--app-line)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-text-muted)]" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input w-full rounded-[22px] py-4 pl-11 pr-4 text-sm placeholder:text-[var(--app-text-muted)]/80 focus:outline-none focus:premium-input-focus"
                aria-label="Email address"
              />
            </div>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-text-muted)]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="premium-input w-full rounded-[22px] py-4 pl-11 pr-12 text-sm placeholder:text-[var(--app-text-muted)]/80 focus:outline-none focus:premium-input-focus"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--app-text-muted)] transition-colors hover:text-[var(--app-text)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs font-medium text-[var(--app-text-muted)] transition-colors hover:text-[var(--app-accent-strong)]">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--app-accent-strong)] px-6 py-4 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_14px_44px_rgba(0,229,194,0.22)] transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#062019] border-t-transparent" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 rounded-[22px] border border-[var(--app-line)] bg-white/5 px-4 py-4 text-sm text-[var(--app-text-muted)]">
            Magic-link and biometric shortcuts can layer on top later without changing your current auth flow.
          </div>

          <p className="mt-6 text-center text-sm text-[var(--app-text-muted)]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[var(--app-text)] transition-colors hover:text-[var(--app-accent-strong)]">
              Create one free
            </Link>
          </p>
        </motion.section>
      </div>
    </main>
  );
}
