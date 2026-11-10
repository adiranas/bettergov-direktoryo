import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { AFFILIATIONS, type Affiliation } from "@/types/directory";

export interface Moderator {
  name: string;
  github: string;
  affiliation: Affiliation;
}

/** Moderators needed before a BetterGov or government Submission can get its two approvals. */
export const MIN_MODERATORS = 3;

/** Reads the public Moderator list. A malformed entry fails the build. */
export function loadModerators(): Moderator[] {
  const file = "content/moderators.yml";
  const data: unknown = parse(
    readFileSync(path.join(process.cwd(), file), "utf8"),
  );
  const list =
    typeof data === "object" && data !== null
      ? (data as { moderators?: unknown }).moderators
      : undefined;

  if (!Array.isArray(list)) {
    throw new Error(`${file}: "moderators" must be a list`);
  }

  return list.map((item, index) => {
    const entry = (item ?? {}) as Record<string, unknown>;
    const { name, github, affiliation } = entry;
    if (
      typeof name !== "string" ||
      typeof github !== "string" ||
      !AFFILIATIONS.includes(affiliation as Affiliation)
    ) {
      throw new Error(
        `${file}: entry ${index + 1} needs "name", "github" and an "affiliation" of ${AFFILIATIONS.join(", ")}`,
      );
    }
    return { name, github, affiliation: affiliation as Affiliation };
  });
}
