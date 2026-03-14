import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export type CrawlAuthResult =
  | { ok: true; via: "cron" | "admin" }
  | { ok: false; status: number; error: string };

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

export async function authorizeCrawlAccess(
  request: NextRequest
): Promise<CrawlAuthResult> {
  const cronSecret = process.env.CRAWL_CRON_SECRET;
  const providedCronSecret = request.headers.get("x-cron-secret");

  if (cronSecret && providedCronSecret && providedCronSecret === cronSecret) {
    return { ok: true, via: "cron" };
  }

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email ? normalizeEmail(session.user.email) : "";

  if (!userEmail) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  const adminEmails = getAdminEmails();
  if (!adminEmails.size || !adminEmails.has(userEmail)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true, via: "admin" };
}
