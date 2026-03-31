# SEO Machine In This Repo

This repository now has an embedded SEO Machine workflow for `seo-services-mvp`.

## What It Can Do

The AI workspace can now work directly against this project and change the site source code, not just produce notes.

Built-in repo workflows:

- `/site-audit [url or route]` - run a live audit and map issues to code
- `/homepage-rewrite [goal]` - rewrite the homepage in `app/page.tsx`
- `/service-rewrite [slug or goal]` - rewrite service pages via `lib/service-pages.ts`
- `/blog-write [topic]` - create or update built-in blog posts
- `/seo-fix [issue, url, or route]` - fix a known SEO issue in code

## Project-Aware File Mapping

- Homepage: `app/page.tsx`
- Global metadata and base schema: `app/layout.tsx`
- Service page source: `lib/service-pages.ts`
- Service page route metadata: `app/services/[slug]/page.tsx`
- Service page structure: `components/services/ServicePageTemplate.tsx`
- Blog source: `lib/built-in-blog-posts.ts`
- Blog localization: `lib/blog-localization.ts`
- Blog rendering and schema: `app/blog/[slug]/page.tsx`
- Structured data helpers: `lib/structured-data.ts`
- Live audit engine: `scripts/seo_audit/generate_audit.py`

## Audit Command

Use the existing project audit tool directly when needed:

```bash
npm run seo:audit -- https://www.shelpakov.online/ru
```

## Run From GitHub Codespaces

1. Open the repository in GitHub Codespaces.
2. Wait for setup to finish.
3. Run:

```bash
opencode
```

4. Connect your model provider with `/connect`.
5. Use the project commands listed above.

## Run From GitHub Comments

The repository includes `.github/workflows/opencode.yml`.

Add `OPENAI_API_KEY` to GitHub Actions secrets, then comment on an issue or PR:

```text
/oc Use the repo's /site-audit workflow for https://www.shelpakov.online/ru and summarize the top 5 issues.
/oc Use the repo's /service-rewrite workflow to strengthen the seo-audit service page for lead quality.
/oc Use the repo's /seo-fix workflow to improve homepage metadata and trust structure.
```

## Important

This integration is project-aware.

The expected behavior is:

- inspect the live page and the repo together
- update the actual source files
- preserve the existing design system and page architecture
- keep metadata, schema, internal links, and localized behavior aligned
