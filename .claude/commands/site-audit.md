# Site Audit Command

Use this command to run a live SEO audit for this project and map findings back to the codebase.

## Usage

`/site-audit [url or route]`

Examples:

- `/site-audit https://www.shelpakov.online/ru`
- `/site-audit /services/seo-audit`
- `/site-audit /blog/geo-i-ii-vydacha-kak-poluchat-trafik-v-2026`

## What This Command Does

1. Resolves the target live URL
2. Runs the built-in project audit script when a full live audit is useful
3. Reviews the matching repo files that control the page
4. Summarizes the issues with concrete file targets
5. When the user asks for fixes, edits the repo directly

## Route Mapping Rules

- If the user gives a relative route, default to the Russian site: `https://www.shelpakov.online/ru`
- Homepage source: `app/page.tsx`
- Service pages: `lib/service-pages.ts`, `app/services/[slug]/page.tsx`, `components/services/ServicePageTemplate.tsx`
- Blog pages: `lib/built-in-blog-posts.ts`, `lib/blog-localization.ts`, `app/blog/[slug]/page.tsx`
- Global SEO/meta/schema issues: `app/layout.tsx`, `lib/structured-data.ts`

## Preferred Audit Execution

Use the existing project command when it makes sense:

```bash
npm run seo:audit -- [target-url]
```

## Output

Return:

1. Top issues by priority
2. Why each issue matters
3. Which repo file controls the issue
4. Whether the issue can be fixed directly in code
5. Next implementation step
