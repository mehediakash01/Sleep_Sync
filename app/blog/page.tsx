import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  FileText,
  MoonStar,
  Sparkles,
  Stars,
} from "lucide-react";
import prisma from "@/prisma/prismaClient";
import {
  getArticleImage,
  getArticlePreview,
  getArticleSlug,
  getArticleTakeaways,
  getArticleTitle,
  sourceLabel,
} from "@/lib/blogArticle";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

interface BlogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const SOURCE_FILTERS = ["all", "SleepFoundation", "Mayo Clinic", "CDC"] as const;

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

const shell =
  "rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl";
const eyebrow =
  "inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9BC5FF]";

function toSourceFilter(value: string | null): (typeof SOURCE_FILTERS)[number] {
  if (!value) {
    return "all";
  }

  const normalized = value.toLowerCase();
  if (normalized === "sleepfoundation") {
    return "SleepFoundation";
  }
  if (normalized === "mayo" || normalized === "mayo-clinic") {
    return "Mayo Clinic";
  }
  if (normalized === "cdc") {
    return "CDC";
  }

  return "all";
}

function sourceWhere(filter: (typeof SOURCE_FILTERS)[number]) {
  if (filter === "SleepFoundation") {
    return { source: { contains: "sleepfoundation", mode: "insensitive" as const } };
  }

  if (filter === "Mayo Clinic") {
    return { source: { contains: "mayo", mode: "insensitive" as const } };
  }

  if (filter === "CDC") {
    return { source: { contains: "cdc.gov", mode: "insensitive" as const } };
  }

  return {};
}

