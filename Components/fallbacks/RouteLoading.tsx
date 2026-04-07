import { MoonStar, Sparkles, Stars } from "lucide-react";

type RouteLoadingProps = {
  badge?: string;
  description?: string;
  title?: string;
};

export function RouteLoading({
  badge = "Loading",
  description = "Preparing the next screen with the same calm, premium feel.",
  title = "One quiet moment while we get things ready.",
}: RouteLoadingProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A1428] px-6 pb-16 pt-32 text-[#F5F0E8] lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(76,43,140,0.42),_transparent_32%),radial-gradient(circle_at_20%_20%,_rgba(0,229,194,0.12),_transparent_18%),linear-gradient(180deg,_#091224_0%,_#0A1428_42%,_#08101E_100%)]" />
        <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(76,43,140,0.48)_0%,_rgba(30,27,75,0.2)_45%,_transparent_75%)] blur-3xl" />
        <div className="absolute right-[-5rem] top-40 h-80 w-80 rounded-full bg-[#00E5C2]/10 blur-3xl" />
        <div className="absolute left-[-6rem] top-[28rem] h-72 w-72 rounded-full bg-[#4C2B8C]/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[70vh] max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="space-y-7">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9BC5FF]">
            <Stars className="h-4 w-4 text-[#00E5C2]" />
            {badge}
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl">
              {title}
            </h1>
            <p className="max-w-xl text-base leading-8 text-[#F5F0E8]/68 sm:text-lg">
              {description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
              >
                <div className="h-3 w-16 animate-pulse rounded-full bg-white/10" />
                <div className="mt-5 h-8 w-20 animate-pulse rounded-full bg-white/10" />
                <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-white/10" />
                <div className="mt-2 h-3 w-3/4 animate-pulse rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-white/10 bg-white/5 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(12,19,36,0.96),rgba(9,14,28,0.92))] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                <div className="mt-4 h-8 w-44 animate-pulse rounded-full bg-white/10" />
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#00E5C2]/30 bg-[#00E5C2]/10 text-[#00E5C2]">
                <MoonStar className="h-6 w-6 animate-pulse" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle,_rgba(0,229,194,0.14),_transparent_60%)]">
                  <div className="h-28 w-28 animate-pulse rounded-full border border-white/10 bg-white/10" />
                </div>
                <div className="mt-5 space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-10 animate-pulse rounded-2xl bg-white/[0.05]"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
                      <div className="h-3 w-48 animate-pulse rounded-full bg-white/10" />
                    </div>
                    <Sparkles className="h-5 w-5 text-[#00E5C2] animate-pulse" />
                  </div>
                  <div className="mt-6 flex h-28 items-end gap-3">
                    {[48, 62, 56, 76, 70, 84, 92].map((value, index) => (
                      <div
                        key={`${value}-${index}`}
                        className="flex flex-1 flex-col items-center gap-3"
                      >
                        <div className="flex h-24 w-full items-end rounded-full bg-white/[0.03] p-1">
                          <div
                            className="w-full animate-pulse rounded-full bg-[linear-gradient(180deg,rgba(0,229,194,0.85),rgba(76,43,140,0.7))]"
                            style={{ height: `${value}%` }}
                          />
                        </div>
                        <div className="h-2 w-4 animate-pulse rounded-full bg-white/10" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-[24px] border border-white/10 bg-[#0E1730]/92 p-4"
                    >
                      <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
                      <div className="mt-4 h-5 w-28 animate-pulse rounded-full bg-white/10" />
                      <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-white/10" />
                      <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-white/10" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
