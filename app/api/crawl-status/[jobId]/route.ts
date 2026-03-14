import { NextRequest, NextResponse } from "next/server";
import { authorizeCrawlAccess } from "@/lib/crawlAuth";
import { getCloudflareCrawlStatus } from "@/lib/cloudflareCrawl";
import prisma from "@/prisma/prismaClient";

interface CrawlStatusResponse {
  success: boolean;
  done: boolean;
  status?: string;
  pages?: Array<{ url: string; markdown: string }>;
  pollCount?: number;
  persistedCount?: number;
  error?: string;
}

interface RouteContext {
  params: Promise<{
    jobId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<CrawlStatusResponse>> {
  try {
    const auth = await authorizeCrawlAccess(request);
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, done: false, error: auth.error },
        { status: auth.status }
      );
    }

    const { jobId } = await context.params;

    if (!jobId?.trim()) {
      return NextResponse.json(
        { success: false, done: false, error: "jobId is required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const shouldWait = searchParams.get("wait") === "true";
    const shouldStore = searchParams.get("store") === "true";
    const source = searchParams.get("source")?.trim() || "cloudflare-crawl";
    const intervalMs = Number(searchParams.get("intervalMs") ?? "2000");
    const timeoutMs = Number(searchParams.get("timeoutMs") ?? "30000");

    const safeIntervalMs =
      Number.isFinite(intervalMs) && intervalMs >= 500 ? intervalMs : 2000;
    const safeTimeoutMs =
      Number.isFinite(timeoutMs) && timeoutMs >= 1000 ? timeoutMs : 30000;

    let pollCount = 1;
    let status = await getCloudflareCrawlStatus(jobId);

    if (shouldWait && !status.done) {
      const startedAt = Date.now();

      while (!status.done && Date.now() - startedAt < safeTimeoutMs) {
        await new Promise((resolve) => setTimeout(resolve, safeIntervalMs));
        status = await getCloudflareCrawlStatus(jobId);
        pollCount += 1;
      }
    }

    let persistedCount = 0;
    if (shouldStore && status.done && status.pages.length > 0) {
      const operations = status.pages.map((page) =>
        prisma.knowledgeArticle.upsert({
          where: { url: page.url },
          update: {
            content: page.markdown,
            source,
            crawledAt: new Date(),
          },
          create: {
            url: page.url,
            content: page.markdown,
            source,
          },
        })
      );

      await prisma.$transaction(operations);
      persistedCount = operations.length;
    }

    return NextResponse.json(
      {
        success: true,
        done: status.done,
        status: status.status,
        pages: status.done ? status.pages : undefined,
        pollCount,
        persistedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[crawl-status] Failed to check crawl status:", error);

    return NextResponse.json(
      {
        success: false,
        done: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while fetching crawl status",
      },
      { status: 500 }
    );
  }
}
