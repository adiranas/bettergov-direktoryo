/** `owner/name` of the GitHub repository that receives submissions. */
const GITHUB_REPO =
  process.env.NEXT_PUBLIC_GITHUB_REPO ?? "bettergovph/direktoryo";

export const SUBMIT_PROJECT_URL = `https://github.com/${GITHUB_REPO}/issues/new?template=submit-civic-tech.yml`;
