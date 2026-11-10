/** `owner/name` of the GitHub repository that receives submissions. */
const GITHUB_REPO =
  process.env.NEXT_PUBLIC_GITHUB_REPO ?? "adiranas/bettergov-direktoryo";

export const SUBMIT_PROJECT_URL = `https://github.com/${GITHUB_REPO}/issues/new?template=submit-civic-tech.yml`;

export const SUBMIT_CSO_URL = `https://github.com/${GITHUB_REPO}/issues/new?template=submit-cso.yml`;

/** BetterGov's logo rules require the unmodified WebP files from this CDN. */
const LOGO_CDN = "https://assets.bettergov.ph/logos/webp";

export const LOGO_ICON_PRIMARY = `${LOGO_CDN}/icon-primary.webp`;
export const LOGO_ICON_WHITE = `${LOGO_CDN}/icon-white.webp`;
