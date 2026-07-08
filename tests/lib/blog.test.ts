import { describe, it, expect } from "vitest";
import {
  getAllPosts,
  getAllSlugs,
  getAllDraftPosts,
  getPostBySlug,
} from "@/lib/blog";

describe("blog library", () => {
  it("getAllPosts returns published, non-draft posts with required metadata", () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);

    for (const post of posts) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.date).toBeTruthy();
      // readingTime is derived from word count — always "N min read".
      expect(post.readingTime).toMatch(/^\d+ min read$/);
      expect(Array.isArray(post.tags)).toBe(true);
      // getAllPosts must exclude drafts and staged (published:false) posts.
      expect(post.draft).not.toBe(true);
      expect(post.published).not.toBe(false);
    }
  });

  it("getAllPosts is sorted by date, newest first", () => {
    const dates = getAllPosts().map((p) => new Date(p.date).getTime());
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  it("getAllSlugs is a superset of published post slugs with no duplicates", () => {
    const slugs = getAllSlugs();
    expect(slugs.every((s) => typeof s === "string" && s.length > 0)).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);

    const publishedSlugs = getAllPosts().map((p) => p.slug);
    for (const slug of publishedSlugs) {
      expect(slugs).toContain(slug);
    }
  });

  it("getPostBySlug returns full content for a known slug and null for unknown", () => {
    const first = getAllPosts()[0];
    const post = getPostBySlug(first.slug);
    expect(post).not.toBeNull();
    expect(post?.slug).toBe(first.slug);
    expect(typeof post?.content).toBe("string");
    expect(post?.content.length).toBeGreaterThan(0);

    expect(getPostBySlug("this-slug-does-not-exist-xyz")).toBeNull();
  });

  it("getAllDraftPosts returns an array disjoint from published posts", () => {
    const drafts = getAllDraftPosts();
    expect(Array.isArray(drafts)).toBe(true);

    const publishedSlugs = new Set(getAllPosts().map((p) => p.slug));
    for (const draft of drafts) {
      expect(draft.draft).toBe(true);
      expect(publishedSlugs.has(draft.slug)).toBe(false);
    }
  });
});
