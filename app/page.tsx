import { Plus } from "lucide-react";
import { DirectoryExplorer } from "@/components/DirectoryExplorer";
import { loadDirectory } from "@/lib/content";
import { SUBMIT_PROJECT_URL } from "@/lib/site";

export default function DirectoryPage() {
  const entries = loadDirectory();

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs text-[var(--color-kapwa-text-support)]">
            BetterGov.ph
          </p>
          <h1 className="kapwa-heading-md">
            Philippine Civic Tech &amp; CSO Directory
          </h1>
          <p className="kapwa-body-sm-default max-w-2xl text-[var(--color-kapwa-text-support)]">
            Open tools, public datasets and civil society organizations serving
            Filipinos, reviewed by community moderators before listing.
          </p>
        </div>
        {/* Kapwa's Button only renders <button>, so this link matches its primary style. */}
        <a
          href={SUBMIT_PROJECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md bg-[var(--color-kapwa-bg-brand-default)] px-4 text-sm font-medium text-[var(--color-kapwa-text-inverse)] shadow-xs transition-colors hover:bg-[var(--color-kapwa-bg-brand-hover)] active:bg-[var(--color-kapwa-bg-brand-active)]"
        >
          <Plus className="size-4" />
          Submit a project
          <span className="sr-only">(opens GitHub in a new tab)</span>
        </a>
      </header>

      <DirectoryExplorer entries={entries} />
    </main>
  );
}
