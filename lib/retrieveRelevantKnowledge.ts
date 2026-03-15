import prisma from "@/prisma/prismaClient";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "my",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "what",
  "when",
  "why",
  "with",
]);

const MAX_KEYWORDS = 8;
const MAX_CANDIDATES = 80;
const MAX_MATCHES = 5;
const MAX_SNIPPET_CHARS = 400;
const MAX_RETRIEVED_CHARS = 1800;
const KNOWLEDGE_STALE_DAYS = 30;

function tokenize(query: string): string[] {
  const unique = new Set(
    query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .map((word) => word.trim())
      .filter((word) => word.length >= 3 && !STOP_WORDS.has(word))
  );

  return Array.from(unique).slice(0, MAX_KEYWORDS);
}

function domainLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host;
  } catch {
    return "trusted source";
  }
}

function extractSnippet(content: string, keywords: string[]): string {
  if (!content) {
    return "";
  }

  const lower = content.toLowerCase();
  const firstMatch = keywords
    .map((keyword) => lower.indexOf(keyword))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  const start = typeof firstMatch === "number" ? Math.max(0, firstMatch - 120) : 0;
  const rawSnippet = content.slice(start, start + MAX_SNIPPET_CHARS);
  return rawSnippet.replace(/\s+/g, " ").trim();
}

function scoreContent(content: string, keywords: string[]): number {
  const lower = content.toLowerCase();
  return keywords.reduce((acc, keyword) => (lower.includes(keyword) ? acc + 1 : acc), 0);
}

function trimRetrievedText(text: string): string {
  if (text.length <= MAX_RETRIEVED_CHARS) {
    return text;
  }

  return `${text.slice(0, MAX_RETRIEVED_CHARS)}\n\n[Knowledge context truncated for token safety]`;
}

export async function retrieveRelevantKnowledge(query: string): Promise<string> {
  const keywords = tokenize(query);
  if (keywords.length === 0) {
    return "";
  }

  // Broadly filter with OR on keywords, then apply lightweight scoring in memory.
  const candidates = await prisma.knowledgeArticle.findMany({
    where: {
      OR: keywords.map((keyword) => ({
        content: {
          contains: keyword,
          mode: "insensitive",
        },
      })),
      status: "success",
    },
    orderBy: {
      crawledAt: "desc",
    },
    take: MAX_CANDIDATES,
    select: {
      url: true,
      content: true,
      crawledAt: true,
    },
  });

  const ranked = candidates
    .map((entry) => ({
      ...entry,
      matchCount: scoreContent(entry.content, keywords),
    }))
    .filter((entry) => entry.matchCount > 0)
    .sort((a, b) => {
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }

      return b.crawledAt.getTime() - a.crawledAt.getTime();
    })
    .slice(0, MAX_MATCHES);

  if (ranked.length === 0) {
    return "";
  }

  const now = Date.now();
  const staleThreshold = KNOWLEDGE_STALE_DAYS * 24 * 60 * 60 * 1000;

  const sections = ranked.map((entry, index) => {
    const ageMs = now - entry.crawledAt.getTime();
    const staleTag = ageMs > staleThreshold ? " (may be older than 30 days)" : "";
    const snippet = extractSnippet(entry.content, keywords);

    return `${index + 1}. From ${domainLabel(entry.url)}${staleTag}\nSource: ${entry.url}\nExcerpt: ${snippet}`;
  });

  return trimRetrievedText(sections.join("\n\n"));
}
