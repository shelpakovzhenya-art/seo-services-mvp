# Service Rewrite Command

Use this command to rewrite a service page inside the codebase.

## Usage

`/service-rewrite [slug or goal]`

Examples:

- `/service-rewrite seo-audit`
- `/service-rewrite strengthen the technical-seo page for migration projects`

## What This Command Does

1. Identifies the target service slug
2. Reviews `lib/service-pages.ts` as the primary source
3. Checks `app/services/[slug]/page.tsx` metadata fallback
4. Verifies the rendered structure in `components/services/ServicePageTemplate.tsx`
5. Rewrites the service content directly in code

## Update Scope

When relevant, update:

- H1
- title/description copy
- intro and hero value
- benefit cards
- audience and includes sections
- steps, outcomes, FAQ, CTA copy
- related services if the page angle changes materially

## Output

Apply the service rewrite directly in the repo and keep metadata and schema intent aligned.
