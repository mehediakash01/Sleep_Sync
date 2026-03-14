import { NextRequest, NextResponse } from "next/server";
import { authorizeCrawlAccess } from "@/lib/crawlAuth";
import { markPollFailure, pollJob } from "@/lib/crawlPoller";

interface PollRequestBody {
  jobId: string;
  source: string;
  intervalMs?: number;
  timeoutMs?: number;
}

interface PollResponse {
  success: boolean;
  completed?: boolean;
  pollCount?: number;
  persistedCount?: number;
  status?: string;
  error?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<PollResponse>> {
  let source = "";
  let jobId = "";

  try {
    const auth = await authorizeCrawlAccess(request);
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const body = (await request.json()) as PollRequestBody;
    jobId = body.jobId?.trim() || "";
    source = body.source?.trim() || "";

    if (!jobId || !source) {
      return NextResponse.json(
        {
          success: false,
          error: "Both jobId and source are required",
        },
        { status: 400 }
      );
    }

    const result = await pollJob(jobId, source, {
      intervalMs: body.intervalMs,
      timeoutMs: body.timeoutMs,
    });

    return NextResponse.json(
      {
        success: true,
        completed: result.completed,
        pollCount: result.pollCount,
        persistedCount: result.persistedCount,
        status: result.status,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to poll crawl job";

    if (source && jobId) {
      await markPollFailure(source, jobId, message);
    }

    console.error("[crawl/poll] Failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
