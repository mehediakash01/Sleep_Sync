import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/prisma/prismaClient";
import { authOptions } from "@/lib/authOptions";
import { triggerWeeklyCrawl } from "@/lib/weeklyCrawl";

export const dynamic = "force-dynamic";

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function getAdminEmails(): Set<string> {
  const raw = process.env.CRAWL_ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((email) => normalizeEmail(email))
      .filter(Boolean)
  );
}

async function triggerWeeklyCrawlAction(): Promise<void> {
  "use server";

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email ? normalizeEmail(session.user.email) : "";
  const adminEmails = getAdminEmails();

  if (!userEmail || !adminEmails.has(userEmail)) {
    throw new Error("Forbidden");
  }

  const result = await triggerWeeklyCrawl();
  revalidatePath("/admin/crawl");

  const allFailed =
    result.failed.length > 0 && result.jobs.length === 0 && result.skipped.length === 0;

  if (allFailed) {
    redirect("/admin/crawl?status=failed");
  } else {
    redirect(`/admin/crawl?status=ok&saved=${result.jobs.length}`);
  }
}

const STATUS_COLORS: Record<string, string> = {
  success: "text-green-700 bg-green-50",
  failed: "text-red-700 bg-red-50",
  running: "text-yellow-700 bg-yellow-50",
  idle: "text-gray-600 bg-gray-100",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminCrawlPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email ? normalizeEmail(session.user.email) : "";

  if (!userEmail) {
    redirect("/login?from=/admin/crawl");
  }

  const adminEmails = getAdminEmails();
  if (!adminEmails.has(userEmail)) {
    redirect("/dashboard");
  }

  const sp = await searchParams;
  const triggerStatus = typeof sp.status === "string" ? sp.status : null;
  const savedCount = typeof sp.saved === "string" ? parseInt(sp.saved, 10) : 0;

  let sources: Awaited<ReturnType<typeof prisma.crawlSource.findMany>> = [];
  let entries: Awaited<ReturnType<typeof prisma.knowledgeArticle.findMany>> = [];
  let totalArticles = 0;
  let dataLoadError = "";

  try {
    [sources, entries, totalArticles] = await Promise.all([
      prisma.crawlSource.findMany({ orderBy: { updatedAt: "desc" } }),
      prisma.knowledgeArticle.findMany({ orderBy: { crawledAt: "desc" }, take: 20 }),
      prisma.knowledgeArticle.count(),
    ]);
  } catch (error) {
    console.error("[admin/crawl] Failed to load crawl data:", error);
    dataLoadError = "Crawl data could not be loaded. Verify DB schema is in sync.";
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Header + Trigger */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Sleep Knowledge Base</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fetches articles from trusted sleep health sources (SleepFoundation, Mayo Clinic, CDC)
          and stores them in the database. The AI Coach uses this knowledge to give evidence-based
          answers.{" "}
          <span className="font-medium text-gray-800">
            Currently {totalArticles} article{totalArticles !== 1 ? "s" : ""} stored.
          </span>
        </p>

        <form action={triggerWeeklyCrawlAction} className="mt-4">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 active:scale-95 transition-transform"
          >
            Fetch All Sources Now
          </button>
          <p className="mt-1 text-xs text-gray-500">
            Also runs automatically every Monday at 3 AM UTC via cron.
          </p>
        </form>

        {triggerStatus === "ok" && (
          <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Crawl complete — {savedCount} source{savedCount !== 1 ? "s" : ""} fetched successfully.
            Knowledge base updated.
          </p>
        )}
        {triggerStatus === "failed" && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            All sources failed to fetch. Check the error column below for details.
          </p>
        )}
        {dataLoadError && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{dataLoadError}</p>
        )}
      </section>

      {/* Source Status */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Source Status</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
                <th className="py-2 pr-4">Source URL</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Last Fetched</th>
                <th className="py-2 pr-4">Last Error</th>
              </tr>
            </thead>
            <tbody>
              {sources.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-gray-400 text-center">
                    No sources yet — click &ldquo;Fetch All Sources Now&rdquo; to populate.
                  </td>
                </tr>
              ) : (
                sources.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 align-top">
                    <td className="py-3 pr-4 break-all max-w-xs">
                      <a
                        href={item.source}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 underline"
                      >
                        {item.source}
                      </a>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[item.lastStatus] ?? "text-gray-600 bg-gray-100"
                        }`}
                      >
                        {item.lastStatus}
                      </span>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap text-gray-600">
                      {item.lastCrawledAt ? item.lastCrawledAt.toLocaleString() : "—"}
                    </td>
                    <td className="py-3 text-xs text-red-600 break-all max-w-xs">
                      {item.lastError ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Recent Articles
          <span className="ml-2 text-sm font-normal text-gray-500">(latest 20 of {totalArticles})</span>
        </h2>
        {entries.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            No articles yet. Click &ldquo;Fetch All Sources Now&rdquo; to populate the knowledge base.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {entries.map((entry) => (
              <article key={entry.id} className="rounded-lg border border-gray-100 p-4">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-700 underline break-all"
                >
                  {entry.url}
                </a>
                <p className="mt-1 text-xs text-gray-500">
                  Fetched {entry.crawledAt.toLocaleString()} ·{" "}
                  {Math.round(entry.content.length / 1000)}k chars
                </p>
                <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                  {entry.content.slice(0, 300)}
                  {entry.content.length > 300 ? "…" : ""}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
