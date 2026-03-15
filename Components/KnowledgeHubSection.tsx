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

export default async function KnowledgeHubSection() {
  const articles = await prisma.knowledgeArticle.findMany({
    orderBy: { crawledAt: "desc" },
    take: 3,
    select: {
      id: true,
      url: true,
      content: true,
      source: true,
      crawledAt: true,
    },
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Knowledge Hub</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Fresh Sleep Articles
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Curated tips from trusted sleep sources for practical daily improvements.
          </p>
        </div>
        <Link
          href="/blog"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          See all
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          No articles yet. Run a crawl from admin to populate the knowledge hub.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((article) => {
            const title = getArticleTitle(article.content, article.url);
            const preview = getArticlePreview(article.content, 140);
            const image = getArticleImage(article);
            const slug = getArticleSlug(article);

            return (
              <article
                key={article.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                    {sourceLabel(article.source)}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 text-base font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{preview}</p>
                  <Link
                    href={`/blog/${slug}`}
                    className="mt-4 inline-flex rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700 hover:bg-sky-100"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
