import { Button } from "@bettergov/kapwa/button";
import { Input } from "@bettergov/kapwa/input";
import { Label } from "@bettergov/kapwa/label";
import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { SECTORS, type EntryKind, type Sector } from "@/types/directory";

const KIND_OPTIONS: { value: EntryKind | null; label: string }[] = [
  { value: null, label: "All types" },
  { value: "project", label: "Civic tech" },
  { value: "cso", label: "CSOs" },
];

function FilterPill({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={pressed ? "primary" : "outline"}
      aria-pressed={pressed}
      onClick={onClick}
      className="h-7 rounded-full px-2.5 text-xs"
    >
      {children}
    </Button>
  );
}

interface DirectoryFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  sector: Sector | null;
  onSectorChange: (sector: Sector | null) => void;
  kind: EntryKind | null;
  onKindChange: (kind: EntryKind | null) => void;
}

export function DirectoryFilters({
  query,
  onQueryChange,
  sector,
  onSectorChange,
  kind,
  onKindChange,
}: DirectoryFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Label htmlFor="directory-search" className="sr-only">
            Search projects and organizations
          </Label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-kapwa-text-support)]" />
          {/* Kapwa's default placeholder color is too faint for WCAG AA. */}
          <Input
            id="directory-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search name, tag or focus area"
            className="pl-9 placeholder:text-[var(--color-kapwa-text-support)]"
          />
        </div>

        <fieldset className="flex flex-wrap gap-1.5">
          <legend className="sr-only">Filter by type</legend>
          {KIND_OPTIONS.map((option) => (
            <FilterPill
              key={option.label}
              pressed={kind === option.value}
              onClick={() => onKindChange(option.value)}
            >
              {option.label}
            </FilterPill>
          ))}
        </fieldset>
      </div>

      <fieldset className="flex flex-wrap gap-1.5">
        <legend className="sr-only">Filter by sector</legend>
        <FilterPill pressed={sector === null} onClick={() => onSectorChange(null)}>
          All sectors
        </FilterPill>
        {SECTORS.map((option) => (
          <FilterPill
            key={option}
            pressed={sector === option}
            onClick={() => onSectorChange(option)}
          >
            {option}
          </FilterPill>
        ))}
      </fieldset>
    </div>
  );
}
