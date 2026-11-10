import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DirectoryEntry } from "@/types/directory";
import { useDirectorySearch } from "./useDirectorySearch";

const project = (
  slug: string,
  sector: DirectoryEntry["sector"],
  secondarySectors?: DirectoryEntry["sector"][],
): DirectoryEntry => ({
  kind: "project",
  slug,
  name: slug,
  tagLine: "t",
  description: "d",
  sector,
  secondarySectors,
  affiliation: "independent",
  tags: [],
  liveUrl: "https://example.org",
  techStack: [],
  license: "MIT",
  maintainer: "m",
  status: "active",
});

const entries = [
  project("budget", "Taxes & Finance", ["Transparency & Procurement"]),
  project("contracts", "Transparency & Procurement"),
  project("hotline", "Public Safety"),
];

describe("sector cross-listing", () => {
  it("counts a cross-listed Listing under each sector but once in the total", () => {
    const { result } = renderHook(() => useDirectorySearch(entries));

    expect(result.current.matchCount).toBe(3);
    expect(result.current.sectorCounts.get("Taxes & Finance")).toBe(1);
    expect(result.current.sectorCounts.get("Transparency & Procurement")).toBe(2);
  });

  it("shows a cross-listed Listing when its secondary sector is chosen", () => {
    const { result } = renderHook(() => useDirectorySearch(entries));

    act(() => result.current.setSector("Transparency & Procurement"));

    expect(result.current.results.map((entry) => entry.slug).sort()).toEqual([
      "budget",
      "contracts",
    ]);
  });
});
