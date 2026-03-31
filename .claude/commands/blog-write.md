# Blog Write Command

Use this command to create or rewrite a built-in blog post for this project.

## Usage

`/blog-write [topic]`

Examples:

- `/blog-write geo pages for service businesses`
- `/blog-write how to prepare a site for migration without losing SEO`

## What This Command Does

1. Chooses or creates a blog slug
2. Writes the article in `lib/built-in-blog-posts.ts`
3. Adds or updates English localization in `lib/blog-localization.ts` when needed
4. Checks related service mapping in `app/blog/[slug]/page.tsx`
5. Ensures the article supports real service-page internal links

## Content Rules

- Write for this site's positioning, not a generic content farm
- Link to relevant service pages already present in the repo
- Keep article titles, excerpts, and content aligned
- Preserve the current article structure used by built-in posts

## Output

Create or update the built-in post directly in code.
