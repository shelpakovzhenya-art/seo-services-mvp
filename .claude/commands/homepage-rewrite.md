# Homepage Rewrite Command

Use this command to rewrite or improve the homepage for this project.

## Usage

`/homepage-rewrite [goal]`

Examples:

- `/homepage-rewrite make the homepage clearer for SEO audit leads`
- `/homepage-rewrite strengthen trust and CTA structure for Russian visitors`

## What This Command Does

1. Reviews `app/page.tsx` and `app/layout.tsx`
2. Audits the live homepage if useful
3. Rewrites homepage sections inside the real source file
4. Keeps metadata, CTA logic, internal links, and trust blocks aligned
5. Preserves existing visual and component patterns

## Required Checks

- Hero title and subheading match the goal
- CTA text is consistent across sections
- Homepage metadata still fits the rewritten positioning
- Internal links point to the right service and trust pages
- Russian and English behavior is not broken

## Output

Apply the homepage changes directly in the repo and summarize what changed.
