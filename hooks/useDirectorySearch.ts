"use client";

import Fuse, { type IFuseOptions } from "fuse.js";
import { useDeferredValue, useMemo, useState } from "react";
import {
  isInSector,
  type DirectoryEntry,
  type EntryKind,
  type Sector,
} from "@/types/directory";

const FUSE_OPTIONS: IFuseOptions<DirectoryEntry> = {
  // Allows about one typo per six letters, so "typhon" finds "typhoon" but
  // "rice" no longer matches "services" and "flood" no longer matches "blood".
  threshold: 0.18,
  // Matches can sit anywhere in a long description.
  ignoreLocation: true,
  keys: [
    { name: "name", weight: 3 },
    { name: "tagLine", weight: 2 },
    { name: "tags", weight: 2 },
    { name: "focusAreas", weight: 2 },
    { name: "sector", weight: 1 },
    { name: "secondarySectors", weight: 1 },
    { name: "affiliation", weight: 1 },
    { name: "description", weight: 1 },
    { name: "techStack", weight: 1 },
    { name: "maintainer", weight: 1 },
    { name: "regionHeadquarters", weight: 1 },
  ],
};

export function useDirectorySearch(entries: DirectoryEntry[]) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<Sector | null>(null);
  const [kind, setKind] = useState<EntryKind | null>(null);

  const deferredQuery = useDeferredValue(query);
  const fuse = useMemo(() => new Fuse(entries, FUSE_OPTIONS), [entries]);

  // Everything except the sector filter, so each sector can show how many
  // listings it would return if chosen.
  const matches = useMemo(() => {
    const trimmed = deferredQuery.trim();
    const found = trimmed
      ? fuse.search(trimmed).map((result) => result.item)
      : entries;
    return found.filter((entry) => kind === null || entry.kind === kind);
  }, [deferredQuery, entries, fuse, kind]);

  // A cross-listed Listing counts under each of its sectors, so these counts can
  // add up to more than the total. The total itself counts every Listing once.
  const sectorCounts = useMemo(() => {
    const counts = new Map<Sector, number>();
    for (const entry of matches) {
      for (const filed of [entry.sector, ...(entry.secondarySectors ?? [])]) {
        counts.set(filed, (counts.get(filed) ?? 0) + 1);
      }
    }
    return counts;
  }, [matches]);

  const results = useMemo(
    () =>
      sector === null
        ? matches
        : matches.filter((entry) => isInSector(entry, sector)),
    [matches, sector],
  );

  const reset = () => {
    setQuery("");
    setSector(null);
    setKind(null);
  };

  return {
    query,
    setQuery,
    sector,
    setSector,
    kind,
    setKind,
    results,
    matchCount: matches.length,
    sectorCounts,
    reset,
  };
}
