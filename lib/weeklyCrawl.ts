import prisma from "@/prisma/prismaClient";

export const WEEKLY_CRAWL_SOURCES = [
  "https://www.sleepfoundation.org/",
  "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/sleep/art-20048379",
  "https://www.cdc.gov/sleep/index.html",
] as const;

type KnownSource = (typeof WEEKLY_CRAWL_SOURCES)[number];

/**
 * Specific article URLs to fetch for each root source.
 * Using known, stable article paths so we don't need a crawler.
 */
const PAGES_BY_SOURCE: Record<KnownSource, string[]> = {
  "https://www.sleepfoundation.org/": [
    "https://www.sleepfoundation.org/how-sleep-works",
    "https://www.sleepfoundation.org/sleep-hygiene",
    "https://www.sleepfoundation.org/sleep-deprivation",
    "https://www.sleepfoundation.org/insomnia",
    "https://www.sleepfoundation.org/circadian-rhythm",
  ],
  "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/sleep/art-20048379": [
    "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/sleep/art-20048379",
    "https://www.mayoclinic.org/diseases-conditions/insomnia/symptoms-causes/syc-20355167",
  ],
  "https://www.cdc.gov/sleep/index.html": [
    "https://www.cdc.gov/sleep/index.html",
    "https://www.cdc.gov/sleep/about-sleep/sleep-hygiene.html",
  ],
};

const MAX_CONTENT_CHARS = 25_000;
const FETCH_TIMEOUT_MS = 15_000;
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

function isRunningRecently(status: string, updatedAt: Date): boolean {
  return status === "running" && Date.now() - updatedAt.getTime() < RUNNING_STALE_MS;
}

/**
 * Fetches a URL and strips HTML to extract readable text content.
 */
async function fetchPageText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SleepSyncBot/1.0; educational sleep tracker)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }

  const html = await res.text();

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.slice(0, MAX_CONTENT_CHARS);
}

async function crawlSource(
  source: KnownSource,
  jobs: WeeklyCrawlJob[],
  skipped: WeeklyCrawlSkipped[],
  failed: WeeklyCrawlFailed[]
): Promise<void> {
  const sourceState = await prisma.crawlSource.upsert({
    where: { source },
    update: {},
    create: { source, lastStatus: "idle" },
  });

  if (isRunningRecently(sourceState.lastStatus, sourceState.updatedAt)) {
    skipped.push({ source, reason: "A recent crawl is still in progress" });
    return;
  }

  await prisma.crawlSource.update({
    where: { source },
    data: { lastStatus: "running", lastError: null },
  });

  const pageUrls = PAGES_BY_SOURCE[source] ?? [source];
  const pageErrors: string[] = [];
  let successCount = 0;

  await Promise.allSettled(
    pageUrls.map(async (pageUrl) => {
      try {
        const content = await fetchPageText(pageUrl);
        await prisma.knowledgeArticle.upsert({
          where: { url: pageUrl },
          update: { content, source, status: "success", crawledAt: new Date() },
          create: { url: pageUrl, content, source, status: "success", crawledAt: new Date() },
        });
        successCount++;
      } catch (err) {
        pageErrors.push(`${pageUrl}: ${err instanceof Error ? err.message : String(err)}`);
      }
    })
  );

  const jobId = `direct-${Date.now()}`;
  const finalStatus = successCount > 0 ? "success" : "failed";

  await prisma.crawlSource.update({
    where: { source },
    data: {
      lastStatus: finalStatus,
      lastJobId: jobId,
      lastCrawledAt: successCount > 0 ? new Date() : undefined,
      lastError: pageErrors.length > 0 ? pageErrors.join(" | ") : null,
    },
  });

  if (finalStatus === "success") {
    jobs.push({ source, jobId, modifiedSince: new Date().toISOString() });
  } else {
    failed.push({ source, error: pageErrors.join(" | ") });
  }
}

export async function triggerWeeklyCrawl(): Promise<WeeklyCrawlResult> {
  const jobs: WeeklyCrawlJob[] = [];
  const skipped: WeeklyCrawlSkipped[] = [];
  const failed: WeeklyCrawlFailed[] = [];

  await Promise.allSettled(
    WEEKLY_CRAWL_SOURCES.map((source) =>
      crawlSource(source as KnownSource, jobs, skipped, failed).catch((error) => {
        const message = error instanceof Error ? error.message : "Unexpected error";
        failed.push({ source, error: message });
      })
    )
  );

  return { jobs, skipped, failed, startedAt: new Date().toISOString() };
}
