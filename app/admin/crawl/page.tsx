import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
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

  await triggerWeeklyCrawl();
  revalidatePath("/admin/crawl");
}

export default async function AdminCrawlPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email ? normalizeEmail(session.user.email) : "";
  const adminEmails = getAdminEmails();
  const isAdmin = Boolean(userEmail && adminEmails.has(userEmail));

  if (!isAdmin) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold">Crawl Admin</h1>
        <p className="mt-4 text-red-600">You are not authorized to view this page.</p>
      </main>
    );
  }

  const [sources, entries] = await Promise.all([
    prisma.crawlSource.findMany({
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.knowledgeArticle.findMany({
      orderBy: { crawledAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Weekly Sleep Knowledge Crawl</h1>
        <p className="mt-2 text-sm text-gray-600">
          Starts crawl jobs for trusted sleep sources with incremental fetch from last crawl.
        </p>
        <form action={triggerWeeklyCrawlAction} className="mt-4">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Trigger Weekly Crawl
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Source Status</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Source</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Last Crawled</th>
                <th className="py-2">Last Job</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 align-top">
                  <td className="py-2 pr-4 break-all">{item.source}</td>
                  <td className="py-2 pr-4">{item.lastStatus}</td>
                  <td className="py-2 pr-4">
                    {item.lastCrawledAt ? item.lastCrawledAt.toLocaleString() : "-"}
                  </td>
                  <td className="py-2 break-all">{item.lastJobId ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Recent Knowledge Entries</h2>
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
                {entry.crawledAt.toLocaleString()} · {entry.status}
              </p>
              <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                {entry.content.slice(0, 220)}
                {entry.content.length > 220 ? "..." : ""}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
