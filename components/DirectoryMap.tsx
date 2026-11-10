"use client";

import { useEffect, useRef, useState } from "react";
import { PH_MAP } from "@/lib/ph-map";

type Place = (typeof PH_MAP.places)[number];

/** Markers closer than this (in map units) are merged so each stays 24px or larger to tap. */
const CLUSTER_DISTANCE = 70;

function clusterPlaces(places: Place[]): Place[][] {
  const groups: Place[][] = [];
  for (const place of places) {
    const group = groups.find((members) =>
      members.some(
        (other) =>
          Math.hypot(other.pos[0] - place.pos[0], other.pos[1] - place.pos[1]) <
          CLUSTER_DISTANCE,
      ),
    );
    if (group) group.push(place);
    else groups.push([place]);
  }
  return groups;
}

const CLUSTERS = clusterPlaces(PH_MAP.places);

const centerOf = (members: Place[]): [number, number] => [
  members.reduce((sum, place) => sum + place.pos[0], 0) / members.length,
  members.reduce((sum, place) => sum + place.pos[1], 0) / members.length,
];

interface DirectoryMapProps {
  /** The search text currently applied, so the matching place stays highlighted. */
  activeQuery: string;
  onSelectPlace: (query: string) => void;
}

/**
 * The Philippines with a marker for each local civic portal in the directory.
 * The outline is decorative; the markers are real buttons that search for that place.
 */
export function DirectoryMap({ activeQuery, onSelectPlace }: DirectoryMapProps) {
  const { width, height, path } = PH_MAP;
  const [openCluster, setOpenCluster] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = activeQuery.trim().toLowerCase();

  useEffect(() => {
    if (openCluster === null) return;
    const close = (event: Event) => {
      if (
        event instanceof KeyboardEvent
          ? event.key === "Escape"
          : !rootRef.current?.contains(event.target as Node)
      ) {
        setOpenCluster(null);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [openCluster]);

  const select = (query: string) => {
    onSelectPlace(active === query ? "" : query);
    setOpenCluster(null);
  };

  return (
    <div
      ref={rootRef}
      className="relative mx-auto h-full w-auto"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        className="absolute inset-0 size-full"
      >
        <path
          d={path}
          fill="var(--color-kapwa-brand-50)"
          fillOpacity="0.14"
          stroke="var(--color-kapwa-brand-50)"
          strokeOpacity="0.45"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      </svg>

      {CLUSTERS.map((members, index) => {
        const [x, y] = centerOf(members);
        const isGroup = members.length > 1;
        const isActive = members.some((place) => place.query === active);
        const isOpen = openCluster === index;
        const position = {
          left: `${(x / width) * 100}%`,
          top: `${(y / height) * 100}%`,
        };

        if (!isGroup) {
          const [place] = members;
          return (
            <button
              key={place.slug}
              type="button"
              aria-pressed={isActive}
              aria-label={`Show the ${place.label} portal`}
              onClick={() => select(place.query)}
              style={position}
              className="group absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            >
              <span
                aria-hidden="true"
                className="absolute size-3 rounded-full bg-[var(--color-kapwa-bg-focus)] opacity-60 motion-safe:animate-ping"
              />
              <span
                aria-hidden="true"
                className={`relative size-2.5 rounded-full border-2 border-[var(--color-kapwa-brand-900)] bg-[var(--color-kapwa-bg-focus)] transition-transform duration-200 group-hover:scale-125 group-focus-visible:scale-125 ${
                  isActive ? "scale-150" : ""
                }`}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-full mr-1 whitespace-nowrap rounded-sm bg-[var(--color-kapwa-bg-surface)] px-1.5 py-0.5 text-xs font-medium text-[var(--color-kapwa-text-strong)] opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {place.label}
              </span>
            </button>
          );
        }

        return (
          <div
            key={members.map((place) => place.slug).join("+")}
            style={position}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={`${members.length} local portals in Luzon`}
              onClick={() => setOpenCluster(isOpen ? null : index)}
              className={`flex size-7 items-center justify-center rounded-full border-2 border-[var(--color-kapwa-brand-900)] bg-[var(--color-kapwa-bg-focus)] font-mono text-xs font-semibold tabular-nums text-[var(--color-kapwa-brand-950)] transition-transform duration-200 hover:scale-110 ${
                isActive || isOpen ? "scale-110" : ""
              }`}
            >
              {members.length}
            </button>
            {isOpen && (
              <ul className="reveal absolute right-full top-1/2 z-20 mr-2 w-max -translate-y-1/2 rounded-md bg-[var(--color-kapwa-bg-surface)] p-1 text-[var(--color-kapwa-text-strong)] shadow-md">
                {members.map((place) => (
                  <li key={place.slug}>
                    <button
                      type="button"
                      aria-pressed={place.query === active}
                      onClick={() => select(place.query)}
                      className="h-8 w-full rounded-sm px-2.5 text-left text-sm transition-colors hover:bg-[var(--color-kapwa-bg-hover)] aria-pressed:font-semibold aria-pressed:text-[var(--color-kapwa-text-brand)]"
                    >
                      {place.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
