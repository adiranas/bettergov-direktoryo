import { Button } from "@bettergov/kapwa/button";
import type { ReactNode } from "react";
import { SECTORS, type EntryKind, type Sector } from "@/types/directory";

const KIND_OPTIONS: { value: EntryKind | null; label: string }[] = [
  { value: null, label: "All types" },
  { value: "project", label: "Civic tech" },
  { value: "cso", label: "CSOs" },
];

const PRESSED_CLASS =
  "border-[var(--color-kapwa-border-brand)] bg-[var(--color-kapwa-bg-brand-weak)] text-[var(--color-kapwa-text-brand)] hover:bg-[var(--color-kapwa-bg-brand-weak)] active:bg-[var(--color-kapwa-bg-brand-weak)]";

/** Pills on phones; a BetterGov-style category list from the md breakpoint up. */
const SECTOR_ROW_CLASS =
  "md:h-8 md:w-full md:justify-between md:rounded-md md:border-transparent md:px-3 md:text-left md:text-sm md:shadow-none";

function FilterPill({
  pressed,
  onClick,
  className = "",
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      aria-pressed={pressed}
      onClick={onClick}
      className={`h-7 rounded-full px-2.5 text-xs duration-150 ${pressed ? PRESSED_CLASS : ""} ${className}`}
    >
      {children}
    </Button>
  );
}

function Count({ value }: { value: number }) {
  return (
    <span
      className={`ml-2 font-mono text-xs tabular-nums ${
        value === 0
          ? "text-[var(--color-kapwa-text-on-disabled)]"
          : "text-[var(--color-kapwa-text-support)]"
      }`}
    >
      <span className="sr-only">, </span>
      {value}
      <span className="sr-only">{value === 1 ? " listing" : " listings"}</span>
    </span>
  );
}

export function SectorFilter({
  sector,
  onSectorChange,
  counts,
  total,
}: {
  sector: Sector | null;
  onSectorChange: (sector: Sector | null) => void;
  counts: Map<Sector, number>;
  total: number;
}) {
  return (
    <div
      role="group"
      aria-labelledby="sector-filter-heading"
      className="md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto md:rounded-lg md:border md:border-[var(--color-kapwa-border-weak)] md:bg-[var(--color-kapwa-bg-surface)] md:p-4"
    >
      <h2 id="sector-filter-heading" className="kapwa-label-md mb-2 md:mb-3">
        Sectors
      </h2>
      <div className="flex flex-wrap gap-1.5 md:flex-col md:gap-0.5">
        <FilterPill
          pressed={sector === null}
          onClick={() => onSectorChange(null)}
          className={SECTOR_ROW_CLASS}
        >
          All sectors
          <Count value={total} />
        </FilterPill>
        {SECTORS.map((option) => (
          <FilterPill
            key={option}
            pressed={sector === option}
            onClick={() => onSectorChange(option)}
            className={SECTOR_ROW_CLASS}
          >
            {option}
            <Count value={counts.get(option) ?? 0} />
          </FilterPill>
        ))}
      </div>
    </div>
  );
}

export function TypeFilter({
  kind,
  onKindChange,
}: {
  kind: EntryKind | null;
  onKindChange: (kind: EntryKind | null) => void;
}) {
  return (
    <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-1.5">
      {KIND_OPTIONS.map((option) => (
        <FilterPill
          key={option.label}
          pressed={kind === option.value}
          onClick={() => onKindChange(option.value)}
        >
          {option.label}
        </FilterPill>
      ))}
    </div>
  );
}
