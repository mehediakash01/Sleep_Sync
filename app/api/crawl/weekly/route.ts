import { NextRequest, NextResponse } from "next/server";
import { authorizeCrawlAccess } from "@/lib/crawlAuth";
import { triggerWeeklyCrawl } from "@/lib/weeklyCrawl";

interface WeeklyCrawlResponse {
  success: boolean;
  startedAt?: string;
  jobs?: Array<{ source: string; jobId: string; modifiedSince: string }>;
  skipped?: Array<{ source: string; reason: string }>;
  failed?: Array<{ source: string; error: string }>;
  error?: string;
}

async function handleWeekly(
  request: NextRequest
): Promise<NextResponse<WeeklyCrawlResponse>> {
  try {
    const auth = await authorizeCrawlAccess(request);
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const result = await triggerWeeklyCrawl();

    return NextResponse.json(
      {
        success: true,
        startedAt: result.startedAt,
        jobs: result.jobs,
        skipped: result.skipped,
        failed: result.failed,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[crawl/weekly] Failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to trigger weekly crawl",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<WeeklyCrawlResponse>> {
  return handleWeekly(request);
}

// Vercel Cron issues GET requests, so support GET as a secure alias.
export async function GET(
  request: NextRequest
): Promise<NextResponse<WeeklyCrawlResponse>> {
  return handleWeekly(request);
}
