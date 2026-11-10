import { Input } from "@bettergov/kapwa/input";
import { Label } from "@bettergov/kapwa/label";
import { Search } from "lucide-react";
import { DirectoryMap } from "@/components/DirectoryMap";

interface DirectoryHeroProps {
  query: string;
  onQueryChange: (query: string) => void;
  stats: { projects: number; organizations: number; sectors: number };
}

function Stat({
  value,
  singular,
  plural,
}: {
  value: number;
  singular: string;
  plural: string;
}) {
  const label = value === 1 ? singular : plural;
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="flex items-baseline gap-1.5">
        <span className="kapwa-heading-sm tabular-nums">{value}</span>
        <span className="kapwa-body-sm-default text-[var(--color-kapwa-brand-100)]">
          {label}
        </span>
      </dd>
    </div>
  );
}

export function DirectoryHero({
  query,
  onQueryChange,
  stats,
}: DirectoryHeroProps) {
  return (
    <section
      aria-labelledby="directory-title"
      className="overflow-hidden text-[var(--color-kapwa-text-inverse)]"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--color-kapwa-brand-700), var(--color-kapwa-brand-900))",
      }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1fr)_14rem] md:py-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="space-y-6">
          <div className="space-y-3">
            <h1
              id="directory-title"
              className="kapwa-heading-md md:kapwa-heading-xl text-balance"
            >
              Philippine Civic Tech &amp; CSO Directory
            </h1>
            <p className="kapwa-body-md-default md:kapwa-body-lg-default max-w-xl text-pretty text-[var(--color-kapwa-brand-100)]">
              Open tools, public datasets and civil society organizations
              serving Filipinos, reviewed by community moderators before
              listing.
            </p>
          </div>

          <div className="relative max-w-xl">
            <Label htmlFor="directory-search" className="sr-only">
              Search projects and organizations
            </Label>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--color-kapwa-text-support)]" />
            {/* Kapwa's default placeholder color is too faint for WCAG AA. */}
            <Input
              id="directory-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search name, tag or focus area"
              className="h-12 pl-11 text-base placeholder:text-[var(--color-kapwa-text-support)] md:text-base"
            />
          </div>

          <dl className="flex flex-wrap gap-x-6 gap-y-2">
            <Stat
              value={stats.projects}
              singular="civic tech project"
              plural="civic tech projects"
            />
            <Stat
              value={stats.organizations}
              singular="organization"
              plural="organizations"
            />
            <Stat
              value={stats.sectors}
              singular="sector covered"
              plural="sectors covered"
            />
          </dl>
        </div>

        <div className="hidden h-80 md:block">
          <DirectoryMap activeQuery={query} onSelectPlace={onQueryChange} />
        </div>
      </div>
    </section>
  );
}
