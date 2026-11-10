"use client";

import { Button } from "@bettergov/kapwa/button";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { DirectoryCard } from "@/components/DirectoryCard";
import { SectorFilter, TypeFilter } from "@/components/DirectoryFilters";
import { DirectoryHero } from "@/components/DirectoryHero";
import { useDirectorySearch } from "@/hooks/useDirectorySearch";
import { SUBMIT_CSO_URL, SUBMIT_PROJECT_URL } from "@/lib/site";
import type { DirectoryEntry } from "@/types/directory";

export function DirectoryExplorer({ entries }: { entries: DirectoryEntry[] }) {
  const {
    query,
    setQuery,
    sector,
    setSector,
    kind,
    setKind,
    results,
    matchCount,
    sectorCounts,
    reset,
  } = useDirectorySearch(entries);

  const stats = useMemo(
    () => ({
      projects: entries.filter((entry) => entry.kind === "project").length,
      organizations: entries.filter((entry) => entry.kind === "cso").length,
      sectors: new Set(entries.map((entry) => entry.sector)).size,
    }),
    [entries],
  );

  // A sector with nothing in it yet is an invitation to contribute, not an error.
  const sectorIsEmpty = sector !== null && query.trim() === "" && kind === null;

  return (
    <>
      <DirectoryHero query={query} onQueryChange={setQuery} stats={stats} />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start md:gap-8 md:py-10">
        <aside className="md:w-72 md:shrink-0 md:self-stretch">
          <SectorFilter
            sector={sector}
            onSectorChange={setSector}
            counts={sectorCounts}
            total={matchCount}
          />
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p
              role="status"
              className="font-mono text-xs tabular-nums text-[var(--color-kapwa-text-support)]"
            >
              Showing {results.length} of {entries.length}{" "}
              {entries.length === 1 ? "entry" : "entries"}
            </p>
            <TypeFilter kind={kind} onKindChange={setKind} />
          </div>

          {results.length > 0 ? (
            <ul
              key={`${sector}:${kind}`}
              className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2"
            >
              {results.map((entry) => (
                <li key={`${entry.kind}:${entry.slug}`}>
                  <DirectoryCard entry={entry} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="reveal space-y-3 rounded-lg border border-[var(--color-kapwa-border-weak)] bg-[var(--color-kapwa-bg-surface)] p-8 text-center">
              <p className="kapwa-body-md-strong">
                {sectorIsEmpty
                  ? `Nothing listed under ${sector} yet.`
                  : "No listings match that search yet."}
              </p>
              <p className="kapwa-body-sm-default mx-auto max-w-md text-[var(--color-kapwa-text-support)]">
                {sectorIsEmpty
                  ? "Know an active, public-benefit project or organization in this sector? Suggest it and a moderator will review it."
                  : "Try a broader term or another sector."}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm" onClick={reset}>
                  Clear search and filters
                </Button>
                {sectorIsEmpty && (
                  <>
                    <a
                      href={SUBMIT_PROJECT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[var(--color-kapwa-bg-brand-default)] px-3 text-sm font-medium text-[var(--color-kapwa-text-inverse)] shadow-xs transition-colors hover:bg-[var(--color-kapwa-bg-brand-hover)]"
                    >
                      <Plus className="size-4" />
                      Submit a project
                      <span className="sr-only">(opens GitHub in a new tab)</span>
                    </a>
                    <a
                      href={SUBMIT_CSO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--color-kapwa-border-weak)] bg-[var(--color-kapwa-bg-surface)] px-3 text-sm font-medium text-[var(--color-kapwa-text-default)] shadow-xs transition-colors hover:bg-[var(--color-kapwa-bg-brand-weak)] hover:text-[var(--color-kapwa-text-brand)]"
                    >
                      <Plus className="size-4" />
                      Submit an organization
                      <span className="sr-only">(opens GitHub in a new tab)</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
