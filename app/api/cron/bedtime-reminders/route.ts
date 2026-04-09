import { NextRequest, NextResponse } from "next/server";
import { authorizeCrawlAccess } from "@/lib/crawlAuth";
import { runBedtimeReminderSweep } from "@/lib/notifications";

async function handleBedtimeReminderCron(request: NextRequest) {
  const auth = await authorizeCrawlAccess(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const result = await runBedtimeReminderSweep();

    return NextResponse.json({
      ok: true,
      via: auth.via,
      checked: result.checked,
      sent: result.sent,
    });
  } catch (error) {
    console.error("[cron][bedtime-reminders] sweep failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to run bedtime reminder sweep",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleBedtimeReminderCron(request);
}

export async function POST(request: NextRequest) {
  return handleBedtimeReminderCron(request);
}
