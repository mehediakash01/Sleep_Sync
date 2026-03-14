import prisma from "@/prisma/prismaClient";
import { startCloudflareCrawl } from "@/lib/cloudflareCrawl";

export const WEEKLY_CRAWL_SOURCES = [
  "https://www.sleepfoundation.org/",
  "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/sleep/art-20048379",
  "https://www.cdc.gov/sleep/index.html",
] as const;

const DEFAULT_LOOKBACK_DAYS = 7;
const RUNNING_STALE_MS = 2 * 60 * 60 * 1000;

export interface WeeklyCrawlJob {
  source: string;
  jobId: string;
  modifiedSince: string;
}

export interface WeeklyCrawlSkipped {
  source: string;
  reason: string;
}

export interface WeeklyCrawlFailed {
  source: string;
  error: string;
}

export interface WeeklyCrawlResult {
  jobs: WeeklyCrawlJob[];
  skipped: WeeklyCrawlSkipped[];
  failed: WeeklyCrawlFailed[];
  startedAt: string;
}

function getModifiedSince(lastCrawledAt: Date | null | undefined): string {
  if (lastCrawledAt) {
    return lastCrawledAt.toISOString();
  }

  const fallback = new Date(Date.now() - DEFAULT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
  return fallback.toISOString();
}

function isRunningRecently(status: string, updatedAt: Date): boolean {
  if (status !== "running") {
    return false;
  }

  return Date.now() - updatedAt.getTime() < RUNNING_STALE_MS;
}

export async function triggerWeeklyCrawl(): Promise<WeeklyCrawlResult> {
  const jobs: WeeklyCrawlJob[] = [];
  const skipped: WeeklyCrawlSkipped[] = [];
  const failed: WeeklyCrawlFailed[] = [];

  for (const source of WEEKLY_CRAWL_SOURCES) {
    try {
      const sourceState = await prisma.crawlSource.upsert({
        where: { source },
        update: {},
        create: {
          source,
          lastStatus: "idle",
        },
      });

      if (isRunningRecently(sourceState.lastStatus, sourceState.updatedAt)) {
        skipped.push({
          source,
          reason: "Skipped because a recent crawl job is still running",
        });
        continue;
      }

      const modifiedSince = getModifiedSince(sourceState.lastCrawledAt);

      const { jobId } = await startCloudflareCrawl({
        url: source,
        limit: 15,
        depth: 2,
        formats: ["markdown"],
        render: true,
        modifiedSince,
        incremental: {
          modifiedSince,
        },
      });

      await prisma.crawlSource.update({
        where: { source },
        data: {
          lastJobId: jobId,
          lastStatus: "running",
          lastError: null,
        },
      });

      jobs.push({ source, jobId, modifiedSince });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start crawl";

      await prisma.crawlSource.upsert({
        where: { source },
        update: {
          lastStatus: "failed",
          lastError: message,
        },
        create: {
          source,
          lastStatus: "failed",
          lastError: message,
        },
      });

      failed.push({ source, error: message });
    }
  }

  return {
    jobs,
    skipped,
    failed,
    startedAt: new Date().toISOString(),
  };
}
