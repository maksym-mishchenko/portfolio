import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  project: string;
  date: string;
  tags: string[];
  outcome: string[];
  readingTime: string;
  content: string;
}

export type CaseStudyMeta = Omit<CaseStudy, "content">;

const CASE_STUDIES_DIR = path.join(process.cwd(), "content", "case-studies");

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

function stringField(data: Record<string, unknown>, key: string, slug: string): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Case study "${slug}" is missing required string field "${key}".`);
  }
  return value;
}

function stringArrayField(data: Record<string, unknown>, key: string, slug: string): string[] {
  const value = data[key];
  if (!Array.isArray(value) || value.length === 0 || !value.every((item) => typeof item === "string")) {
    throw new Error(`Case study "${slug}" is missing required string array field "${key}".`);
  }
  return value;
}

function dateField(data: Record<string, unknown>, key: string, slug: string): string {
  const value = stringField(data, key, slug);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new Error(`Case study "${slug}" has invalid date field "${key}". Expected YYYY-MM-DD.`);
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error(`Case study "${slug}" has invalid date field "${key}". Expected a valid YYYY-MM-DD date.`);
  }

  return value;
}

function readCaseStudyFile(filename: string): CaseStudy {
  const fileSlug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(CASE_STUDIES_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as Record<string, unknown>;
  const slug = stringField(frontmatter, "slug", fileSlug);

  if (slug !== fileSlug) {
    throw new Error(`Case study "${fileSlug}" has frontmatter slug "${slug}". Slug must match filename.`);
  }

  return {
    slug,
    title: stringField(frontmatter, "title", slug),
    summary: stringField(frontmatter, "summary", slug),
    project: stringField(frontmatter, "project", slug),
    date: dateField(frontmatter, "date", slug),
    tags: stringArrayField(frontmatter, "tags", slug),
    outcome: stringArrayField(frontmatter, "outcome", slug),
    readingTime: calculateReadingTime(content),
    content,
  };
}

export function getAllCaseStudies(): CaseStudyMeta[] {
  if (!fs.existsSync(CASE_STUDIES_DIR)) return [];

  return fs
    .readdirSync(CASE_STUDIES_DIR)
    .filter((filename) => filename.endsWith(".mdx"))
    .map(readCaseStudyFile)
    .map((study) => ({
      slug: study.slug,
      title: study.title,
      summary: study.summary,
      project: study.project,
      date: study.date,
      tags: study.tags,
      outcome: study.outcome,
      readingTime: study.readingTime,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  const filePath = path.join(CASE_STUDIES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return readCaseStudyFile(`${slug}.mdx`);
}

export function getAllCaseStudySlugs(): string[] {
  if (!fs.existsSync(CASE_STUDIES_DIR)) return [];

  return fs
    .readdirSync(CASE_STUDIES_DIR)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => filename.replace(/\.mdx$/, ""));
}
