# Blog Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dependency-free client-side search to `/blog` so visitors can filter posts by title, description, and tags.

**Architecture:** Keep `src/app/blog/page.tsx` as the server component that loads posts with `getAllPosts()`. Add a focused client component that receives serializable post metadata, applies a small pure filtering helper, and renders the existing blog-card visual style with search UI, result count, and zero-match handling.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, existing MDX blog metadata.

---

## File structure

- Create: `src/components/BlogSearch.tsx`
  - Client component for query state, result count, empty state, and filtered blog card rendering.
- Modify: `src/app/blog/page.tsx`
  - Keep server data loading, import `BlogSearch`, and pass `getAllPosts()` results into it.
- No dependency changes.
- No separate route or backend search endpoint.

## Existing context

`src/app/blog/page.tsx` currently loads all posts on the server and renders the list inline. `src/lib/blog.ts` returns sorted posts with `slug`, `readingTime`, and frontmatter fields including `title`, `date`, `description`, and optional `tags`.

The implementation should preserve the current card structure and styling from `src/app/blog/page.tsx`. Empty search should render the same post order as today.

---

### Task 1: Create the blog search client component

**Files:**
- Create: `src/components/BlogSearch.tsx`

- [ ] **Step 1: Create the client component with typed post metadata**

Create `src/components/BlogSearch.tsx` with this content:

```tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BlogSearchPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime: string;
  tags?: string[];
};

type BlogSearchProps = {
  posts: BlogSearchPost[];
};

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

function postMatchesQuery(post: BlogSearchPost, normalizedQuery: string) {
  if (normalizedQuery.length === 0) {
    return true;
  }

  const searchableText = [
    post.title,
    post.description,
    post.date,
    post.readingTime,
    ...(post.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export function BlogSearch({ posts }: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeSearchValue(query);

  const filteredPosts = useMemo(
    () => posts.filter((post) => postMatchesQuery(post, normalizedQuery)),
    [normalizedQuery, posts],
  );

  const isFiltering = normalizedQuery.length > 0;
  const resultLabel = isFiltering
    ? `${filteredPosts.length} ${filteredPosts.length === 1 ? "match" : "matches"}`
    : `${posts.length} ${posts.length === 1 ? "post" : "posts"}`;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_0_40px_rgba(34,197,94,0.08)]">
        <label htmlFor="blog-search" className="sr-only">
          Search blog posts
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts by title, topic, or tag..."
            className="min-h-11 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
          />
          <span className="text-sm text-slate-400" aria-live="polite">
            {resultLabel}
          </span>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.04]"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>/</span>
                <span>{post.readingTime}</span>
              </div>

              <h2 className="mb-3 text-2xl font-bold text-white group-hover:text-emerald-300">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="mb-4 text-slate-400">{post.description}</p>

              {post.tags && post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
          <p className="text-lg font-semibold text-white">No posts found</p>
          <p className="mt-2 text-sm text-slate-400">
            Try a different title, topic, or tag.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-5 rounded-full border border-emerald-400/30 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:border-emerald-300 hover:bg-emerald-400/10"
          >
            Clear search
          </button>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Run TypeScript against the new file**

Run:

```bash
npx tsc --noEmit
```

Expected: TypeScript may fail because `BlogSearch` is not wired into the page yet, but it must not report type errors inside `src/components/BlogSearch.tsx`.

- [ ] **Step 3: Commit the component**

Run:

```bash
git add src/components/BlogSearch.tsx
git diff --cached
git commit -m "feat(blog): add search component" -m "Create the client-side search UI and filtering behavior for blog post metadata." -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Wire search into the blog page

**Files:**
- Modify: `src/app/blog/page.tsx`

- [ ] **Step 1: Replace inline post-list rendering with `BlogSearch`**

Update `src/app/blog/page.tsx` to import and render the new component. The final file should be:

```tsx
import { BlogSearch } from "@/components/BlogSearch";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | Maksym Mishchenko",
  description: "Thoughts on software engineering, AI systems, and building products.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <p className="mb-4 font-mono text-sm text-emerald-400">$ ls ~/blog</p>
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Blog</h1>
          <p className="text-lg text-slate-400">
            Notes on engineering, AI, and the craft of building software.
          </p>
        </div>

        <BlogSearch posts={posts} />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint -- --quiet
```

Expected: PASS with no errors.

- [ ] **Step 3: Run TypeScript**

Run:

```bash
npx tsc --noEmit
```

Expected: PASS with no type errors. If there is a prop mismatch, adjust `BlogSearchPost` to match the actual return type from `getAllPosts()` without using `any`.

- [ ] **Step 4: Commit the page wiring**

Run:

```bash
git add src/app/blog/page.tsx src/components/BlogSearch.tsx
git diff --cached
git commit -m "feat(blog): enable post search" -m "Render the blog archive through the search component while preserving server-side post loading." -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Final verification and cleanup

**Files:**
- Verify: `src/app/blog/page.tsx`
- Verify: `src/components/BlogSearch.tsx`

- [ ] **Step 1: Run the full project checks**

Run:

```bash
npm run lint -- --quiet
npx tsc --noEmit
npm run build
```

Expected: all commands complete successfully. A known non-blocking Next.js build warning may appear, but the build must exit with status 0.

- [ ] **Step 2: Inspect the final diff**

Run:

```bash
git status --short
git log --oneline -5
```

Expected: working tree is clean after the task commits, and the latest commits are the blog search implementation commits.

- [ ] **Step 3: If any verification-only fix was needed, commit it**

Only run this if the checks required a small follow-up fix:

```bash
git add src/app/blog/page.tsx src/components/BlogSearch.tsx
git diff --cached
git commit -m "fix(blog): stabilize search verification" -m "Address verification feedback from lint, typecheck, or build for blog search." -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

Expected: no commit is created if no follow-up fix was necessary.

---

## Self-review

- Spec coverage: the plan keeps server loading in `src/app/blog/page.tsx`, adds a dependency-free client component, searches title/description/tags plus display metadata, preserves empty-query ordering, includes result count, zero-match state, clear action, and avoids clickable tag filters.
- Placeholder scan: no placeholders, deferred implementation notes, or unresolved requirements remain.
- Type consistency: `BlogSearchPost` contains the fields used by the component and matches the metadata returned by `getAllPosts()` as described in `src/lib/blog.ts`.
