import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DirectoryEntry } from "@/types/directory";
import { useDirectorySearch } from "./useDirectorySearch";

const entries: DirectoryEntry[] = [
  {
    kind: "project",
    slug: "flood-watch",
    name: "Flood Watch",
    tagLine: "Live flood alerts",
    description: "Tracks flooding across the country.",
    sector: "Disaster & Recovery",
    affiliation: "independent",
    tags: ["flood"],
    liveUrl: "https://example.org",
    techStack: ["TypeScript"],
    license: "MIT",
    maintainer: "Example Maintainer",
    status: "active",
  },
  {
    kind: "cso",
    slug: "relief-org",
    name: "Relief Org",
    sector: "Social & Welfare",
    affiliation: "independent",
    focusAreas: ["relief"],
    registrationRef: "SEC Reg. No. TEST-1",
    websiteUrl: "https://example.org/relief",
    regionHeadquarters: "Manila",
    status: "verified",
  },
];

describe("useDirectorySearch", () => {
  it("returns every entry when no filters are set", () => {
    const { result } = renderHook(() => useDirectorySearch(entries));
    expect(result.current.results).toHaveLength(2);
  });

  it("reset clears the query, sector and kind filters", () => {
    const { result } = renderHook(() => useDirectorySearch(entries));

    act(() => {
      result.current.setQuery("flood");
      result.current.setSector("Disaster & Recovery");
      result.current.setKind("project");
    });
    expect(result.current.query).toBe("flood");
    expect(result.current.sector).toBe("Disaster & Recovery");
    expect(result.current.kind).toBe("project");
    expect(result.current.results.map((e) => e.slug)).toEqual(["flood-watch"]);

    act(() => result.current.reset());

    expect(result.current.query).toBe("");
    expect(result.current.sector).toBeNull();
    expect(result.current.kind).toBeNull();
    expect(result.current.results).toHaveLength(2);
  });
});
