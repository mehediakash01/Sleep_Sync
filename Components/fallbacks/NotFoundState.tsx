import Link from "next/link";
import { ArrowRight, Compass, Home, MoonStar } from "lucide-react";

type NotFoundStateProps = {
  description?: string;
  title?: string;
};

export function NotFoundState({
  description = "The page you’re looking for may have moved, expired, or never existed in this route tree.",
  title = "That page drifted out of orbit.",
}: NotFoundStateProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A1428] px-6 pb-20 pt-32 text-[#F5F0E8] lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(76,43,140,0.42),_transparent_32%),radial-gradient(circle_at_20%_20%,_rgba(0,229,194,0.12),_transparent_18%),linear-gradient(180deg,_#091224_0%,_#0A1428_42%,_#08101E_100%)]" />
        <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(76,43,140,0.48)_0%,_rgba(30,27,75,0.2)_45%,_transparent_75%)] blur-3xl" />
        <div className="absolute right-[-5rem] top-40 h-80 w-80 rounded-full bg-[#00E5C2]/10 blur-3xl" />
        <div className="absolute left-[-6rem] top-[28rem] h-72 w-72 rounded-full bg-[#4C2B8C]/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="rounded-[40px] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-7">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9BC5FF]">
                <Compass className="h-4 w-4 text-[#00E5C2]" />
                404 Not Found
              </div>

              <div className="space-y-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#F5F0E8]/38">
                  Lost route
                </p>
                <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl">
                  {title}
                </h1>
                <p className="max-w-xl text-base leading-8 text-[#F5F0E8]/68 sm:text-lg">
                  {description}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00E5C2] px-7 py-4 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_40px_rgba(0,229,194,0.25)] transition-all duration-300 hover:scale-[1.03]"
                >
                  Back Home
                  <Home className="h-4 w-4" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-7 py-4 text-sm font-semibold backdrop-blur-2xl transition-all duration-300 hover:border-[#00E5C2]/40 hover:bg-white/8"
                >
                  Explore Blog
                  <ArrowRight className="h-4 w-4 text-[#00E5C2]" />
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,19,36,0.96),rgba(9,14,28,0.92))] p-6">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#F5F0E8]/42">
                      Navigation assist
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
                      404
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#00E5C2]/25 bg-[#00E5C2]/10 text-[#00E5C2]">
                    <MoonStar className="h-8 w-8" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Try the main navigation to jump back into the public site.",
                    "Open the blog for fresh sleep articles and resources.",
                    "Head home to restart from the primary landing experience.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[22px] bg-[#F5F0E8]/[0.04] px-4 py-3 text-sm leading-7 text-[#F5F0E8]/68"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
