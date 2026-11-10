"use client";

import { Button } from "@bettergov/kapwa/button";
import { DirectoryCard } from "@/components/DirectoryCard";
import { DirectoryFilters } from "@/components/DirectoryFilters";
import { useDirectorySearch } from "@/hooks/useDirectorySearch";
import type { DirectoryEntry } from "@/types/directory";

export function DirectoryExplorer({ entries }: { entries: DirectoryEntry[] }) {
  const { query, setQuery, sector, setSector, kind, setKind, results, reset } =
    useDirectorySearch(entries);

  return (
    <div className="space-y-4">
      <DirectoryFilters
        query={query}
        onQueryChange={setQuery}
        sector={sector}
        onSectorChange={setSector}
        kind={kind}
        onKindChange={setKind}
      />

      <p
        role="status"
        className="font-mono text-xs text-[var(--color-kapwa-text-support)]"
      >
        Showing {results.length} of {entries.length}{" "}
        {entries.length === 1 ? "entry" : "entries"}
      </p>

      {results.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((entry) => (
            <li key={`${entry.kind}:${entry.slug}`}>
              <DirectoryCard entry={entry} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-3 rounded-lg border border-[var(--color-kapwa-border-weak)] bg-[var(--color-kapwa-bg-surface)] p-8 text-center">
          <p className="kapwa-body-sm-default text-[var(--color-kapwa-text-support)]">
            Nothing matches those filters yet.
          </p>
          <Button variant="outline" size="sm" onClick={reset}>
            Clear search and filters
          </Button>
        </div>
      )}
    </div>
  );
}
