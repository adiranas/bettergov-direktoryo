import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import {
  CURATION_STATUSES,
  SECTORS,
  type CivicTechProject,
  type CivilSocietyOrg,
  type DirectoryEntry,
} from "@/types/directory";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Reads typed fields from one YAML document. Any bad field throws, which fails
 * the build, so a malformed entry can never reach the published site.
 */
function createReader(file: string, data: Record<string, unknown>) {
  const fail = (key: string, expected: string): never => {
    throw new Error(`${file}: "${key}" must be ${expected}`);
  };

  const isBlank = (value: unknown) =>
    value === undefined || value === null || value === "";

  const optionalText = (key: string): string | undefined => {
    const value = data[key];
    if (isBlank(value)) return undefined;
    if (typeof value !== "string") return fail(key, "text (quote numbers)");
    return value.trim();
  };

  const text = (key: string): string =>
    optionalText(key) ?? fail(key, "non-empty text");

  const list = (key: string): string[] => {
    const value = data[key];
    if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
      return fail(key, "a list of text values");
    }
    return value;
  };

  const oneOf = <T extends string>(key: string, allowed: readonly T[]): T => {
    const value = data[key];
    if (!allowed.includes(value as T)) {
      return fail(key, `one of: ${allowed.join(", ")}`);
    }
    return value as T;
  };

  /** Restricted to http(s) because these values are rendered as link hrefs. */
  const optionalUrl = (key: string): string | undefined => {
    const value = optionalText(key);
    if (value === undefined) return undefined;
    try {
      const { protocol } = new URL(value);
      if (protocol === "http:" || protocol === "https:") return value;
    } catch {
      // Falls through to the shared failure below.
    }
    return fail(key, "an http(s) URL");
  };

  const slug = (expected: string): string => {
    const value = text("slug");
    if (!SLUG_PATTERN.test(value) || value !== expected) {
      return fail("slug", `kebab-case and equal to the filename ("${expected}")`);
    }
    return value;
  };

  return { fail, text, optionalText, list, oneOf, optionalUrl, slug };
}

type Reader = ReturnType<typeof createReader>;

function toProject(read: Reader, expectedSlug: string): CivicTechProject {
  const repoUrl = read.optionalUrl("repoUrl");
  const liveUrl = read.optionalUrl("liveUrl");
  if (!repoUrl && !liveUrl) read.fail("repoUrl", "set, or liveUrl must be set");

  return {
    slug: read.slug(expectedSlug),
    name: read.text("name"),
    tagLine: read.text("tagLine"),
    description: read.text("description"),
    sector: read.oneOf("sector", SECTORS),
    tags: read.list("tags"),
    repoUrl,
    liveUrl,
    techStack: read.list("techStack"),
    license: read.text("license"),
    maintainer: read.text("maintainer"),
    status: read.oneOf("status", CURATION_STATUSES),
  };
}

function toCso(read: Reader, expectedSlug: string): CivilSocietyOrg {
  const status = read.oneOf("status", CURATION_STATUSES);
  const secOrGovRegNumber = read.optionalText("secOrGovRegNumber");
  if (status === "verified" && !secOrGovRegNumber) {
    read.fail("secOrGovRegNumber", "set when status is verified");
  }

  const contactEmail = read.optionalText("contactEmail");
  if (contactEmail && !EMAIL_PATTERN.test(contactEmail)) {
    read.fail("contactEmail", "a valid email address");
  }

  const websiteUrl = read.optionalUrl("websiteUrl");
  if (!websiteUrl) return read.fail("websiteUrl", "an http(s) URL");

  return {
    slug: read.slug(expectedSlug),
    name: read.text("name"),
    sector: read.oneOf("sector", SECTORS),
    focusAreas: read.list("focusAreas"),
    secOrGovRegNumber,
    websiteUrl,
    contactEmail,
    regionHeadquarters: read.text("regionHeadquarters"),
    status,
  };
}

function loadCollection<T>(
  directory: string,
  build: (read: Reader, expectedSlug: string) => T,
): T[] {
  const root = path.join(CONTENT_ROOT, directory);

  return readdirSync(root)
    .filter((name) => name.endsWith(".yml"))
    .map((name) => {
      const file = path.join("content", directory, name);
      const data: unknown = parse(readFileSync(path.join(root, name), "utf8"));
      if (typeof data !== "object" || data === null || Array.isArray(data)) {
        throw new Error(`${file}: expected a YAML mapping`);
      }
      return build(
        createReader(file, data as Record<string, unknown>),
        name.replace(/\.yml$/, ""),
      );
    });
}

export function loadDirectory(): DirectoryEntry[] {
  const projects = loadCollection("projects", toProject).map(
    (project): DirectoryEntry => ({ kind: "project", ...project }),
  );
  const csos = loadCollection("csos", toCso).map(
    (cso): DirectoryEntry => ({ kind: "cso", ...cso }),
  );

  return [...projects, ...csos].sort((a, b) => a.name.localeCompare(b.name));
}
