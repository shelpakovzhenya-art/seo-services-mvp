# SEO Fix Command

Use this command when you know the issue and want the repo fixed directly.

## Usage

`/seo-fix [issue, url, or route]`

Examples:

- `/seo-fix homepage title and H1 mismatch`
- `/seo-fix /services/technical-seo`
- `/seo-fix missing breadcrumbs on blog pages`

## What This Command Does

1. Identifies the affected page or template
2. Traces the problem to the real source file
3. Fixes the issue in code
4. Updates metadata, schema, headings, internal links, or layout code as needed
5. Summarizes the exact repo changes made

## Typical Target Files

- `app/layout.tsx`
- `app/page.tsx`
- `app/services/[slug]/page.tsx`
- `components/services/ServicePageTemplate.tsx`
- `lib/service-pages.ts`
- `lib/built-in-blog-posts.ts`
- `app/blog/[slug]/page.tsx`
- `lib/structured-data.ts`

## Output

Fix the issue directly in the repository.
