import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import prisma from "@/prisma/prismaClient";
import {
  getArticleDigest,
  getArticleImage,
  getArticlePreview,
  getArticleTakeaways,
  getArticleTitle,
  parseIdFromSlug,
  sourceLabel,
} from "@/lib/blogArticle";

export const dynamic = "force-dynamic";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const id = parseIdFromSlug(slug);

  if (!id) {
    return {
      title: "Sleep Tips & Articles | SleepSync",
      description: "Detailed sleep health article from SleepSync knowledge base.",
    };
  }

  const article = await prisma.knowledgeArticle.findUnique({
    where: { id },
    select: { url: true, content: true },
  });

  if (!article) {
    return {
      title: "Sleep Tips & Articles | SleepSync",
      description: "Detailed sleep health article from SleepSync knowledge base.",
    };
  }

  return {
    title: `${getArticleTitle(article.content, article.url)} | SleepSync`,
    description: getArticlePreview(article.content, 155),
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const id = parseIdFromSlug(slug);

  if (!id) {
    notFound();
  }

  const article = await prisma.knowledgeArticle.findUnique({
    where: { id },
    select: {
      id: true,
      url: true,
      content: true,
      source: true,
      crawledAt: true,
    },
  });

  if (!article) {
    notFound();
  }

  const title = getArticleTitle(article.content, article.url);
  const image = getArticleImage(article);
  const digest = getArticleDigest(article.content, 900);
  const takeaways = getArticleTakeaways(article.content, 4);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/blog" className="mb-6 inline-flex text-sm font-medium text-sky-700 hover:text-sky-800">
        Back to all articles
      </Link>

      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-56 w-full sm:h-72">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1024px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <p className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
            {sourceLabel(article.source)}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>Fetched {article.crawledAt.toLocaleString()}</span>
            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-sky-700 underline hover:text-sky-800"
            >
              Original source
            </a>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-5">
            <section className="md:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">Quick Read</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{digest}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
              >
                Continue on source site
              </a>
            </section>

            <aside className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-sky-700">Key Takeaways</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {takeaways.length > 0 ? (
                  takeaways.map((item, index) => (
                    <li key={index} className="rounded-lg bg-slate-50 px-3 py-2 leading-relaxed">
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="rounded-lg bg-slate-50 px-3 py-2 leading-relaxed">
                    This article contains practical guidance for better sleep habits.
                  </li>
                )}
              </ul>
            </aside>
          </div>

          <details className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer text-sm font-semibold text-slate-800">
              Read full extracted text
            </summary>
            <div className="prose prose-slate mt-4 max-w-none prose-headings:scroll-mt-24 prose-a:text-sky-700">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </details>
        </div>
      </article>
    </main>
  );
}
