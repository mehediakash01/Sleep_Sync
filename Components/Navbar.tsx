"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MoonStar, SunMedium, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/Providers";

const navItems = [
  { href: "/Streak", label: "Streaks" },
  { href: "/AiCoach", label: "Coach" },
  { href: "/blogs", label: "Blog" },
  { href: "/about", label: "About" },
];

export const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const avatarFallback = useMemo(() => {
    const seed = session?.user?.name || session?.user?.email || "SleepSync";
    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}`;
  }, [session?.user?.email, session?.user?.name]);

  const handleLogout = async () => {
    setMenuOpen(false);
    setProfileOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  const shell =
    "border border-[var(--app-line)] bg-[var(--app-surface)] backdrop-blur-2xl shadow-[var(--app-shadow)]";

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
        <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 sm:px-6 ${shell}`}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--app-line)] bg-white/5 text-[var(--app-text)] transition-colors duration-300 hover:bg-white/10 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--app-gradient-start),var(--app-gradient-end))] text-[var(--app-accent-strong)] shadow-[0_0_24px_rgba(0,229,194,0.16)]">
                <MoonStar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.24em] text-[#9BC5FF]">SLEEPSYNC</p>
                <p className="text-sm text-[var(--app-text-muted)]">AI sleep coaching</p>
              </div>
            </Link>
          </div>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-white/10 text-[var(--app-text)]"
                      : "text-[var(--app-text-muted)] hover:bg-white/6 hover:text-[var(--app-text)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3" ref={profileRef}>
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--app-line)] bg-white/5 text-[var(--app-text-muted)] transition-all duration-300 hover:scale-105 hover:bg-white/10"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <SunMedium className="h-4.5 w-4.5" /> : <MoonStar className="h-4.5 w-4.5" />}
              </button>
            )}

            {session?.user ? (
              <>
                <button
                  type="button"
                  onClick={() => setProfileOpen((value) => !value)}
                  className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-2 text-left transition-all duration-300 hover:bg-white/10"
                  aria-label="Open profile menu"
                >
                  <Image
                    src={session.user.image || avatarFallback}
                    alt="User avatar"
                    className="h-9 w-9 rounded-full object-cover"
                    width={36}
                    height={36}
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden pr-3 text-sm text-[var(--app-text-muted)] sm:block">
                    {session.user.name || "Your account"}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-4 top-[4.75rem] w-72 rounded-[28px] border border-[var(--app-line)] bg-[var(--app-surface-strong)] p-4 text-[var(--app-text)] shadow-[var(--app-shadow)] backdrop-blur-2xl sm:right-6 lg:right-8"
                    >
                      <div className="flex items-center gap-3 rounded-[22px] bg-white/5 p-3">
                        <Image
                          src={session.user.image || avatarFallback}
                          alt="User avatar"
                          className="h-12 w-12 rounded-2xl object-cover"
                          width={48}
                          height={48}
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{session.user.name || "User"}</p>
                          <p className="truncate text-sm text-[var(--app-text-muted)]">{session.user.email}</p>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            router.push("/dashboard");
                          }}
                          className="rounded-[18px] px-4 py-3 text-left text-sm text-[var(--app-text-muted)] transition-colors duration-300 hover:bg-white/6 hover:text-[var(--app-text)]"
                        >
                          Go to dashboard
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            router.push("/settings");
                          }}
                          className="rounded-[18px] px-4 py-3 text-left text-sm text-[var(--app-text-muted)] transition-colors duration-300 hover:bg-white/6 hover:text-[var(--app-text)]"
                        >
                          Settings
                        </button>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="rounded-[18px] px-4 py-3 text-left text-sm text-[#F97F9A] transition-colors duration-300 hover:bg-[#F97F9A]/10"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-full border border-[var(--app-line)] bg-white/5 px-5 py-3 text-sm font-medium text-[var(--app-text-muted)] transition-all duration-300 hover:bg-white/10 hover:text-[var(--app-text)] sm:inline-flex"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex rounded-full bg-[var(--app-accent-strong)] px-5 py-3 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_36px_rgba(0,229,194,0.24)] transition-all duration-300 hover:scale-[1.02]"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-[#020617]/60 backdrop-blur-sm lg:hidden"
              aria-label="Close navigation overlay"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-sm flex-col border-r border-[var(--app-line)] bg-[var(--app-surface-strong)] p-5 text-[var(--app-text)] backdrop-blur-2xl lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--app-gradient-start),var(--app-gradient-end))] text-[var(--app-accent-strong)]">
                    <MoonStar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold tracking-[0.24em] text-[#9BC5FF]">SLEEPSYNC</p>
                    <p className="text-sm text-[var(--app-text-muted)]">AI sleep coaching</p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 grid gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`rounded-[22px] px-4 py-4 text-sm font-medium transition-colors duration-300 ${
                        isActive ? "bg-white/10 text-[var(--app-text)]" : "text-[var(--app-text-muted)] hover:bg-white/6 hover:text-[var(--app-text)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto space-y-3 pt-6">
                {session?.user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("/dashboard");
                      }}
                      className="w-full rounded-full bg-[var(--app-accent-strong)] px-5 py-3 text-sm font-semibold text-[#062019]"
                    >
                      Go to dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("/settings");
                      }}
                      className="w-full rounded-full border border-[var(--app-line)] bg-white/5 px-5 py-3 text-sm font-medium text-[var(--app-text)]"
                    >
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-[#F97F9A]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-full bg-[var(--app-accent-strong)] px-5 py-3 text-center text-sm font-semibold text-[#062019]"
                    >
                      Start Free
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-full border border-[var(--app-line)] bg-white/5 px-5 py-3 text-center text-sm font-medium text-[var(--app-text-muted)]"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
