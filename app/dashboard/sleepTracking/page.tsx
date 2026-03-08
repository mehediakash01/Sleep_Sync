import React from 'react'
import { SleepTrackForm } from './SleepTrackForm'
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from '@/lib/authOptions';
import Link from 'next/link';
import { ChevronRight, Moon, ClipboardList } from 'lucide-react';

export default async function SleepTrackingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/sleep");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] to-[#f5f0ff] pb-16">
      {/* Top header strip */}
      <div className="bg-gradient-to-r from-primary to-secondary py-8 px-6 shadow-md">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-white/70 text-sm mb-3">
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Log Sleep</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <Moon size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white leading-tight">Log Your Sleep Session</h1>
              <p className="text-white/80 text-sm mt-0.5">
                Fill in 4 quick steps — takes less than 2 minutes
              </p>
            </div>
          </div>

          {/* Step roadmap chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {["1 · Session Time", "2 · How You Felt", "3 · Before-Bed Factors", "4 · Notes"].map((label, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/25"
              >
                <ClipboardList size={11} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 -mt-2 pt-6">
        <SleepTrackForm />
      </div>
    </div>
  )
}
