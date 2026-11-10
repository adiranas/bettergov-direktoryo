import Link from "next/link";
import {
  LOGO_ICON_WHITE,
  SUBMIT_CSO_URL,
  SUBMIT_PROJECT_URL,
} from "@/lib/site";

const LINK_CLASS =
  "text-[var(--color-kapwa-text-inverse-subtle)] underline-offset-2 transition-colors hover:text-[var(--color-kapwa-text-inverse)] hover:underline";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--color-kapwa-bg-surface-bold)] text-[var(--color-kapwa-text-inverse)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_ICON_WHITE}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0"
          />
          <div>
            <p className="kapwa-label-md">BetterGov.ph</p>
            <p className="kapwa-body-sm-default mt-1 max-w-md text-[var(--color-kapwa-text-inverse-subtle)]">
              A community-run directory of civic tech and civil society
              organizations in the Philippines.
            </p>
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="kapwa-body-sm-default flex flex-wrap gap-x-6 gap-y-2"
        >
          <Link href="/how-we-curate" className={LINK_CLASS}>
            How we curate
          </Link>
          <a href="https://bettergov.ph" className={LINK_CLASS}>
            BetterGov.ph
          </a>
          <a href={SUBMIT_PROJECT_URL} className={LINK_CLASS}>
            Submit a project
          </a>
          <a href={SUBMIT_CSO_URL} className={LINK_CLASS}>
            Submit an organization
          </a>
        </nav>
      </div>
    </footer>
  );
}
