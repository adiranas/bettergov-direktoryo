import { Card, CardFooter } from "@bettergov/kapwa/card";
import {
  Archive,
  BadgeCheck,
  Building2,
  CircleCheck,
  Code2,
  ExternalLink,
  Globe,
  Mail,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { CurationStatus, DirectoryEntry } from "@/types/directory";

const STATUS_STYLES: Record<
  CurationStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  verified: {
    label: "Verified",
    icon: BadgeCheck,
    className:
      "border-[var(--color-kapwa-border-brand)] bg-[var(--color-kapwa-bg-brand-default)] text-[var(--color-kapwa-text-inverse)]",
  },
  active: {
    label: "Active",
    icon: CircleCheck,
    className:
      "border-[var(--color-kapwa-border-strong)] bg-[var(--color-kapwa-bg-surface)] text-[var(--color-kapwa-text-support)]",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    className:
      "border-[var(--color-kapwa-border-weak)] bg-[var(--color-kapwa-bg-gray-hover)] text-[var(--color-kapwa-text-support)]",
  },
};

function StatusPill({ status }: { status: CurationStatus }) {
  const { label, icon: Icon, className } = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}
    >
      <Icon className="size-3" />
      {label}
    </span>
  );
}

function Tags({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null;
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1">
      {items.map((item) => (
        <li
          key={item}
          className="rounded bg-[var(--color-kapwa-bg-gray-hover)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--color-kapwa-text-support)]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 text-[var(--color-kapwa-text-support)]">
        {label}
      </dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

function CardLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  const isExternal = href.startsWith("http");
  // Uses the brand text token because Kapwa's link token is below 4.5:1 at this size.
  return (
    <a
      href={href}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      className="inline-flex min-w-0 items-center gap-1 font-mono text-xs text-[var(--color-kapwa-text-brand)] underline-offset-2 hover:underline"
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{children}</span>
      {isExternal && (
        <>
          <ExternalLink className="size-3 shrink-0" />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </a>
  );
}

const displayUrl = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export function DirectoryCard({ entry }: { entry: DirectoryEntry }) {
  const isProject = entry.kind === "project";
  const KindIcon = isProject ? Code2 : Building2;

  // CardHeader and CardContent add generic heading and region roles to every
  // card, so only Card and CardFooter are used here.
  return (
    <Card
      aria-label={entry.name}
      className="flex h-full flex-col transition-colors hover:border-[var(--color-kapwa-border-strong)]"
    >
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide text-[var(--color-kapwa-text-support)]">
            <KindIcon className="size-3.5" />
            {isProject ? "Civic tech" : "CSO"}
          </span>
          <StatusPill status={entry.status} />
        </div>

        <div className="space-y-1">
          <h2 className="kapwa-label-md">{entry.name}</h2>
          {isProject && (
            <p className="kapwa-body-sm-strong text-[var(--color-kapwa-text-support)]">
              {entry.tagLine}
            </p>
          )}
        </div>

        <div>
          <span className="inline-block rounded-full border border-[var(--color-kapwa-bg-surface-brand)] bg-[var(--color-kapwa-bg-brand-weak)] px-2 py-0.5 text-xs font-medium text-[var(--color-kapwa-text-brand)]">
            {entry.sector}
          </span>
        </div>

        {isProject && (
          <p className="kapwa-body-sm-default text-[var(--color-kapwa-text-support)]">
            {entry.description}
          </p>
        )}

        <dl className="space-y-1 font-mono text-xs">
          {isProject ? (
            <>
              <Meta label="Maintainer">{entry.maintainer}</Meta>
              <Meta label="License">{entry.license}</Meta>
            </>
          ) : (
            <>
              <Meta label="Based in">{entry.regionHeadquarters}</Meta>
              {entry.secOrGovRegNumber && (
                <Meta label="Reg. no.">{entry.secOrGovRegNumber}</Meta>
              )}
            </>
          )}
        </dl>

        {isProject ? (
          <div className="space-y-1">
            <Tags items={entry.tags} label="Tags" />
            <Tags items={entry.techStack} label="Tech stack" />
          </div>
        ) : (
          <Tags items={entry.focusAreas} label="Focus areas" />
        )}
      </div>

      <CardFooter className="flex flex-col gap-1 p-4 md:p-4">
        {isProject ? (
          <>
            {entry.liveUrl && (
              <CardLink href={entry.liveUrl} icon={Globe}>
                {displayUrl(entry.liveUrl)}
              </CardLink>
            )}
            {entry.repoUrl && (
              <CardLink href={entry.repoUrl} icon={Code2}>
                {displayUrl(entry.repoUrl)}
              </CardLink>
            )}
          </>
        ) : (
          <>
            <CardLink href={entry.websiteUrl} icon={Globe}>
              {displayUrl(entry.websiteUrl)}
            </CardLink>
            {entry.contactEmail && (
              <CardLink href={`mailto:${entry.contactEmail}`} icon={Mail}>
                {entry.contactEmail}
              </CardLink>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
