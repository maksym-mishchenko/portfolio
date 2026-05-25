import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: string;
  content: string;
  draft?: boolean;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: string;
  draft?: boolean;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

function getAllPostsIncludingDrafts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data, content } = matter(raw);

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        description: data.description ?? "",
        tags: data.tags ?? [],
        readingTime: calculateReadingTime(content),
        draft: data.draft === true,
      };
    })
    .filter((post) => post.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getAllPosts(): BlogPostMeta[] {
  return getAllPostsIncludingDrafts().filter((post) => !post.draft);
}

export function getAllDraftPosts(): BlogPostMeta[] {
  return getAllPostsIncludingDrafts().filter((post) => post.draft);
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    description: data.description ?? "",
    tags: data.tags ?? [],
    readingTime: calculateReadingTime(content),
    content,
    draft: data.draft === true,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