export async function generateMetadata(): Promise<Metadata> {
  const firstArticle = await prisma.knowledgeArticle.findFirst({
    orderBy: { crawledAt: "desc" },
    select: { content: true },
  });

  return {
    title: "Sleep Tips & Articles | SleepSync",
    description:
      firstArticle?.content
        ?.replace(/\s+/g, " ")
        .trim()
        .slice(0, 155) || "Recent evidence-based sleep tips and articles curated by SleepSync.",
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const sp = await searchParams;
  const sourceParam = typeof sp.source === "string" ? sp.source : null;
  const filter = toSourceFilter(sourceParam);

  const articles = await prisma.knowledgeArticle.findMany({
    where: sourceWhere(filter),
    orderBy: { crawledAt: "desc" },
    take: PAGE_SIZE,
    select: {
      id: true,
      url: true,
      content: true,
      source: true,
      crawledAt: true,
    },
  });

  const featuredArticle = articles[0] ?? null;
  const remainingArticles = featuredArticle ? articles.slice(1) : [];
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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
        <section className="mx-auto grid min-h-[88vh] max-w-7xl gap-16 px-6 pb-14 pt-32 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-20 lg:pt-40">
          <div className="flex max-w-2xl flex-col justify-center gap-8">
            <div className={eyebrow}>
              <Stars className="h-4 w-4 text-[#00E5C2]" />
              Knowledge Hub
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Evidence-based sleep reading, curated with calm.
              </h1>
              <p className="max-w-xl text-base leading-8 text-[#F5F0E8]/72 sm:text-lg">
                Browse trusted sleep articles from expert sources, filtered into
                a cleaner, calmer reading experience that feels aligned with the
                rest of SleepSync.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href={featuredArticle ? `/blog/${getArticleSlug(featuredArticle)}` : "/dashboard"}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#00E5C2] px-7 py-4 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_40px_rgba(0,229,194,0.25)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_16px_56px_rgba(0,229,194,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00E5C2]"
              >
                {featuredArticle ? "Read Latest Article" : "Open Dashboard"}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/AiCoach"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-7 py-4 text-sm font-semibold backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-[#00E5C2]/40 hover:bg-white/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00E5C2]"
              >
                Ask the AI Coach
              </Link>
            </div>

            <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl sm:grid-cols-3">
              {[
                [`${articles.length}`, "Fresh articles surfaced in this view"],
                [`${SOURCE_FILTERS.length - 1}`, "Trusted medical and sleep sources"],
                [filter === "all" ? "All" : filter, "Current source filter applied"],
              ].map(([value, label]) => (
                <div key={`${value}-${label}`}>
                  <p className="text-3xl font-semibold tracking-[-0.03em]">
                    {value}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-[#F5F0E8]/64">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[520px] items-center justify-center lg:min-h-[680px]">
            <div className="absolute left-0 top-16 hidden w-56 rounded-[28px] border border-white/12 bg-[#111B31]/80 p-5 backdrop-blur-2xl lg:block">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#F5F0E8]/45">
                    Focus
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    Trusted reading only
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#00E5C2]/35 bg-[#00E5C2]/12 text-[#00E5C2] shadow-[0_0_24px_rgba(0,229,194,0.18)]">
                  <BookOpenText className="h-7 w-7" />
                </div>
              </div>
              <div className="space-y-3 text-sm text-[#F5F0E8]/68">
                <div className="rounded-2xl bg-white/5 px-3 py-2.5">
                  SleepFoundation, Mayo Clinic, and CDC content.
                </div>
                <div className="rounded-2xl bg-white/5 px-3 py-2.5">
                  Cleaner previews and direct paths into full articles.
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 right-2 hidden w-64 rounded-[30px] border border-white/10 bg-[#121B32]/82 p-5 backdrop-blur-2xl lg:block">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00E5C2]/14 text-[#00E5C2]">
                  <MoonStar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Reading ritual</p>
                  <p className="text-xs text-[#F5F0E8]/50">
                    Built for calmer discovery
                  </p>
                </div>
              </div>
              <p className="text-sm leading-7 text-[#F5F0E8]/72">
                The blog hub is designed to feel like the product itself:
                quieter, clearer, and easier to trust at a glance.
              </p>
            </div>

            <div className="relative w-full rounded-[40px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(12,19,36,0.96),rgba(9,14,28,0.92))] p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#F5F0E8]/45">
                      Source filters
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                      Browse by trusted publisher
                    </p>
                  </div>
                  <div className="rounded-full border border-[#00E5C2]/25 bg-[#00E5C2]/10 px-3 py-1 text-xs font-medium text-[#00E5C2]">
                    {filter === "all" ? "Showing all sources" : filter}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {SOURCE_FILTERS.map((option) => {
                    const href =
                      option === "all"
                        ? "/blog"
                        : `/blog?source=${encodeURIComponent(option)}`;
                    const active = filter === option;

                    return (
                      <Link
                        key={option}
                        href={href}
                        className={`inline-flex items-center rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                          active
                            ? "bg-[#00E5C2] text-[#062019] shadow-[0_10px_30px_rgba(0,229,194,0.22)]"
                            : "border border-white/10 bg-white/5 text-[#F5F0E8]/72 hover:border-[#00E5C2]/30 hover:text-[#F5F0E8]"
                        }`}
                      >
                        {option}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    ["Updated feed", "Recent crawls appear first for faster scanning."],
                    ["Readable previews", "Long source content is summarized into quick openers."],
                    ["Direct access", "Jump from the hub straight into the article detail page."],
                  ].map(([title, body]) => (
                    <div
                      key={title}
                      className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-sm font-medium">{title}</p>
                      <p className="mt-2 text-sm leading-7 text-[#F5F0E8]/58">
                        {body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {articles.length === 0 ? (
          <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-8">
            <div className={`${shell} p-10 text-center`}>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#00E5C2]/20 bg-[#00E5C2]/10 text-[#00E5C2]">
                <FileText className="h-7 w-7" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">
                No articles found for this source yet.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-[#F5F0E8]/64 sm:text-base">
                Try another filter or check back after the next crawl. The hub
                will automatically surface new evidence-based content as it
                arrives.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full bg-[#00E5C2] px-6 py-3.5 text-sm font-semibold text-[#062019]"
                >
                  View All Sources
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            {featuredArticle ? (
              <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                <div className="grid items-stretch gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                  <article className={`${shell} overflow-hidden p-4 sm:p-5`}>
                    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                      <div className="relative min-h-[280px] overflow-hidden rounded-[28px] border border-white/10">
                        <Image
                          src={getArticleImage(featuredArticle)}
                          alt={getArticleTitle(featuredArticle.content, featuredArticle.url)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08101E]/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0A1428]">
                            {sourceLabel(featuredArticle.source)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-6 p-2">
                        <div>
                          <div className={eyebrow}>Featured Article</div>
                          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                            {getArticleTitle(
                              featuredArticle.content,
                              featuredArticle.url,
                            )}
                          </h2>
                          <p className="mt-4 text-base leading-8 text-[#F5F0E8]/66">
                            {getArticlePreview(featuredArticle.content, 320)}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-[#F5F0E8]/58">
                            <span className="inline-flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-[#00E5C2]" />
                              {formatter.format(featuredArticle.crawledAt)}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <BookOpenText className="h-4 w-4 text-[#00E5C2]" />
                              Curated from a trusted source
                            </span>
                          </div>

                          <div className="space-y-3">
                            {getArticleTakeaways(featuredArticle.content, 3).map(
                              (item) => (
                                <div
                                  key={item}
                                  className="flex items-start gap-3 rounded-2xl bg-white/[0.04] px-4 py-3"
                                >
                                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[#00E5C2]" />
                                  <p className="text-sm leading-7 text-[#F5F0E8]/68">
                                    {item}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>

                          <Link
                            href={`/blog/${getArticleSlug(featuredArticle)}`}
                            className="inline-flex items-center gap-2 rounded-full bg-[#00E5C2] px-6 py-3.5 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_40px_rgba(0,229,194,0.22)] transition-all duration-300 hover:scale-[1.03]"
                          >
                            Read full article
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>

                  <div className="grid gap-5">
                    <div className={`${shell} p-7`}>
                      <div className={eyebrow}>Reading Notes</div>
                      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em]">
                        Why this hub feels different
                      </h2>
                      <p className="mt-4 text-sm leading-8 text-[#F5F0E8]/64 sm:text-base">
                        We designed the blog experience to feel like a natural
                        extension of the product: less clutter, stronger
                        editorial hierarchy, and faster access to the most
                        relevant sleep insights.
                      </p>
                    </div>

                    <div className={`${shell} p-7`}>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#9BC5FF]">
                        In this feed
                      </p>
                      <div className="mt-5 space-y-3">
                        {[
                          [`${articles.length}`, "articles available in the current view"],
                          [sourceLabel(featuredArticle.source), "current featured source"],
                          ["Fresh first", "articles ordered by latest crawl date"],
                        ].map(([value, label]) => (
                          <div
                            key={`${value}-${label}`}
                            className="flex items-center justify-between rounded-2xl bg-[#F5F0E8]/[0.04] px-4 py-3 text-sm"
                          >
                            <span className="text-[#F5F0E8]/62">{label}</span>
                            <span className="font-medium text-[#F5F0E8]">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className={eyebrow}>Latest Articles</div>
                  <h2 className="mt-5 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                    Keep reading from trusted sleep sources.
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-8 text-[#F5F0E8]/64 sm:text-base">
                  The newest stories stay easy to scan, with stronger previews
                  and a layout that keeps the best next read visible.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {remainingArticles.map((article) => {
                  const title = getArticleTitle(article.content, article.url);
                  const preview = getArticlePreview(article.content, 210);
                  const slug = getArticleSlug(article);
                  const image = getArticleImage(article);

                  return (
                    <article
                      key={article.id}
                      className={`${shell} group flex h-full flex-col overflow-hidden p-4 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00E5C2]/20 hover:shadow-[0_20px_64px_rgba(0,0,0,0.28)]`}
                    >
                      <div className="relative h-52 overflow-hidden rounded-[24px] border border-white/10">
                        <Image
                          src={image}
                          alt={title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08101E]/80 via-transparent to-transparent" />
                        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0A1428]">
                          {sourceLabel(article.source)}
                        </span>
                      </div>

                      <div className="flex h-full flex-col px-2 pb-2 pt-5">
                        <h3 className="line-clamp-2 text-2xl font-semibold tracking-[-0.02em] text-[#F5F0E8]">
                          {title}
                        </h3>
                        <p className="mt-3 line-clamp-4 text-sm leading-8 text-[#F5F0E8]/62">
                          {preview}
                        </p>

                        <div className="mt-auto pt-6">
                          <p className="text-xs text-[#F5F0E8]/46">
                            Fetched {formatter.format(article.crawledAt)}
                          </p>
                          <Link
                            href={`/blog/${slug}`}
                            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-[#F5F0E8] transition-all duration-300 hover:border-[#00E5C2]/35 hover:text-[#7EF7E2]"
                          >
                            Read more
                            <ArrowRight className="h-4 w-4 text-[#00E5C2]" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 pb-28 pt-4 lg:px-8">
              <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(135deg,rgba(30,27,75,0.86),rgba(76,43,140,0.7),rgba(0,229,194,0.14))] px-8 py-12 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:px-12 lg:px-16 lg:py-16">
                <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(0,229,194,0.18),_transparent_56%)] lg:block" />
                <div className="relative z-10 max-w-3xl">
                  <div className={eyebrow}>Next Step</div>
                  <h2 className="mt-6 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                    Read the science, then turn it into better nights.
                  </h2>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-[#F5F0E8]/76 sm:text-lg">
                    Use the hub for trusted context, then bring what you learn
                    back into SleepSync to track patterns, build rituals, and
                    get more personal guidance.
                  </p>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00E5C2] px-7 py-4 text-sm font-semibold text-[#062019] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_14px_44px_rgba(0,229,194,0.26)] transition-all duration-300 hover:scale-[1.03]"
                    >
                      Start Free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/5 px-7 py-4 text-sm font-semibold backdrop-blur-2xl transition-all duration-300 hover:border-[#00E5C2]/35 hover:bg-white/8"
                    >
                      Open Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
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
