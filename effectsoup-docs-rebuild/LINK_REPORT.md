# Link Validation Report

Generated: 2026-07-06

## Method

All 19 Markdown files in `docs/` were scanned for markdown links `[text](url)` where `url` is a relative path to another `.md` file. Each link was resolved against the file's directory and checked for existence.

## Results

**All internal links resolve correctly. 0 broken links.**

## External Links Not Checked

Links to `https://effectsoup.com/*` are excluded because the live site returns HTTP 500. Links to `https://npmjs.org/*` and other external URLs were not validated.

## Known External URL Issues

- `effectsoup.com` — site down (500), all internal-site links skipped
- All npm package links (`https://www.npmjs.com/package/@effectsoup/*`) — not checked

## Link Quality Notes

- Every page has a "See Also" section with 2–4 internal links
- All internal links use relative paths with `.md` extension (GitHub-renderable)
- No broken image references (no `![]()` usage outside this report)
