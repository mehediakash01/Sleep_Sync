import Link from "next/link";
import { ArrowRight, MoonStar, Twitter, Youtube, Facebook } from "lucide-react";

const linkGroups = {
  Product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Streaks", href: "/Streak" },
    { label: "AI Coach", href: "/AiCoach" },
  ],
  Explore: [
    { label: "Blog", href: "/blogs" },
    { label: "About", href: "/about" },
    { label: "Register", href: "/register" },
  ],
  Support: [
    { label: "Login", href: "/login" },
    { label: "Notifications", href: "/notification" },
    { label: "Sleep Tracking", href: "/dashboard/sleepTracking" },
  ],
};

const socials = [
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "YouTube", href: "#", icon: Youtube },
  { label: "Facebook", href: "#", icon: Facebook },
];

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--app-line)] bg-[var(--app-bg-secondary)] text-[var(--app-text)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(76,43,140,0.22),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(0,229,194,0.1),_transparent_20%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--app-gradient-start),var(--app-gradient-end))] text-[var(--app-accent-strong)] shadow-[0_0_24px_rgba(0,229,194,0.16)]">
                <MoonStar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.24em] text-[#9BC5FF]">SLEEPSYNC</p>
                <p className="text-sm text-[var(--app-text-muted)]">AI sleep coaching platform</p>
              </div>
            </div>

            <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Calm technology for better nights and clearer mornings.
            </h2>
            <p className="max-w-xl text-sm leading-8 text-[var(--app-text-muted)]">
              Track sleep, build momentum, and get personal coaching in an interface
              designed to feel restorative, not overwhelming.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--app-accent-strong)] px-6 py-3.5 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_36px_rgba(0,229,194,0.22)] transition-all duration-300 hover:scale-[1.02]"
              >
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/AiCoach"
                className="inline-flex items-center justify-center rounded-full border border-[var(--app-line)] bg-white/5 px-6 py-3.5 text-sm font-medium text-[var(--app-text-muted)] transition-colors duration-300 hover:bg-white/10 hover:text-[var(--app-text)]"
              >
                Preview AI Coach
              </Link>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {Object.entries(linkGroups).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9BC5FF]">{title}</h3>
                <div className="mt-4 grid gap-3">
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm text-[var(--app-text-muted)] transition-colors duration-300 hover:text-[var(--app-text)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-[var(--app-line)] pt-6 text-sm text-[var(--app-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SleepSync. Designed for calmer nights.</p>
          <div className="flex items-center gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--app-line)] bg-white/5 text-[var(--app-text-muted)] transition-colors duration-300 hover:border-[var(--app-accent-strong)]/30 hover:text-[var(--app-accent-strong)]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
