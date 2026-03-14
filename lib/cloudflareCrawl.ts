const CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4";

export type CrawlFormat = "markdown" | "html" | "screenshot";

export interface CrawlStartBody {
  url: string;
  limit?: number;
  depth?: number;
  formats?: CrawlFormat[];
  render?: boolean;
  modifiedSince?: string;
  incremental?: Record<string, unknown>;
}

export interface CrawlStartResult {
  jobId: string;
  raw: unknown;
}

export interface CrawlPage {
  url: string;
  markdown: string;
}

export interface CrawlStatusResult {
  done: boolean;
  status?: string;
  pages: CrawlPage[];
  raw: unknown;
}

interface CloudflareEnvelope<T = unknown> {
  success: boolean;
  errors?: Array<{ code?: number; message?: string }>;
  messages?: Array<{ code?: number; message?: string }>;
  result?: T;
}

interface CloudflareStartResult {
  job_id?: string;
  id?: string;
  [key: string]: unknown;
}

interface CloudflareStatusResult {
  done?: boolean;
  status?: string;
  pages?: Array<Record<string, unknown>>;
  result?: {
    pages?: Array<Record<string, unknown>>;
  };
  [key: string]: unknown;
}

function getConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error(
      "Missing Cloudflare configuration. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN."
    );
  }

  return { accountId, apiToken };
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const maybeEnvelope = payload as CloudflareEnvelope;
  const firstError = maybeEnvelope.errors?.[0]?.message;
  return firstError || fallback;
}

function extractPages(payload: CloudflareStatusResult | undefined): CrawlPage[] {
  const pagesCandidate = payload?.pages ?? payload?.result?.pages ?? [];

  if (!Array.isArray(pagesCandidate)) {
    return [];
  }

  return pagesCandidate
    .map((page): CrawlPage | null => {
      const url = typeof page.url === "string" ? page.url : "";
      const markdown =
        typeof page.markdown === "string"
          ? page.markdown
          : typeof page.content_markdown === "string"
          ? page.content_markdown
          : "";

      if (!url || !markdown) {
        return null;
      }

      return { url, markdown };
    })
    .filter((page): page is CrawlPage => page !== null);
}

export async function startCloudflareCrawl(
  body: CrawlStartBody
): Promise<CrawlStartResult> {
  const { accountId, apiToken } = getConfig();

  const response = await fetch(
    `${CLOUDFLARE_API_BASE}/accounts/${accountId}/browser-rendering/crawl`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  const payload = (await response.json()) as CloudflareEnvelope<CloudflareStartResult>;

  if (!response.ok || !payload.success) {
    throw new Error(getErrorMessage(payload, "Failed to start crawl job"));
  }

  const jobId = payload.result?.job_id || payload.result?.id;
  if (!jobId) {
    throw new Error("Cloudflare response did not include a job ID");
  }

  return { jobId, raw: payload.result };
}

export async function getCloudflareCrawlStatus(
  jobId: string
): Promise<CrawlStatusResult> {
  const { accountId, apiToken } = getConfig();

  const response = await fetch(
    `${CLOUDFLARE_API_BASE}/accounts/${accountId}/browser-rendering/crawl/${jobId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      cache: "no-store",
    }
  );

  const payload = (await response.json()) as CloudflareEnvelope<CloudflareStatusResult>;

  if (!response.ok || !payload.success) {
    throw new Error(getErrorMessage(payload, "Failed to fetch crawl status"));
  }

  const done =
    payload.result?.done === true ||
    payload.result?.status === "completed" ||
    payload.result?.status === "done";

  return {
    done,
    status: payload.result?.status,
    pages: extractPages(payload.result),
    raw: payload.result,
  };
}
