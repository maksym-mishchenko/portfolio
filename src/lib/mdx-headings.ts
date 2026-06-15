export interface MdxHeading {
  id: string;
  text: string;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function extractSecondLevelHeadings(content: string): MdxHeading[] {
  return content
    .split("\n")
    .map((line) => /^##\s+(.+)$/.exec(line.trim())?.[1])
    .filter((heading): heading is string => Boolean(heading))
    .map((heading) => ({
      id: slugifyHeading(heading),
      text: heading,
    }));
}
