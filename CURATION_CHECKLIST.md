# Curation Checklist

For community Moderators reviewing Submissions tagged `needs-review`. A **Submission** is a project or organization that has been proposed but not yet reviewed. A **Listing** is one that a Moderator has approved and that appears in the directory.

This is a sanity check that should take about a minute. It is not fact-checking. The goal is to keep out SEO spam, broken hackathon projects, phishing and partisan campaign apps.

## Before you review

- **Conflict of interest.** Never review a Submission for a Project you maintain or are paid by. Hand it to another Moderator.
- **How many approvals.** A Submission with Affiliation `independent` or `international` needs one Moderator approval. A Submission with Affiliation `bettergov` or `government` needs two, and at least one approver must not be affiliated with that Project. The Moderator list is public in `content/moderators.yml`.
- **Check the claimed Affiliation.** Whoever runs it decides the value: government (including state universities and government research bodies), BetterGov, international or multilateral, or independent. If the claim looks wrong, correct it in the review and say why.

## The 5-point review for a Project

A Submission must pass all five. When in doubt, ask the submitter in the issue instead of rejecting it.

### 1. Public benefit, not a commercial product

It must be technology-based (software, dataset, API, bot or public dashboard), free to use, and mainly serve the public.

- **Pass:** free tools, open datasets, public dashboards, and non-profit services. Government and university tools qualify.
- **Fail:** sales pages, paid SaaS with a civic label, and affiliate or SEO sites.
- **Fail:** an organization or newsroom with no tool of its own. List a CSO instead, or only the tool it publishes.

### 2. The link is alive (HTTP 200)

Open the link, or run:

```sh
curl -sS -o /dev/null -L -w '%{http_code}\n' https://example.ph
```

- **Pass:** it returns `200` and shows the project that was described.
- **Fail:** errors, parked domains, or redirects to something unrelated.
- A `403` from `curl` can just be bot blocking. Confirm in a browser before failing it.

### 3. Non-partisan

- **Pass:** neutral information, including data about candidates and officials.
- **Fail:** promotes or attacks a candidate, party or campaign, or is run by one.

### 4. No malicious data harvesting

- **Pass:** collects only what its purpose needs, and says so.
- **Fail:** asks for government IDs, OTPs, passwords or payment details without a clear reason.
- **Fail:** imitates a government site, or uses a lookalike domain.
- **Local portals:** a volunteer-run portal for a local government must say plainly on its own site that it is not the official government website. A site titled "Official Portal" that is run by volunteers fails this point until it changes.

### 5. Active maintainer or repo

- **Pass:** a repo commit or site update in the last 12 months, or a maintainer who responds in the issue.
- **Fail:** abandoned and unresponsive. If it still has historical value, list it as `archived` instead.
- Projects listed as `archived` are exempt from this point. Their link must still lead to a copy of the project, such as the repository or a web archive.

## The review for a CSO

A CSO must have a public non-profit purpose and a registration you can check.

1. Open the **public record** linked in the Submission and confirm the name, the agency and the number match what was submitted.
2. If the agency has no public record, the Submission cannot be accepted, because the one-minute check can't be done. Say so in the issue.
3. Run points 2 to 4 above on its website.
4. Keep only an organizational email that the organization already publishes. Remove personal addresses.

Write the agency and number together in the `registrationRef` field, for example `SEC Reg. No. CN201234567` or `Republic Act No. 10072`.

## Choosing a status

| Status | Use when |
| --- | --- |
| `active` | The default for a Submission that passes the review. |
| `verified` | Identity and ownership are confirmed. It is never an endorsement of quality or accuracy. |
| `archived` | A historical Project that is no longer maintained. |

**What earns `verified`:**

- **A Project:** the maintainer gave a proof of control. Any one of: a file committed to the repository by a maintainer, a message posted from the project's own domain or official account, or a reply on the Submission from the repository owner's own GitHub account. You cannot verify a Project you maintain.
- **A CSO:** the registration record you opened matches the submitted details.

Record how you verified it in the pull request.

## Sectors

Pick one **primary sector**. If the Listing clearly belongs elsewhere too, add up to two `secondarySectors`. They appear in those sectors' lists and counts but never change the overall total.

## After the review

**If it passes:**

1. Add `content/projects/<slug>.yml` or `content/csos/<slug>.yml`, using an existing file as the pattern. The `slug` must match the filename.
2. Leave out the maintainer contact. It stays in the issue and is not published.
3. Open a pull request that says `Closes #<issue>`. Run `npm run build` first, because it fails on an invalid entry.

**If it fails:** comment with the numbered point it failed, then close the issue. Submitters can reopen it after fixing the problem.

**If it looks like phishing or malware:** do not visit it again. Close the issue and tell the other Moderators.

## Keeping Listings accurate

Once a month, a Moderator runs `npm run check:listings`. It reports Listings whose link fails or whose repository has gone quiet, and never changes a Listing itself. Add `--open-issues` to open one issue per problem Listing (this needs the GitHub CLI signed in).

- **Abandoned but historically useful:** change the status to `archived`.
- **A maintainer asks to be removed, or a Listing turns unsafe** (phishing, a hijacked domain, partisan content): remove the file in a pull request within 7 days and give the reason in it. Removed Listings are not listed publicly.
