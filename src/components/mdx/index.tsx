import type { MDXComponents } from "mdx/types";
import { Code } from "./Code";
import { ImageZoom } from "./ImageZoom";
import { Tokenizer } from "./interactive/Tokenizer";
import { FlowDiagram } from "./interactive/FlowDiagram";
import { Aside } from "./interactive/Aside";
import { EmbeddingSpace } from "./interactive/EmbeddingSpace";
import { Quiz } from "./interactive/Quiz";
import { BarChart } from "./interactive/BarChart";
import { CompareTable } from "./interactive/CompareTable";
import { Timeline } from "./interactive/Timeline";

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return extractText((children as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  }
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Heading({
  level,
  children,
}: {
  level: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}) {
  const id = slugify(extractText(children));
  const Tag = `h${level}` as const;
  const sizes: Record<number, string> = {
    1: "text-3xl font-bold mt-10 mb-4",
    2: "text-2xl font-bold mt-8 mb-3",
    3: "text-xl font-semibold mt-6 mb-2",
    4: "text-lg font-semibold mt-4 mb-2",
  };

  return (
    <Tag id={id} className={`${sizes[level]} font-heading scroll-mt-20 group`}>
      <a href={`#${id}`} className="no-underline hover:underline">
        {children}
      </a>
    </Tag>
  );
}

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => <Heading level={1}>{children}</Heading>,
  h2: ({ children }) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }) => <Heading level={4}>{children}</Heading>,
  p: ({ children }) => (
    <p className="text-muted leading-relaxed mb-4">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-accent hover:text-accent-hover underline underline-offset-4"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-4 space-y-2 text-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 text-muted">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-accent pl-4 my-4 italic text-muted">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => (
    <Code className={className}>{children as string}</Code>
  ),
  pre: ({ children }) => <>{children}</>,
  hr: () => <hr className="border-border my-8" />,
  Tokenizer,
  FlowDiagram,
  Aside,
  EmbeddingSpace,
  Quiz,
  CompareTable,
  Timeline,
  BarChart,
  img: ({ src, alt }) => <ImageZoom src={src} alt={alt} />,
};
