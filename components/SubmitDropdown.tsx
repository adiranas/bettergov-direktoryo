"use client";

import { Building2, ChevronDown, Code2, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SUBMIT_CSO_URL, SUBMIT_PROJECT_URL } from "@/lib/site";

export function SubmitDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        id="submit-dropdown-button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="submit-dropdown-menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[var(--color-kapwa-bg-brand-default)] px-3 text-sm font-medium text-[var(--color-kapwa-text-inverse)] shadow-xs transition-colors hover:bg-[var(--color-kapwa-bg-brand-hover)] active:bg-[var(--color-kapwa-bg-brand-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-kapwa-border-brand)] sm:px-4"
      >
        <Plus className="size-4 shrink-0" />
        Submit
        <ChevronDown
          className={`size-3.5 shrink-0 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
        <span className="sr-only"> submission options</span>
      </button>

      {isOpen && (
        <div
          id="submit-dropdown-menu"
          role="menu"
          aria-labelledby="submit-dropdown-button"
          className="absolute right-0 z-50 mt-1.5 w-72 rounded-lg border border-[var(--color-kapwa-border-weak)] bg-[var(--color-kapwa-bg-surface)] p-1.5 shadow-lg animate-in fade-in-50 zoom-in-95 duration-100"
        >
          <a
            role="menuitem"
            href={SUBMIT_PROJECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-start gap-3 rounded-md p-2.5 transition-colors hover:bg-[var(--color-kapwa-bg-brand-weak)] focus-visible:bg-[var(--color-kapwa-bg-brand-weak)] focus-visible:outline-hidden"
          >
            <Code2 className="mt-0.5 size-4 shrink-0 text-[var(--color-kapwa-text-brand)]" />
            <div className="space-y-0.5">
              <span className="kapwa-label-sm block text-[var(--color-kapwa-text-strong)]">
                Civic tech project
              </span>
              <span className="kapwa-body-xs-default block text-[var(--color-kapwa-text-support)]">
                Open tools, public apps, APIs and datasets
              </span>
            </div>
            <span className="sr-only"> (opens GitHub issue template in a new tab)</span>
          </a>

          <a
            role="menuitem"
            href={SUBMIT_CSO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-start gap-3 rounded-md p-2.5 transition-colors hover:bg-[var(--color-kapwa-bg-brand-weak)] focus-visible:bg-[var(--color-kapwa-bg-brand-weak)] focus-visible:outline-hidden"
          >
            <Building2 className="mt-0.5 size-4 shrink-0 text-[var(--color-kapwa-text-brand)]" />
            <div className="space-y-0.5">
              <span className="kapwa-label-sm block text-[var(--color-kapwa-text-strong)]">
                Civil society organization
              </span>
              <span className="kapwa-body-xs-default block text-[var(--color-kapwa-text-support)]">
                Verified non-profits, CSOs and charities
              </span>
            </div>
            <span className="sr-only"> (opens GitHub issue template in a new tab)</span>
          </a>
        </div>
      )}
    </div>
  );
}
