export const SECTORS = [
  "Disaster & Recovery",
  "Social & Welfare",
  "Government Services",
  "Travel",
  "Health",
  "Education",
  "Business & Economy",
  "Taxes & Finance",
  "Labor & Employment",
  "Law & Justice",
  "Elections & Governance",
  "Transparency & Procurement",
  "Agriculture & Environment",
  "Infrastructure & Transport",
  "Public Safety",
] as const;

export type Sector = (typeof SECTORS)[number];

export const CURATION_STATUSES = ["verified", "active", "archived"] as const;

/**
 * - `verified`: identity and ownership are confirmed (a maintainer's proof of
 *   control, or a matching registry record). Never an endorsement of quality.
 * - `active`: passed review, link and maintainer were live when last checked.
 * - `archived`: read-only, historical civic project.
 */
export type CurationStatus = (typeof CURATION_STATUSES)[number];

/** Who runs a Listing. Shown to readers so the host's own work is never mistaken for a neutral pick. */
export const AFFILIATIONS = [
  "government",
  "bettergov",
  "international",
  "independent",
] as const;

export type Affiliation = (typeof AFFILIATIONS)[number];

export const AFFILIATION_LABELS: Record<Affiliation, string> = {
  government: "Government",
  bettergov: "BetterGov",
  international: "International",
  independent: "Independent",
};

/** The most extra sectors a moderator may add to one Listing. */
export const MAX_SECONDARY_SECTORS = 2;

interface ListingBase {
  /** Must match the YAML filename. */
  slug: string;
  name: string;
  /** The one sector this Listing is filed and counted under. */
  sector: Sector;
  /** Extra sectors where a borderline Listing can also be found. Never change the total count. */
  secondarySectors?: Sector[];
  affiliation: Affiliation;
  status: CurationStatus;
}

export interface CivicTechProject extends ListingBase {
  tagLine: string;
  description: string;
  tags: string[];
  /** At least one of `repoUrl` and `liveUrl` is required: not every dataset has a repo. */
  repoUrl?: string;
  liveUrl?: string;
  techStack: string[];
  /** SPDX identifier such as `MIT`, or `Unspecified`. */
  license: string;
  maintainer: string;
}

export interface CivilSocietyOrg extends ListingBase {
  focusAreas: string[];
  /** The issuing agency with its number or law, e.g. "SEC Reg. No. CN201234567". */
  registrationRef: string;
  websiteUrl: string;
  /** Publicly listed organizational address only, never a personal one. */
  contactEmail?: string;
  regionHeadquarters: string;
}

export type DirectoryEntry =
  | ({ kind: "project" } & CivicTechProject)
  | ({ kind: "cso" } & CivilSocietyOrg);

export type EntryKind = DirectoryEntry["kind"];

/** True when the Listing is filed or cross-listed under `sector`. */
export const isInSector = (entry: DirectoryEntry, sector: Sector): boolean =>
  entry.sector === sector || (entry.secondarySectors?.includes(sector) ?? false);
