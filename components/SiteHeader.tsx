import Link from "next/link";
import { SubmitDropdown } from "@/components/SubmitDropdown";
import { LOGO_ICON_PRIMARY } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-kapwa-border-weak)] bg-[var(--color-kapwa-bg-surface)] shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 md:gap-3">
          <img
            src={LOGO_ICON_PRIMARY}
            alt=""
            width={48}
            height={48}
            className="size-10 shrink-0 md:size-12"
          />
          <span className="min-w-0">
            <span className="kapwa-label-md block">BetterGov.ph</span>
            <span className="kapwa-body-xs-default mt-0.5 block truncate text-[var(--color-kapwa-text-support)]">
              Civic Tech &amp; CSO Directory
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden sm:block">
          <Link
            href="/how-we-curate"
            className="kapwa-body-sm-default inline-flex min-h-8 items-center px-2 text-[var(--color-kapwa-text-support)] underline-offset-4 transition-colors hover:text-[var(--color-kapwa-text-brand)] hover:underline"
          >
            How we curate
          </Link>
        </nav>

        <SubmitDropdown />
      </div>
    </header>
  );
}
