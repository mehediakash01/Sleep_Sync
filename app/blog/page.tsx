import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/prisma/prismaClient";
import {
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
    <main className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Sleep Tips & Articles
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Fresh, evidence-based sleep resources pulled from trusted health sources.
        </p>

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
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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

            return (
              <article
                key={article.id}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-700">
                  {sourceLabel(article.source)}
                </p>
                <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">{title}</h2>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">{preview}</p>

                <div className="mt-auto pt-5">
                  <p className="text-xs text-slate-500">
                    Fetched {article.crawledAt.toLocaleDateString()}
                  </p>
                  <Link
                    href={`/blog/${slug}`}
                    className="mt-3 inline-flex items-center text-sm font-medium text-sky-700 transition hover:text-sky-800"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
