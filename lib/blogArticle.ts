export interface BlogArticleView {
  id: string;
  url: string;
  source: string;
  crawledAt: Date;
  content: string;
}

export function getArticleTitle(content: string, url: string): string {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch?.[1]?.trim()) {
    return headingMatch[1].trim();
  }

  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function getArticlePreview(content: string, maxChars = 200): string {
  const text = content
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxChars) {
    return text;
  }

  return `${text.slice(0, maxChars).trimEnd()}...`;
}

export function getArticleSlug(article: Pick<BlogArticleView, "id" | "url" | "content">): string {
  const baseTitle = getArticleTitle(article.content, article.url)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const safeBase = baseTitle || "sleep-article";
  return `${safeBase}--${article.id}`;
}

export function parseIdFromSlug(slug: string): string | null {
  const marker = "--";
  const index = slug.lastIndexOf(marker);
  if (index === -1) {
    return null;
  }

  const id = slug.slice(index + marker.length).trim();
  return id || null;
}

export function sourceLabel(source: string): string {
  const lower = source.toLowerCase();

  if (lower.includes("sleepfoundation")) {
    return "SleepFoundation";
  }

  if (lower.includes("mayo")) {
    return "Mayo Clinic";
  }

  if (lower.includes("cdc.gov")) {
    return "CDC";
  }

  return source;
}
