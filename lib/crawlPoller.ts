import prisma from "@/prisma/prismaClient";
import { getCloudflareCrawlStatus } from "@/lib/cloudflareCrawl";

const DEFAULT_INTERVAL_MS = 30_000;
const DEFAULT_TIMEOUT_MS = 10 * 60_000;
const MAX_CONTENT_CHARS = 120_000;

export interface PollJobOptions {
  intervalMs?: number;
  timeoutMs?: number;
}

export interface PollJobResult {
  source: string;
  jobId: string;
  completed: boolean;
  pollCount: number;
  persistedCount: number;
  status?: string;
}

function clampIntervalMs(value: number | undefined): number {
  if (!value || !Number.isFinite(value)) {
    return DEFAULT_INTERVAL_MS;
  }

  return Math.min(Math.max(value, 30_000), 60_000);
}

function clampTimeoutMs(value: number | undefined): number {
  if (!value || !Number.isFinite(value)) {
    return DEFAULT_TIMEOUT_MS;
  }

  return Math.max(value, 60_000);
}

function truncateContent(content: string): string {
  if (content.length <= MAX_CONTENT_CHARS) {
    return content;
  }

  return `${content.slice(0, MAX_CONTENT_CHARS)}\n\n[truncated]`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function pollJob(
  jobId: string,
  source: string,
  options: PollJobOptions = {}
): Promise<PollJobResult> {
  const intervalMs = clampIntervalMs(options.intervalMs);
  const timeoutMs = clampTimeoutMs(options.timeoutMs);

  let pollCount = 1;
  let status = await getCloudflareCrawlStatus(jobId);
  const startedAt = Date.now();

  while (!status.done && Date.now() - startedAt < timeoutMs) {
    await sleep(intervalMs);
    status = await getCloudflareCrawlStatus(jobId);
    pollCount += 1;
  }

  if (!status.done) {
    return {
      source,
      jobId,
      completed: false,
      pollCount,
      persistedCount: 0,
      status: status.status,
    };
  }

  const operations = status.pages.map((page) =>
    prisma.knowledgeArticle.upsert({
      where: { url: page.url },
      update: {
        content: truncateContent(page.markdown),
        source,
        status: "success",
        crawledAt: new Date(),
      },
      create: {
        url: page.url,
        content: truncateContent(page.markdown),
        source,
        status: "success",
      },
    })
  );

  if (operations.length > 0) {
    await prisma.$transaction(operations);
  }

  await prisma.crawlSource.upsert({
    where: { source },
    update: {
      lastCrawledAt: new Date(),
      lastStatus: "success",
      lastError: null,
      lastJobId: jobId,
    },
    create: {
      source,
      lastCrawledAt: new Date(),
      lastStatus: "success",
      lastError: null,
      lastJobId: jobId,
    },
  });

  return {
    source,
    jobId,
    completed: true,
    pollCount,
    persistedCount: operations.length,
    status: status.status,
  };
}

export async function markPollFailure(
  source: string,
  jobId: string,
  errorMessage: string
): Promise<void> {
  await prisma.crawlSource.upsert({
    where: { source },
    update: {
      lastStatus: "failed",
      lastError: errorMessage,
      lastJobId: jobId,
    },
    create: {
      source,
      lastStatus: "failed",
      lastError: errorMessage,
      lastJobId: jobId,
    },
  });
}
