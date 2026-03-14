import { NextRequest, NextResponse } from "next/server";
import { authorizeCrawlAccess } from "@/lib/crawlAuth";
import { startCloudflareCrawl, type CrawlFormat } from "@/lib/cloudflareCrawl";

interface CrawlKnowledgeRequest {
  inputUrl: string;
  limit?: number;
  depth?: number;
  formats?: CrawlFormat[];
  render?: boolean;
  incremental?: Record<string, unknown>;
}

interface CrawlKnowledgeSuccessResponse {
  success: true;
  jobId: string;
  acceptedAt: string;
}

interface CrawlKnowledgeErrorResponse {
  success: false;
  error: string;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<CrawlKnowledgeSuccessResponse | CrawlKnowledgeErrorResponse>> {
  try {
    const auth = await authorizeCrawlAccess(request);
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const body = (await request.json()) as CrawlKnowledgeRequest;
    const inputUrl = body.inputUrl?.trim();

    if (!inputUrl || !isValidHttpUrl(inputUrl)) {
      return NextResponse.json(
        { success: false, error: "A valid http/https inputUrl is required" },
        { status: 400 }
      );
    }

    const crawlPayload = {
      url: inputUrl,
      limit: body.limit ?? 20,
      depth: body.depth ?? 3,
      formats: body.formats ?? (["markdown"] as CrawlFormat[]),
      render: body.render ?? true,
      ...(body.incremental ? { incremental: body.incremental } : {}),
    };

    const { jobId } = await startCloudflareCrawl(crawlPayload);

    return NextResponse.json(
      {
        success: true,
        jobId,
        acceptedAt: new Date().toISOString(),
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("[crawl-knowledge] Failed to start crawl:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while starting crawl",
      },
      { status: 500 }
    );
  }
}
