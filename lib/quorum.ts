import type { Affiliation } from "../types/directory.ts";

/** Affiliations whose Submissions need a second Moderator, because the host or government is the one being reviewed. */
const TWO_APPROVAL_AFFILIATIONS: readonly Affiliation[] = ["bettergov", "government"];

export interface Review {
  user: string;
  state: string;
}

/**
 * How many Moderator approvals a pull request needs. One for an independent or
 * international Listing, or for a removal. Two if it adds or changes a Listing
 * run by BetterGov or by government.
 */
export function requiredApprovals(changedAffiliations: Affiliation[]): number {
  return changedAffiliations.some((affiliation) =>
    TWO_APPROVAL_AFFILIATIONS.includes(affiliation),
  )
    ? 2
    : 1;
}

/**
 * The Moderators whose latest review is an approval. Only people on the public
 * Moderator list count, and an author never approves their own pull request.
 * Reviews must be in the order GitHub returns them, oldest first.
 */
export function moderatorApprovers(
  reviews: Review[],
  moderatorHandles: string[],
  author: string,
): string[] {
  const moderators = new Set(moderatorHandles.map((handle) => handle.toLowerCase()));
  const latest = new Map<string, string>();

  for (const review of reviews) {
    // A bare comment must not undo an earlier approval.
    if (review.state === "COMMENTED") continue;
    latest.set(review.user.toLowerCase(), review.state);
  }

  return [...latest]
    .filter(
      ([user, state]) =>
        state === "APPROVED" &&
        moderators.has(user) &&
        user !== author.toLowerCase(),
    )
    .map(([user]) => user);
}
