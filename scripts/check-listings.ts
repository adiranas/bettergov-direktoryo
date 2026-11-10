/**
 * Health check for every Listing. Reports Listings whose link fails or whose
 * repository has gone quiet. It never edits a Listing: a Moderator decides
 * what to do. Run it by hand, for example once a month.
 *
 *   npm run check:listings                         report only
 *   node scripts/check-listings.ts --open-issues   also open one issue per problem Listing (needs the gh CLI and GH_TOKEN)
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const ACTIVITY_LIMIT_MS = 365 * 24 * 60 * 60 * 1000;
const USER_AGENT = "Mozilla/5.0 (compatible; civic-directory-link-check)";
// Sites behind bot protection often answer 403 or 429 to scripts. That says
// nothing about whether a person can open them, so it is not a failure.
const BOT_BLOCKED = new Set([401, 403, 429]);

interface Listing {
  slug: string;
  status: string;
  urls: string[];
  repoUrl?: string;
}

const listings: Listing[] = ["projects", "csos"].flatMap((directory) =>
  readdirSync(path.join("content", directory))
    .filter((name) => name.endsWith(".yml"))
    .map((name) => {
      const data = parse(readFileSync(path.join("content", directory, name), "utf8")) as Record<string, string>;
      const urls = [data.liveUrl, data.repoUrl, data.websiteUrl].filter(Boolean);
      return { slug: data.slug, status: data.status, urls, repoUrl: data.repoUrl };
    }),
);

// A server that omits its intermediate certificate still opens in browsers,
// which fetch it themselves, so this is worth a note but not an issue.
const INCOMPLETE_CHAIN = new Set(["UNABLE_TO_GET_ISSUER_CERT_LOCALLY", "UNABLE_TO_VERIFY_LEAF_SIGNATURE"]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const notes: string[] = [];

async function checkLink(url: string): Promise<string | null> {
  let failure = "";
  // One retry: a single dropped connection should not wake a Moderator.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(25_000),
      });
      if (response.ok || BOT_BLOCKED.has(response.status)) return null;
      // A 404 or 410 won't fix itself, but a 5xx might.
      failure = `${url} answered ${response.status}`;
      if (response.status < 500) return failure;
    } catch (error) {
      const cause = (error as { cause?: { code?: string; message?: string } }).cause;
      const code = cause?.code ?? cause?.message ?? (error as Error).message;
      if (INCOMPLETE_CHAIN.has(code ?? "")) {
        notes.push(`${url} sends an incomplete certificate chain (${code}). Browsers cope, but API clients may not.`);
        return null;
      }
      failure = `${url} could not be reached (${code})`;
    }
    if (attempt === 1) await sleep(3_000);
  }
  return failure;
}

async function checkRepository(listing: Listing): Promise<string | null> {
  const match = listing.repoUrl?.match(/^https:\/\/github\.com\/([^/]+\/[^/#?]+)/);
  if (!match) return null;
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(`https://api.github.com/repos/${match[1]}`, {
    headers,
    signal: AbortSignal.timeout(25_000),
  });
  if (response.status === 404) return `repository ${match[1]} was not found`;
  if (!response.ok) return null;

  const repo = (await response.json()) as { archived: boolean; pushed_at: string };
  // An archived Listing is meant to be old, so only its link must still work.
  if (listing.status === "archived") return null;
  if (repo.archived) return `repository ${match[1]} is archived on GitHub`;
  if (Date.now() - Date.parse(repo.pushed_at) > ACTIVITY_LIMIT_MS) {
    return `repository ${match[1]} has had no commits since ${repo.pushed_at.slice(0, 10)}`;
  }
  return null;
}

const problems = new Map<string, string[]>();
const queue = [...listings];

await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let listing = queue.shift(); listing; listing = queue.shift()) {
      const found = (
        await Promise.all([...listing.urls.map(checkLink), checkRepository(listing)])
      ).filter((message): message is string => message !== null);
      if (found.length > 0) problems.set(listing.slug, found);
    }
  }),
);

console.log(`Checked ${listings.length} Listings, ${problems.size} with problems.`);
for (const note of notes) console.log(`Note: ${note}`);
for (const [slug, found] of problems) {
  console.log(`\n${slug}`);
  for (const message of found) console.log(`  - ${message}`);
}

if (process.argv.includes("--open-issues") && problems.size > 0) {
  const gh = (...args: string[]) => execFileSync("gh", args, { encoding: "utf8" });
  gh("label", "create", "listing-health", "--force", "--color", "FBCA04", "--description", "A health check found a problem with a Listing");

  for (const [slug, found] of problems) {
    const title = `Listing health: ${slug}`;
    const open = JSON.parse(gh("issue", "list", "--state", "open", "--search", `"${title}" in:title`, "--json", "title"));
    if (open.some((issue: { title: string }) => issue.title === title)) continue;

    gh(
      "issue", "create", "--title", title, "--label", "listing-health", "--body",
      [
        `The health check found a problem with \`${slug}\`:`,
        "",
        ...found.map((message) => `- ${message}`),
        "",
        "A Moderator should open the Listing and decide: fix the link, change its status to `archived`, or remove it. See `CURATION_CHECKLIST.md`. This check never changes a Listing itself.",
      ].join("\n"),
    );
    console.log(`Opened an issue for ${slug}.`);
  }
}
