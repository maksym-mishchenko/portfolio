import type { ReactNode } from "react";
import { slugifyHeading } from "@/lib/mdx-headings";
import { BarChart } from "@/components/mdx/interactive/BarChart";
import { FlowDiagram } from "@/components/mdx/interactive/FlowDiagram";
import { InteractiveFlow } from "@/components/mdx/interactive/InteractiveFlow";
import { Mermaid } from "@/components/mdx/interactive/Mermaid";
import { Aside } from "@/components/mdx/interactive/Aside";
import { EmbeddingSpace } from "@/components/mdx/interactive/EmbeddingSpace";
import { Quiz } from "@/components/mdx/interactive/Quiz";
import { CompareTable } from "@/components/mdx/interactive/CompareTable";
import { Timeline } from "@/components/mdx/interactive/Timeline";
import { Tokenizer } from "@/components/mdx/interactive/Tokenizer";

interface BlogPostBodyProps {
  content: string;
}

type PropValue = string | number | boolean;
type ComponentProps = Record<string, PropValue>;

interface MdxComponentBlock {
  name: string;
  props: ComponentProps;
  children: string;
  raw: string;
}

function isSpecialLine(line: string): boolean {
  const trimmed = line.trim();

  return (
    trimmed === "" ||
    trimmed === "---" ||
    trimmed.startsWith("```") ||
    /^#{1,4}\s+/.test(trimmed) ||
    /^[-*]\s+/.test(trimmed) ||
    /^\d+\.\s+/.test(trimmed) ||
    trimmed.startsWith("> ") ||
    /^<[A-Z][A-Za-z0-9]*/.test(trimmed)
  );
}

function parsePropValue(value: string): PropValue {
  if (value === "true") return true;
  if (value === "false") return false;

  const numberValue = Number(value);
  if (value.trim() !== "" && Number.isFinite(numberValue)) return numberValue;

  return value;
}

function parseProps(tag: string, componentName: string): ComponentProps {
  const body = tag
    .replace(new RegExp(`^<${componentName}\\b`), "")
    .replace(/\/?>$/, "")
    .trim();
  const props: ComponentProps = {};
  let index = 0;

  while (index < body.length) {
    while (/\s/.test(body[index] ?? "")) index += 1;

    const keyMatch = /^[A-Za-z][A-Za-z0-9]*/.exec(body.slice(index));
    if (!keyMatch) break;

    const key = keyMatch[0];
    index += key.length;
    while (/\s/.test(body[index] ?? "")) index += 1;

    if (body[index] !== "=") {
      props[key] = true;
      continue;
    }

    index += 1;
    while (/\s/.test(body[index] ?? "")) index += 1;

    const quote = body[index];
    if (quote === "'" || quote === "\"") {
      index += 1;
      const valueStart = index;
      while (index < body.length) {
        const current = body[index];
        const next = body[index + 1];
        if (current === quote && (next === undefined || /\s|\/|>/.test(next))) break;
        index += 1;
      }
      props[key] = body.slice(valueStart, index);
      index += 1;
      continue;
    }

    if (quote === "{") {
      index += 1;
      const valueStart = index;
      while (index < body.length && body[index] !== "}") index += 1;
      props[key] = parsePropValue(body.slice(valueStart, index).trim());
      index += 1;
      continue;
    }

    const valueStart = index;
    while (index < body.length && !/\s/.test(body[index] ?? "")) index += 1;
    props[key] = parsePropValue(body.slice(valueStart, index));
  }

  return props;
}

