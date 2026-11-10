# Curation Checklist

For community moderators reviewing submissions tagged `needs-review`.

This is a sanity check that should take about a minute. It is not fact-checking. The goal is to keep out SEO spam, broken hackathon projects, phishing and partisan campaign apps.

## The 5-point review

A submission must pass all five. When in doubt, ask the submitter in the issue instead of rejecting it.

### 1. Public benefit, not a commercial product

Does it mainly serve the public, and could someone use it without buying anything?

- **Pass:** free tools, open datasets, public dashboards, and nonprofit services.
- **Fail:** sales pages, paid SaaS with a civic label, and affiliate or SEO sites.

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

### 5. Active maintainer or repo

- **Pass:** a repo commit or site update in the last 12 months, or a maintainer who responds in the issue.
- **Fail:** abandoned and unresponsive. If it still has historical value, list it as `archived` instead.
- Projects listed as `archived` are exempt from this point. Their link must still lead to a copy of the project, such as the repository or a web archive.

## Choosing a status

| Status | Use when |
| --- | --- |
| `active` | The default for a submission that passes the review. |
| `verified` | The maintainer confirmed the listing, or the organization was confirmed in an SEC, DILG or DSWD registry. Record how in the pull request. |
| `archived` | A historical project that is no longer maintained. |

## After the review

**If it passes:**

1. Add `content/projects/<slug>.yml`, using [`content/projects/flood-watch.yml`](content/projects/flood-watch.yml) as the pattern. The `slug` must match the filename.
2. Leave out the maintainer contact. It stays in the issue and is not published.
3. Open a pull request that says `Closes #<issue>`. Run `npm run build` first, because it fails on an invalid entry.

**If it fails:** comment with the numbered point it failed, then close the issue. Submitters can reopen it after fixing the problem.

**If it looks like phishing or malware:** do not visit it again. Close the issue and tell the other maintainers.
