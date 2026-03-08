import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Twitter, Youtube, Facebook, Moon, Mail, ArrowRight } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sleep Tracking", href: "/dashboard/sleepTracking" },
    { label: "Insights", href: "/dashboard/sleepInsights" },
    { label: "Streak", href: "/dashboard/streak" },
  ],
  Resources: [
    { label: "Blogs", href: "/blogs" },
    { label: "AI Coach", href: "/AiCoach" },
    { label: "About", href: "/about" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Facebook, href: "#", label: "Facebook" },
];

export const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Top CTA strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#89CFF0]/10 text-[#89CFF0]">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Stay in the loop</p>
              <p className="text-xs text-gray-500">Get weekly sleep tips straight to your inbox</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-56 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#89CFF0]/50 transition"
            />
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#89CFF0] hover:bg-[#6ab8e0] text-gray-900 font-semibold text-sm transition">
              Subscribe <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-[#89CFF0]/10">
              <Moon size={22} className="text-[#89CFF0]" />
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight">SleepSync</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
            Your personal sleep companion. Track, analyse, and improve your rest habits with the help of AI-powered insights.
          </p>
          {/* Socials */}
          <div className="flex items-center gap-3 pt-1">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#89CFF0]/15 hover:border-[#89CFF0]/30 hover:text-[#89CFF0] transition"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading} className="space-y-4">
            <h4 className="text-white text-sm font-semibold uppercase tracking-widest">
              {heading}
            </h4>
            <ul className="space-y-2.5">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-[#89CFF0] transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} SleepSync Ltd. All rights reserved.</p>
          <p>Providing reliable sleep advice since 2025.</p>
        </div>
      </div>
    </footer>
  );
};
