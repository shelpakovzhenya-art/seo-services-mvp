# CLAUDE.md

This file connects SEO Machine workflows to the `seo-services-mvp` codebase.

## Project Goal

`seo-services-mvp` is a Next.js website and admin panel for SEO services. The AI workspace in this repo should be able to audit live pages, trace issues back to source files, and edit the project directly.

Primary live site:

- Russian: `https://www.shelpakov.online/ru`
- English: `https://www.shelpakov.online/en`

## Where Content Lives

### Global site shell

- `app/layout.tsx` - global metadata, robots, favicon, base schema, header/footer shell
- `app/page.tsx` - homepage copy, metadata, CTA structure, homepage sections
- `app/globals.css` - visual layer and reusable utility classes

### Services

- `lib/service-pages.ts` - primary Russian service page content source
- `app/services/[slug]/page.tsx` - metadata and page rendering logic for service pages
- `components/services/ServicePageTemplate.tsx` - service page structure, headings, schema, CTA blocks
- `lib/structured-data.ts` - service, breadcrumb, FAQ, blog, and brand schema

### Blog

- `lib/built-in-blog-posts.ts` - built-in Russian blog content
- `lib/blog-localization.ts` - English overrides and blog localization layer
- `app/blog/[slug]/page.tsx` - blog page metadata, article schema, related services

### Supporting trust and commercial pages

- `app/about/page.tsx`
- `app/methodology/page.tsx`
- `app/editorial-policy/page.tsx`
- `app/contacts/page.tsx`
- `app/cases/**/*`

### Admin and SEO audit pipeline

- `scripts/seo_audit/generate_audit.py` - main branded SEO audit generator
- `scripts/run-seo-audit.ps1` - audit launcher used by `npm run seo:audit`
- `app/admin/seo-analytics/audit/page.tsx` - admin audit screen

## How SEO Machine Should Work In This Repo

When making SEO or content changes, do not stop at copy only. Update the code source that controls the page.

For homepage work:

- update on-page copy in `app/page.tsx`
- keep metadata aligned
- preserve locale support
- strengthen CTA, trust, and internal links when relevant

For service page work:

- update `lib/service-pages.ts`
- check whether `app/services/[slug]/page.tsx` metadata fallback also needs updating
- keep FAQ, schema, related services, and CTA blocks aligned

For blog work:

- update or add the article in `lib/built-in-blog-posts.ts`
- add English override in `lib/blog-localization.ts` when needed
- verify related services in `app/blog/[slug]/page.tsx` if the new slug needs mapping

For sitewide SEO fixes:

- trace the live issue to the real source file
- update metadata, schema, headings, internal links, or layout code as needed
- use the existing audit pipeline when auditing live URLs

## Existing Audit Command

Use the built-in project audit script when you need a full live-site audit:

```bash
npm run seo:audit -- https://www.shelpakov.online/ru
```

This project already has its own audit generator. Prefer extending or using that pipeline rather than inventing a parallel one.

## Embedded SEO Machine Commands

This repo exposes project-local commands for common workflows:

- `/site-audit [url or route]`
- `/homepage-rewrite [goal]`
- `/service-rewrite [slug or service goal]`
- `/blog-write [topic]`
- `/seo-fix [issue, url, or route]`

These commands should inspect the live site and this codebase together, then make changes in the repo when appropriate.

## Editing Rules For This Repo

- Preserve the existing visual language and component structure unless the task explicitly calls for a redesign
- Prefer editing the source content layer instead of patching rendered output
- Keep Russian and English behavior in mind when touching page copy, URLs, or metadata
- When adding new SEO content, include internal links to relevant service pages and trust pages
- When changing schema-sensitive content, verify `lib/structured-data.ts` still matches the rendered page intent

## Run Anywhere

This repo includes OpenCode + GitHub integration so the SEO Machine workflow can run from Codespaces or GitHub comments.

See `SEO-MACHINE.md` for usage.
