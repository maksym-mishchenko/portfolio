import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BUNDLED_BLOG_POSTS } from "./blog.generated";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: string;
  content: string;
  draft?: boolean;
  /** published: false hides from index/RSS/sitemap but keeps the URL live (staged post) */
  published?: boolean;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: string;
  draft?: boolean;
  published?: boolean;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

type BlogPostSource = {
  slug: string;
  raw: string;
};

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

function stringField(data: Record<string, unknown>, key: string, fallback: string): string {
  const value = data[key];
  return typeof value === "string" ? value : fallback;
}

function stringArrayField(data: Record<string, unknown>, key: string): string[] {
  const value = data[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function toPost(source: BlogPostSource): BlogPost {
  const { data, content } = matter(source.raw);
  const frontmatter = data as Record<string, unknown>;

  return {
    slug: source.slug,
    title: stringField(frontmatter, "title", source.slug),
    date: stringField(frontmatter, "date", ""),
    description: stringField(frontmatter, "description", ""),
    tags: stringArrayField(frontmatter, "tags"),
    readingTime: calculateReadingTime(content),
    content,
    draft: frontmatter.draft === true,
    // published defaults to true; explicit false = staged (hidden from index)
    published: frontmatter.published !== false,
  };
}

function toPostMeta(post: BlogPost): BlogPostMeta {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    description: post.description,
    tags: post.tags,
    readingTime: post.readingTime,
    draft: post.draft,
    published: post.published,
  };
}

function readPostFile(filename: string): BlogPost {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
  return toPost({ slug, raw });
}

function getAllPostSources(): BlogPostSource[] {
  if (!fs.existsSync(BLOG_DIR)) return BUNDLED_BLOG_POSTS;

  const filenames = fs.readdirSync(BLOG_DIR).filter((filename) => filename.endsWith(".mdx"));
  if (filenames.length === 0) return BUNDLED_BLOG_POSTS;

  return filenames.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    return { slug, raw };
  });
}

function getAllPostsIncludingDrafts(): BlogPostMeta[] {
  const posts = getAllPostSources()
    .map(toPost)
    .map(toPostMeta)
    .filter((post) => post.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getAllPosts(): BlogPostMeta[] {
  return getAllPostsIncludingDrafts().filter((post) => !post.draft && post.published !== false);
}

export function getAllDraftPosts(): BlogPostMeta[] {
  return getAllPostsIncludingDrafts().filter((post) => post.draft);
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (fs.existsSync(filePath)) return readPostFile(`${slug}.mdx`);

  const bundledPost = BUNDLED_BLOG_POSTS.find((post) => post.slug === slug);
  return bundledPost ? toPost(bundledPost) : null;
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return BUNDLED_BLOG_POSTS.map((post) => post.slug);

  const filenames = fs.readdirSync(BLOG_DIR).filter((filename) => filename.endsWith(".mdx"));
  if (filenames.length === 0) return BUNDLED_BLOG_POSTS.map((post) => post.slug);

  return filenames.map((filename) => filename.replace(/\.mdx$/, ""));
}