function readMdxComponent(lines: string[], startIndex: number): { block: MdxComponentBlock; nextIndex: number } {
  const firstLine = lines[startIndex]?.trim() ?? "";
  const name = /^<([A-Z][A-Za-z0-9]*)/.exec(firstLine)?.[1] ?? "";
  const collected: string[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    collected.push(line);
    index += 1;

    if (line.trim().endsWith("/>")) {
      const openingTag = collected.join("\n");
      return {
        block: {
          name,
          props: parseProps(openingTag.trim(), name),
          children: "",
          raw: openingTag,
        },
        nextIndex: index,
      };
    }

    if (line.trim().endsWith(">")) break;
  }

  const openingTag = collected.join("\n");
  const children: string[] = [];

  while (index < lines.length) {
    const line = lines[index] ?? "";
    index += 1;

    if (line.trim() === `</${name}>`) {
      return {
        block: {
          name,
          props: parseProps(openingTag.trim(), name),
          children: children.join("\n"),
          raw: [...collected, ...children, line].join("\n"),
        },
        nextIndex: index,
      };
    }

    children.push(line);
  }

  return {
    block: {
      name,
      props: parseProps(openingTag.trim(), name),
      children: children.join("\n"),
      raw: [...collected, ...children].join("\n"),
    },
    nextIndex: index,
  };
}

function stringProp(props: ComponentProps, key: string): string | undefined {
  const value = props[key];
  return typeof value === "string" ? value : undefined;
}

function numberProp(props: ComponentProps, key: string): number | undefined {
  const value = props[key];
  return typeof value === "number" ? value : undefined;
}

function booleanProp(props: ComponentProps, key: string): boolean | undefined {
  const value = props[key];
  return typeof value === "boolean" ? value : undefined;
}

function renderMdxComponent(block: MdxComponentBlock, key: string): ReactNode {
  switch (block.name) {
    case "Aside":
      return (
        <Aside key={key} title={stringProp(block.props, "title") ?? "Note"}>
          <BlogPostBody content={block.children} />
        </Aside>
      );
    case "BarChart":
      return (
        <BarChart
          key={key}
          bars={stringProp(block.props, "bars") ?? stringProp(block.props, "data") ?? "[]"}
          title={stringProp(block.props, "title")}
          caption={stringProp(block.props, "caption")}
        />
      );
    case "CompareTable":
      return (
        <CompareTable
          key={key}
          headers={stringProp(block.props, "headers") ?? "[]"}
          rows={stringProp(block.props, "rows") ?? "[]"}
          highlight={stringProp(block.props, "highlight")}
        />
      );
    case "EmbeddingSpace":
      return (
        <EmbeddingSpace
          key={key}
          words={stringProp(block.props, "words") ?? "[]"}
          connections={stringProp(block.props, "connections")}
          width={numberProp(block.props, "width")}
          height={numberProp(block.props, "height")}
        />
      );
    case "FlowDiagram":
      return (
        <FlowDiagram
          key={key}
          steps={stringProp(block.props, "steps") ?? "[]"}
          speed={numberProp(block.props, "speed")}
          loop={booleanProp(block.props, "loop")}
        />
      );
    case "InteractiveFlow":
      return (
        <InteractiveFlow
          key={key}
          nodes={stringProp(block.props, "nodes") ?? "[]"}
          edges={stringProp(block.props, "edges") ?? "[]"}
          height={stringProp(block.props, "height")}
          minimap={booleanProp(block.props, "minimap")}
          controls={booleanProp(block.props, "controls")}
          interactive={booleanProp(block.props, "interactive")}
          fitView={booleanProp(block.props, "fitView")}
        />
      );
    case "Mermaid":
      return <Mermaid key={key} chart={stringProp(block.props, "chart") ?? block.children.trim()} />;
    case "Quiz":
      return (
        <Quiz
          key={key}
          question={stringProp(block.props, "question") ?? ""}
          options={stringProp(block.props, "options") ?? "[]"}
          answer={stringProp(block.props, "answer") ?? ""}
          explanation={stringProp(block.props, "explanation")}
        />
      );
    case "Timeline":
      return <Timeline key={key} events={stringProp(block.props, "events") ?? "[]"} />;
    case "Tokenizer":
      return (
        <Tokenizer
          key={key}
          text={stringProp(block.props, "text") ?? ""}
          tokens={stringProp(block.props, "tokens") ?? "[]"}
          tokenIds={stringProp(block.props, "tokenIds") ?? "[]"}
          speed={numberProp(block.props, "speed")}
        />
      );
    default:
      return (
        <pre key={key} className="my-6 overflow-x-auto rounded-xl border border-border bg-surface p-4 text-sm text-muted">
          <code>{block.raw}</code>
        </pre>
      );
  }
}

