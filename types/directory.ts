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
 * - `verified`: formally confirmed by the maintainer or a government registry (SEC/DILG/DSWD).
 * - `active`: community-submitted, link or repo checked, still active.
 * - `archived`: read-only, historical civic project.
 */
export type CurationStatus = (typeof CURATION_STATUSES)[number];

export interface CivicTechProject {
  /** Must match the YAML filename. */
  slug: string;
  name: string;
  tagLine: string;
  description: string;
  sector: Sector;
  tags: string[];
  /** At least one of `repoUrl` and `liveUrl` is required: not every dataset has a repo. */
  repoUrl?: string;
  liveUrl?: string;
  techStack: string[];
  /** SPDX identifier such as `MIT`, or `Unspecified`. */
  license: string;
  maintainer: string;
  status: CurationStatus;
}

export interface CivilSocietyOrg {
  /** Must match the YAML filename. */
  slug: string;
  name: string;
  sector: Sector;
  focusAreas: string[];
  /** Required when `status` is `verified`. */
  secOrGovRegNumber?: string;
  websiteUrl: string;
  /** Publicly listed organizational address only, never a personal one. */
  contactEmail?: string;
  regionHeadquarters: string;
  status: CurationStatus;
}

export type DirectoryEntry =
  | ({ kind: "project" } & CivicTechProject)
  | ({ kind: "cso" } & CivilSocietyOrg);

export type EntryKind = DirectoryEntry["kind"];
