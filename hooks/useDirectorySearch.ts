"use client";

import Fuse, { type IFuseOptions } from "fuse.js";
import { useDeferredValue, useMemo, useState } from "react";
import type { DirectoryEntry, EntryKind, Sector } from "@/types/directory";

const FUSE_OPTIONS: IFuseOptions<DirectoryEntry> = {
  threshold: 0.35,
  // Matches can sit anywhere in a long description.
  ignoreLocation: true,
  keys: [
    { name: "name", weight: 3 },
    { name: "tagLine", weight: 2 },
    { name: "tags", weight: 2 },
    { name: "focusAreas", weight: 2 },
    { name: "sector", weight: 1 },
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

  const results = useMemo(() => {
    const trimmed = deferredQuery.trim();
    const matches = trimmed
      ? fuse.search(trimmed).map((result) => result.item)
      : entries;

    return matches.filter(
      (entry) =>
        (sector === null || entry.sector === sector) &&
        (kind === null || entry.kind === kind),
    );
  }, [deferredQuery, entries, fuse, kind, sector]);

  const reset = () => {
    setQuery("");
    setSector(null);
    setKind(null);
  };

  return { query, setQuery, sector, setSector, kind, setKind, results, reset };
}
