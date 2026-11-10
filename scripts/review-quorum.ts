/**
 * Fails a pull request that adds or changes a Listing until enough named
 * Moderators have approved it. Not wired into any automation yet: it is meant
 * to run as a pull request check.
 *
 * Needs: GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER, PR_AUTHOR.
 * It cannot check that one approver is unaffiliated with the Project. The
 * checklist asks the Moderators to do that by hand.
 */
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { moderatorApprovers, requiredApprovals, type Review } from "../lib/quorum.ts";
import { AFFILIATIONS, type Affiliation } from "../types/directory.ts";

const { GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER, PR_AUTHOR } = process.env;
if (!GITHUB_TOKEN || !GITHUB_REPOSITORY || !PR_NUMBER || !PR_AUTHOR) {
  console.error("Set GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER and PR_AUTHOR.");
  process.exit(2);
}

const api = `https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${PR_NUMBER}`;

async function getAll<T>(url: string): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; ; page++) {
    const response = await fetch(`${url}?per_page=100&page=${page}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!response.ok) {
      throw new Error(`${url} returned ${response.status} ${response.statusText}`);
    }
    const batch = (await response.json()) as T[];
    items.push(...batch);
    if (batch.length < 100) return items;
  }
}

const files = await getAll<{ filename: string; status: string }>(`${api}/files`);
const listingFiles = files.filter((file) =>
  /^content\/(projects|csos)\/[^/]+\.yml$/.test(file.filename),
);

if (listingFiles.length === 0) {
  console.log("No Listings changed, so no Moderator approval is required.");
  process.exit(0);
}

const affiliations: Affiliation[] = [];
for (const file of listingFiles) {
  if (file.status === "removed") continue;
  const data = parse(readFileSync(file.filename, "utf8")) as { affiliation?: unknown };
  if (!AFFILIATIONS.includes(data?.affiliation as Affiliation)) {
    console.error(`${file.filename}: "affiliation" must be one of ${AFFILIATIONS.join(", ")}`);
    process.exit(1);
  }
  affiliations.push(data.affiliation as Affiliation);
}

const moderators = (
  parse(readFileSync("content/moderators.yml", "utf8")) as {
    moderators?: { github: string }[];
  }
).moderators ?? [];

const reviews = (
  await getAll<{ user: { login: string } | null; state: string }>(`${api}/reviews`)
).map((review): Review => ({ user: review.user?.login ?? "", state: review.state }));

const needed = requiredApprovals(affiliations);
const approvers = moderatorApprovers(
  reviews,
  moderators.map((moderator) => moderator.github),
  PR_AUTHOR,
);

console.log(`Listings changed: ${listingFiles.map((file) => file.filename).join(", ")}`);
console.log(`Moderator approvals: ${approvers.length} of ${needed} needed (${approvers.join(", ") || "none"})`);

if (moderators.length === 0) {
  console.error("content/moderators.yml names no Moderators, so nothing can be approved yet.");
}
if (approvers.length < needed) process.exit(1);
