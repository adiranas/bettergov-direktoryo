import { Card } from "@bettergov/kapwa/card";
import {
  Archive,
  BadgeCheck,
  Code2,
  ExternalLink,
  Mail,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  AFFILIATION_LABELS,
  type CurationStatus,
  type DirectoryEntry,
} from "@/types/directory";

const MAX_TAGS = 3;

const STATUS_STYLES: Record<
  CurationStatus,
  { label: string; icon?: LucideIcon; className: string }
> = {
  verified: {
    label: "Verified",
    icon: BadgeCheck,
    className:
      "bg-[var(--color-kapwa-bg-success-weak)] text-[var(--color-kapwa-text-success)]",
  },
  active: {
    label: "Active",
    className: "text-[var(--color-kapwa-text-support)]",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    className:
      "border border-[var(--color-kapwa-border-weak)] text-[var(--color-kapwa-text-support)]",
  },
};

function StatusBadge({ status }: { status: CurationStatus }) {
  const { label, icon: Icon, className } = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-sm px-1.5 py-0.5 text-xs font-medium ${className}`}
    >
      {Icon ? (
        <Icon className="size-3.5" />
      ) : (
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-[var(--color-kapwa-bg-success-default)]"
        />
      )}
      {label}
    </span>
  );
}

const displayUrl = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function SecondaryLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(href.startsWith("http") && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
      // Sits above the card-wide link so it stays separately clickable.
      className="relative z-10 inline-flex min-h-6 max-w-full min-w-0 items-center gap-1.5 font-mono text-xs text-[var(--color-kapwa-text-support)] underline-offset-2 transition-colors hover:text-[var(--color-kapwa-text-brand)] hover:underline"
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{children}</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function DirectoryCard({ entry }: { entry: DirectoryEntry }) {
  const isProject = entry.kind === "project";

  // The title link stretches over the whole card. A project opens its live
  // site, or its repository when it has none.
  const primaryUrl = isProject
    ? (entry.liveUrl ?? entry.repoUrl!)
    : entry.websiteUrl;

  const description = isProject ? entry.description : null;
  const tags = isProject ? entry.tags : entry.focusAreas;
  const affiliation = AFFILIATION_LABELS[entry.affiliation];
  const meta = isProject
    ? [
        affiliation,
        // Skips a maintainer that only repeats the affiliation, e.g. "BetterGov.ph".
        entry.maintainer.toLowerCase().includes(affiliation.toLowerCase())
          ? null
          : entry.maintainer,
        entry.license,
      ]
    : [affiliation, entry.regionHeadquarters, entry.registrationRef];
  const metaText = meta.filter(Boolean).join(" · ");

  return (
    <Card
      aria-label={entry.name}
      className="group relative flex h-full flex-col rounded-lg transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-kapwa-border-strong)] hover:shadow-md focus-within:border-[var(--color-kapwa-border-strong)]"
    >
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="kapwa-label-lg text-pretty">
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 after:absolute after:inset-0 after:content-[''] group-hover:text-[var(--color-kapwa-text-brand)]"
            >
              {entry.name}
              <ExternalLink
                aria-hidden="true"
                className="ml-1.5 inline size-3.5 -translate-y-px text-[var(--color-kapwa-text-support)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
              />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </h2>
          <StatusBadge status={entry.status} />
        </div>

        <div className="space-y-1.5">
          {isProject && (
            <p className="kapwa-body-sm-strong text-[var(--color-kapwa-text-strong)]">
              {entry.tagLine}
            </p>
          )}
          {description && (
            <p className="kapwa-body-sm-default line-clamp-3 text-[var(--color-kapwa-text-support)]">
              {description}
            </p>
          )}
        </div>

        <div className="mt-auto space-y-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-sm bg-[var(--color-kapwa-bg-surface-brand)] px-2 py-0.5 text-xs font-medium text-[var(--color-kapwa-text-brand-bold)]">
              {entry.sector}
            </span>
            {entry.secondarySectors?.map((extra) => (
              <span
                key={extra}
                className="rounded-sm border border-[var(--color-kapwa-border-weak)] px-2 py-0.5 text-xs font-medium text-[var(--color-kapwa-text-support)]"
              >
                {extra}
              </span>
            ))}
            {tags.slice(0, MAX_TAGS).map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs text-[var(--color-kapwa-text-support)]"
              >
                #{tag}
              </span>
            ))}
          </div>
          <p className="font-mono text-xs text-[var(--color-kapwa-text-support)]">
            {metaText}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start border-t border-[var(--color-kapwa-border-weak)] px-5 py-2.5">
        {isProject ? (
          entry.repoUrl && (
            <SecondaryLink href={entry.repoUrl} icon={Code2}>
              {displayUrl(entry.repoUrl)}
            </SecondaryLink>
          )
        ) : (
          entry.contactEmail && (
            <SecondaryLink href={`mailto:${entry.contactEmail}`} icon={Mail}>
              {entry.contactEmail}
            </SecondaryLink>
          )
        )}
        {!(isProject ? entry.repoUrl : entry.contactEmail) && (
          <span className="min-h-6 truncate font-mono text-xs leading-6 text-[var(--color-kapwa-text-support)]">
            {displayUrl(primaryUrl)}
          </span>
        )}
      </div>
    </Card>
  );
}
