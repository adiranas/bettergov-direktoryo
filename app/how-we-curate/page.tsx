import { Plus } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { loadModerators, MIN_MODERATORS } from "@/lib/moderators";
import { SUBMIT_CSO_URL, SUBMIT_PROJECT_URL } from "@/lib/site";
import { AFFILIATION_LABELS, type Affiliation } from "@/types/directory";

export const metadata: Metadata = {
  title: "How we curate | Philippine Civic Tech & CSO Directory",
  description:
    "What gets listed, what the Verified, Active and Archived labels mean, who reviews submissions, and how a listing is removed.",
};

const CHECKS = [
  ["Public benefit", "It is technology-based, free to use and mainly serves the public, not a commercial product."],
  ["Link is alive", "The link responds and shows the project that was described."],
  ["Non-partisan", "It does not promote or attack a candidate, party or campaign."],
  ["No data harvesting", "It collects only what its purpose needs, and does not imitate a government site."],
  ["Active maintainer", "There is a recent update, or a maintainer who responds."],
] as const;

const STATUSES = [
  ["Verified", "Identity and ownership are confirmed: the maintainer proved control, or a registry record matches. It is not an endorsement of quality or accuracy."],
  ["Active", "The listing passed review, and its link and maintainer were live when last checked."],
  ["Archived", "A historical project that is no longer maintained, kept as a read-only record."],
] as const;

const AFFILIATION_MEANINGS: Record<Affiliation, string> = {
  government: "Run by a government body, including state universities and government research bodies.",
  bettergov: "Run by BetterGov.ph, the host of this directory.",
  international: "Run by an international or multilateral organization.",
  independent: "Run by volunteers, a company or a non-profit with no government or BetterGov tie.",
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="kapwa-heading-sm">{title}</h2>
      {children}
    </section>
  );
}

function Terms({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <dl className="divide-y divide-[var(--color-kapwa-border-weak)] rounded-lg border border-[var(--color-kapwa-border-weak)] bg-[var(--color-kapwa-bg-surface)]">
      {items.map(([term, meaning]) => (
        <div key={term} className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
          <dt className="kapwa-label-md">{term}</dt>
          <dd className="kapwa-body-md-default text-[var(--color-kapwa-text-support)]">{meaning}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function HowWeCuratePage() {
  const moderators = loadModerators();
  const affiliations = Object.entries(AFFILIATION_MEANINGS).map(
    ([key, meaning]) => [AFFILIATION_LABELS[key as Affiliation], meaning] as const,
  );

  return (
    <main className="mx-auto max-w-3xl space-y-10 px-4 py-10 sm:px-6 md:py-14">
      <header className="space-y-3">
        <h1 className="kapwa-heading-md md:kapwa-heading-lg text-balance">How we curate</h1>
        <p className="kapwa-body-md-default md:kapwa-body-lg-default text-pretty text-[var(--color-kapwa-text-support)]">
          Nothing is published the moment it is submitted. A community Moderator
          reviews every submission first. The review takes about a minute and
          checks the basics. It does not fact-check what a project says.
        </p>
      </header>

      <Section title="The five checks">
        <Terms items={CHECKS} />
        <p className="kapwa-body-md-default text-[var(--color-kapwa-text-support)]">
          An organization is listed only if its registration matches a public
          record, whichever agency issued it.
        </p>
      </Section>

      <Section title="What the labels mean">
        <Terms items={STATUSES} />
      </Section>

      <Section title="Who runs each listing">
        <p className="kapwa-body-md-default max-w-prose text-[var(--color-kapwa-text-support)]">
          This directory is hosted by BetterGov.ph, and some listings are
          BetterGov&rsquo;s own. Each listing shows who runs it, so the host&rsquo;s
          work is never mistaken for a neutral pick.
        </p>
        <Terms items={affiliations} />
      </Section>

      <Section title="Who reviews">
        <p className="kapwa-body-md-default max-w-prose text-[var(--color-kapwa-text-support)]">
          One Moderator approves an independent or international submission.
          A BetterGov or government submission needs two, and at least one
          approver must be unaffiliated with that project. A Moderator never
          reviews a project they maintain.
        </p>
        {moderators.length === 0 ? (
          <p className="kapwa-body-md-default rounded-lg border border-[var(--color-kapwa-border-weak)] bg-[var(--color-kapwa-bg-surface)] px-4 py-3">
            The Moderators will be named here before launch.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-[var(--color-kapwa-border-weak)] rounded-lg border border-[var(--color-kapwa-border-weak)] bg-[var(--color-kapwa-bg-surface)]">
              {moderators.map((moderator) => (
                <li key={moderator.github} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
                  <a
                    href={`https://github.com/${moderator.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kapwa-label-md text-[var(--color-kapwa-text-brand)] underline-offset-2 hover:underline"
                  >
                    {moderator.name}
                    <span className="sr-only"> (opens GitHub in a new tab)</span>
                  </a>
                  <span className="font-mono text-xs text-[var(--color-kapwa-text-support)]">
                    {AFFILIATION_LABELS[moderator.affiliation]}
                  </span>
                </li>
              ))}
            </ul>
            {moderators.length < MIN_MODERATORS && (
              <p className="kapwa-body-sm-default text-[var(--color-kapwa-text-support)]">
                At least {MIN_MODERATORS} Moderators are needed before
                BetterGov or government submissions can be approved.
              </p>
            )}
          </>
        )}
      </Section>

      <Section title="Keeping listings accurate">
        <p className="kapwa-body-md-default max-w-prose text-[var(--color-kapwa-text-support)]">
          Moderators re-check every listing&rsquo;s link and activity about once
          a month. When a link fails or a repository has gone quiet, a
          Moderator decides whether to archive it. A listing is removed within
          7 days if its maintainer asks, or if it becomes unsafe, such as
          phishing, a hijacked domain or partisan content.
        </p>
      </Section>

      <div className="flex flex-wrap gap-3 border-t border-[var(--color-kapwa-border-weak)] pt-6">
        {[
          ["Submit a project", SUBMIT_PROJECT_URL],
          ["Submit an organization", SUBMIT_CSO_URL],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[var(--color-kapwa-bg-brand-default)] px-4 text-sm font-medium text-[var(--color-kapwa-text-inverse)] shadow-xs transition-colors hover:bg-[var(--color-kapwa-bg-brand-hover)] active:bg-[var(--color-kapwa-bg-brand-active)]"
          >
            <Plus className="size-4" />
            {label}
            <span className="sr-only">(opens GitHub in a new tab)</span>
          </a>
        ))}
      </div>
    </main>
  );
}
