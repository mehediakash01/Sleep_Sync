import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import prisma from "@/prisma/prismaClient";
import {
  getArticlePreview,
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

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <Link href="/blog" className="mb-6 inline-flex text-sm font-medium text-sky-700 hover:text-sky-800">
        Back to all articles
      </Link>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
          {sourceLabel(article.source)}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>

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

        <div className="prose prose-slate mt-8 max-w-none prose-headings:scroll-mt-24">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
