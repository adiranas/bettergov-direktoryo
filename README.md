# Philippine Civic Tech & CSO Directory

A curated, community-moderated directory of civic technology and civil society organizations (CSOs) serving the Philippines, hosted by [BetterGov.ph](https://bettergov.ph).

Listings are stored as validated YAML files in this repository and displayed as a searchable, filterable directory with an interactive map of Philippine local portals.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **UI & Components:** [React](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **Design System:** [@bettergov/kapwa](https://www.npmjs.com/package/@bettergov/kapwa)
- **Client Search:** [Fuse.js](https://www.fusejs.io/)
- **Testing:** [Vitest](https://vitest.dev/), [Testing Library](https://testing-library.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites

- Node.js 22.18+ (requires native type-stripping support)
- npm 10+

### Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/adiranas/bettergov-direktoryo.git
   cd bettergov-direktoryo
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the local development server:
   ```sh
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/                          # Next.js App Router (pages and layouts)
  how-we-curate/              # Curation methodology & public moderator list
components/                   # Reusable UI components
  DirectoryCard.tsx           # Individual Listing presentation
  DirectoryExplorer.tsx       # Main client interactive state
  DirectoryFilters.tsx        # Sector and kind filtering
  DirectoryHero.tsx           # Hero section and search input
  DirectoryMap.tsx            # Philippines map with local portal pins
  SubmitDropdown.tsx          # Dual submission navigation dropdown
content/
  projects/                   # Civic tech project Listings (YAML)
  csos/                       # Civil society organization Listings (YAML)
  moderators.yml              # Public list of active community moderators
hooks/                        # Search, filter, and sector count hooks
lib/
  content.ts                  # YAML parser and build-time schema validator
  moderators.ts               # Moderator list loader
  ph-map.ts                   # Map paths and portal marker coordinates
  quorum.ts                   # Review quorum calculation pure logic
  site.ts                     # Site constants and submission URLs
types/
  directory.ts                # TypeScript schemas, Sectors, and Affiliations
```

---

## Working with Content

Listings are static YAML files validated at build time. If an invalid or malformed field is present, the static build fails immediately.

### Adding a Project (`content/projects/<slug>.yml`)

The filename must match the `slug`. Example format:

```yaml
slug: sample-project
name: Sample Project
tagLine: Concise one-line description
description: Full description of public benefit purpose and features.
sector: Disaster & Recovery
secondarySectors:
  - Public Safety
affiliation: independent    # government | bettergov | international | independent
tags:
  - alerts
  - flood
liveUrl: https://sample.org/
repoUrl: https://github.com/sample/project
techStack:
  - TypeScript
  - Next.js
license: MIT                # SPDX identifier or Unspecified
maintainer: Sample Maintainer
status: active              # verified | active | archived
```

### Adding a CSO (`content/csos/<slug>.yml`)

A CSO must have a verifiable registration reference. Example format:

```yaml
slug: sample-cso
name: Sample CSO Name
sector: Social & Welfare
secondarySectors:
  - Health
affiliation: independent
focusAreas:
  - Poverty alleviation
  - Community health
registrationRef: SEC Reg. No. CN201234567
websiteUrl: https://samplecso.org/
contactEmail: info@samplecso.org
regionHeadquarters: National Capital Region (Quezon City)
status: active
```

---

## Submissions & Curation

Community members propose new listings through GitHub issue forms:
- **Civic Tech Project:** `.github/ISSUE_TEMPLATE/submit-civic-tech.yml`
- **Civil Society Organization:** `.github/ISSUE_TEMPLATE/submit-cso.yml`

Every submission is reviewed against the five-point curation checklist:
1. Public benefit
2. Link is alive
3. Non-partisan
4. No data harvesting
5. Active maintainer or repository

See [`CURATION_CHECKLIST.md`](CURATION_CHECKLIST.md) and the `/how-we-curate` page for full details.

---

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts Next.js development server. |
| `npm run build` | Builds production bundle and validates all Listing YAML schemas. |
| `npm start` | Runs the production build. |
| `npm run typecheck` | Runs `tsc --noEmit` across all application and script code. |
| `npm test` | Runs unit tests via Vitest (jsdom). |
| `npm run check:listings` | Live health check testing all listing URLs and repository activity. |

---

## License

Code is licensed under the [MIT License](LICENSE).
Directory data and curated listings are made available under [Creative Commons Zero (CC0 1.0 Universal)](https://creativecommons.org/publicdomain/zero/1.0/).