function renderInlineText(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`${part}-${index}`} className="rounded bg-surface px-1.5 py-0.5 text-sm text-accent">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>;
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      const isExternal = href.startsWith("http");
      return (
        <a
          key={`${href}-${index}`}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-accent hover:text-accent-hover underline underline-offset-4"
        >
          {label}
        </a>
      );
    }

    return part;
  });
}

function renderHeading(line: string, key: string): ReactNode {
  const match = /^(#{1,4})\s+(.+)$/.exec(line.trim());
  if (!match) return null;

  const level = match[1].length;
  const text = match[2];
  const id = slugifyHeading(text);
  const sizes: Record<number, string> = {
    1: "text-3xl font-bold mt-10 mb-4",
    2: "text-2xl font-bold mt-8 mb-3",
    3: "text-xl font-semibold mt-6 mb-2",
    4: "text-lg font-semibold mt-4 mb-2",
  };
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";

  return (
    <Tag key={key} id={id} className={`${sizes[level]} font-heading scroll-mt-20 group`}>
      <a href={`#${id}`} className="no-underline hover:underline">
        {renderInlineText(text)}
      </a>
    </Tag>
  );
}

function renderBlocks(content: string): ReactNode[] {
  const lines = content.trim().split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    const trimmed = line.trim();
    const key = `${index}-${trimmed}`;

    if (trimmed === "") {
      index += 1;
      continue;
    }

    if (trimmed === "---") {
      blocks.push(<hr key={key} className="border-border my-8" />);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      const code: string[] = [];
      index += 1;

      while (index < lines.length && !(lines[index] ?? "").trim().startsWith("```")) {
        code.push(lines[index] ?? "");
        index += 1;
      }

      if (index < lines.length) index += 1;

      blocks.push(
        <div key={key} className="relative group my-6">
          <pre className="bg-surface border border-border rounded-xl p-4 overflow-x-auto text-sm leading-relaxed whitespace-pre">
            <code className="whitespace-pre font-mono" data-language={language || undefined}>
              {code.join("\n")}
            </code>
          </pre>
        </div>
      );
      continue;
    }

    if (/^<[A-Z][A-Za-z0-9]*/.test(trimmed)) {
      const { block, nextIndex } = readMdxComponent(lines, index);
      blocks.push(renderMdxComponent(block, key));
      index = nextIndex;
      continue;
    }

    if (/^#{1,4}\s+/.test(trimmed)) {
      blocks.push(renderHeading(trimmed, key));
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test((lines[index] ?? "").trim())) {
        items.push((lines[index] ?? "").trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }

      blocks.push(
        <ul key={key} className="list-disc pl-6 mb-4 space-y-2 text-muted">
          {items.map((item) => (
            <li key={item} className="leading-relaxed pl-1">
              {renderInlineText(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test((lines[index] ?? "").trim())) {
        items.push((lines[index] ?? "").trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }

      blocks.push(
        <ol key={key} className="list-decimal pl-6 mb-4 space-y-2 text-muted">
          {items.map((item) => (
            <li key={item} className="leading-relaxed pl-1">
              {renderInlineText(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (trimmed.startsWith("> ")) {
      const quote: string[] = [];
      while (index < lines.length && (lines[index] ?? "").trim().startsWith("> ")) {
        quote.push((lines[index] ?? "").trim().replace(/^>\s?/, ""));
        index += 1;
      }

      blocks.push(
        <blockquote key={key} className="border-l-4 border-accent pl-4 my-4 italic text-muted">
          {renderInlineText(quote.join(" "))}
        </blockquote>
      );
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && !isSpecialLine(lines[index] ?? "")) {
      paragraph.push((lines[index] ?? "").trim());
      index += 1;
    }

    blocks.push(
      <p key={key} className="text-muted leading-relaxed mb-4">
        {renderInlineText(paragraph.join(" "))}
      </p>
    );
  }

  return blocks;
}

export function BlogPostBody({ content }: BlogPostBodyProps) {
  return <>{renderBlocks(content)}</>;
}
