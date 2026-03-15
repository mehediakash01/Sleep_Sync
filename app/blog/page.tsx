import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/prisma/prismaClient";
import {
  getArticleImage,
  getArticlePreview,
  getArticleSlug,
  getArticleTitle,
  sourceLabel,
} from "@/lib/blogArticle";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

interface BlogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const SOURCE_FILTERS = ["all", "SleepFoundation", "Mayo Clinic", "CDC"] as const;

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

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-sky-100 via-cyan-50 to-violet-100 p-6 shadow-sm sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
        <div className="absolute -bottom-10 left-20 h-36 w-36 rounded-full bg-sky-200/50 blur-2xl" />

        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Knowledge Hub
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Sleep Tips & Articles
          </h1>
          <p className="mt-3 text-sm text-slate-700 sm:text-base">
            Fresh, evidence-based sleep resources from trusted sources, curated for SleepSync users.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {SOURCE_FILTERS.map((option) => {
            const href = option === "all" ? "/blog" : `/blog?source=${encodeURIComponent(option)}`;
            const active = filter === option;
            return (
              <Link
                key={option}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white/80 text-slate-700 hover:bg-white"
                }`}
              >
                {option}
              </Link>
            );
          })}
        </div>
      </section>

      {articles.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          No articles found yet for this source.
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const title = getArticleTitle(article.content, article.url);
            const preview = getArticlePreview(article.content, 200);
            const slug = getArticleSlug(article);
            const image = getArticleImage(article);

            return (
              <article
                key={article.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                  <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                    {sourceLabel(article.source)}
                  </p>
                </div>

                <div className="flex h-full flex-col p-5">
                  <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">{title}</h2>
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">{preview}</p>

                  <div className="mt-auto pt-5">
                  <p className="text-xs text-slate-500">
                    Fetched {article.crawledAt.toLocaleDateString()}
                  </p>
                  <Link
                    href={`/blog/${slug}`}
                    className="mt-3 inline-flex items-center rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 hover:text-sky-800"
                  >
                    Read more
                  </Link>
                </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
