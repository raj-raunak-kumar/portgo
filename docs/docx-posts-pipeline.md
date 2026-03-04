# DOCX → Blog Posts (Netlify Build Pipeline)

This project supports automatic conversion of Word files in `/docx-posts` into Markdown blog files in `/posts` during build.

## Folder structure

```text
/docx-posts/                  # source .docx files
/posts/                       # generated markdown posts
/public/post-assets/<slug>/   # extracted images from each docx
/scripts/convert-docx-posts.mjs
/.cache/docx-posts-cache.json # hash cache (auto-generated, ignored)
```

## Workflow

1. Add `.docx` files into `/docx-posts/`.
2. Build runs `npm run convert:docx-posts`.
3. Script converts each `.docx` with Pandoc.
4. Output markdown is written to `/posts/<slug>.md`.
5. Extracted images are written to `/public/post-assets/<slug>/`.
6. Already converted and unchanged files are skipped using SHA-256 cache.

## Writing raw HTML posts directly

You can also create HTML blog posts manually in `/posts`.

- Supported file types: `.html`, `.htm`, `.md`
- `.html`/`.htm` files are rendered as raw HTML automatically
- Raw HTML uses the website default font styling in the blog page
- Image URLs inside HTML (`<img src="https://..." />`) are rendered directly, so no separate upload is required

Example:

```html
---
title: "My HTML Post"
date: "2026-03-04"
slug: "my-html-post"
---

<h1>My HTML Post</h1>
<p>This HTML renders directly on the blog.</p>
<img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4" alt="Example" />
```

## Pandoc command used

```bash
pandoc <input.docx> -f docx -t gfm --wrap=none --extract-media=public/post-assets/<slug>
```

## Metadata + slug behavior

Generated markdown includes frontmatter:

```yaml
---
title: "<from filename>"
date: "YYYY-MM-DD"
slug: "seo-friendly-slug"
source: "docx"
---
```

- `title` is derived from docx filename.
- `date` is derived from file modification time.
- `slug` is generated from filename (lowercase + hyphenated).

## NPM scripts

```json
{
  "convert:docx-posts": "node scripts/convert-docx-posts.mjs",
  "prebuild": "npm run convert:docx-posts",
  "build:netlify": "npm run convert:docx-posts && NODE_ENV=production next build"
}
```

## Netlify configuration

`netlify.toml` build command:

```toml
[build]
  command = "npm run build:netlify"
  publish = ".next"
```

## Netlify requirement: Pandoc availability

Your build image must include `pandoc`. If it is missing, conversion fails early with a clear error.

If your Netlify image does not already provide Pandoc, install it in build via a plugin/script supported by your Netlify setup before running `build:netlify`.
