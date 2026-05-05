import satori from "satori";
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Config ---
const ROOT = join(__dirname, "../..");
const OUT_DIR = join(ROOT, "public/images/blog");
const FONT_PATH = join(__dirname, "Inter-Regular.ttf");
const FONT_BOLD_PATH = join(__dirname, "Inter-Bold.ttf");
const AVATAR_PATH = join(ROOT, "public/avatar.webp");
const BLOG_URL = "mmishchenko.dev";

// Branding colors
const COLORS = {
  bg: "#0a0a0a",
  card: "#1a1a2e",
  cardHighlight: "#16213e",
  accent: "#3b82f6",
  green: "#22c55e",
  red: "#ef4444",
  orange: "#f59e0b",
  text: "#fafafa",
  muted: "#a1a1aa",
  dim: "#71717a",
  border: "#27272a",
};

// Load fonts
const fontRegular = readFileSync(FONT_PATH);
const fontBold = readFileSync(FONT_BOLD_PATH);

// Load avatar as base64 PNG (convert from webp)
async function getAvatarBase64(): Promise<string> {
  const pngBuffer = await sharp(AVATAR_PATH)
    .resize(48, 48)
    .png()
    .toBuffer();
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}

// --- Branding Footer ---
function BrandingFooter({ avatar }: { avatar: string }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingTop: 20,
        borderTop: `1px solid ${COLORS.border}`,
        marginTop: "auto",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: 12 },
            children: [
              {
                type: "img",
                props: {
                  src: avatar,
                  width: 36,
                  height: 36,
                  style: { borderRadius: "50%" },
                },
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: { color: COLORS.text, fontSize: 14, fontWeight: 700 },
                        children: "Maksym Mishchenko",
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: { color: COLORS.muted, fontSize: 12 },
                        children: BLOG_URL,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          type: "span",
          props: {
            style: { color: COLORS.dim, fontSize: 12 },
            children: "Built with AI agents",
          },
        },
      ],
    },
  };
}

// --- Templates ---

interface TimelineStep {
  year: string;
  emoji: string;
  title: string;
  subtitle: string;
  highlight?: boolean;
}

function TimelineTemplate({ title, steps, avatar }: { title: string; steps: TimelineStep[]; avatar: string }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: COLORS.bg,
        padding: 48,
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: { color: COLORS.muted, fontSize: 16, letterSpacing: 2, textTransform: "uppercase", marginBottom: 32, display: "flex" },
            children: title,
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: 16, flex: 1, justifyContent: "center" },
            children: steps.flatMap((step, i) => {
              const box = {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px 24px",
                    background: step.highlight ? COLORS.green + "22" : COLORS.card,
                    border: `2px solid ${step.highlight ? COLORS.green : COLORS.border}`,
                    borderRadius: 12,
                    minWidth: 180,
                  },
                  children: [
                    { type: "span", props: { style: { color: COLORS.accent, fontSize: 12, marginBottom: 4, display: "flex" }, children: step.year } },
                    { type: "span", props: { style: { color: COLORS.text, fontSize: 18, fontWeight: 700, marginBottom: 4, display: "flex" }, children: `${step.emoji} ${step.title}` } },
                    { type: "span", props: { style: { color: COLORS.muted, fontSize: 13, textAlign: "center", display: "flex" }, children: step.subtitle } },
                  ],
                },
              };
              if (i < steps.length - 1) {
                return [box, { type: "span", props: { style: { color: COLORS.dim, fontSize: 24, display: "flex" }, children: "→" } }];
              }
              return [box];
            }),
          },
        },
        BrandingFooter({ avatar }),
      ],
    },
  };
}

interface ComparisonItem {
  text: string;
  time: string;
}

function ComparisonTemplate({ before, after, avatar }: { before: { title: string; subtitle: string; items: ComparisonItem[] }; after: { title: string; subtitle: string; items: ComparisonItem[] }; avatar: string }) {
  function Column({ data, color, side }: { data: typeof before; color: string; side: string }) {
    return {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: 24,
          background: side === "before" ? COLORS.card : COLORS.green + "11",
          border: `2px solid ${color}33`,
          borderRadius: 12,
          gap: 12,
        },
        children: [
          { type: "div", props: { style: { color, fontSize: 20, fontWeight: 700, marginBottom: 4, display: "flex" }, children: data.title } },
          { type: "div", props: { style: { color: COLORS.muted, fontSize: 13, marginBottom: 8, display: "flex" }, children: data.subtitle } },
          ...data.items.map((item, i) => ({
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                background: COLORS.bg,
                borderRadius: 8,
                border: `1px solid ${color}22`,
              },
              children: [
                { type: "span", props: { style: { color: COLORS.text, fontSize: 14, display: "flex" }, children: `${i + 1}. ${item.text}` } },
                { type: "span", props: { style: { color: COLORS.dim, fontSize: 13, display: "flex" }, children: item.time } },
              ],
            },
          })),
        ],
      },
    };
  }

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: COLORS.bg,
        padding: 48,
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", gap: 24, flex: 1 },
            children: [
              Column({ data: before, color: COLORS.red, side: "before" }),
              Column({ data: after, color: COLORS.green, side: "after" }),
            ],
          },
        },
        BrandingFooter({ avatar }),
      ],
    },
  };
}

interface FlowStep {
  emoji: string;
  title: string;
  subtitle: string;
}

function FlowTemplate({ title, input, steps, outputs, avatar }: { title: string; input: { emoji: string; text: string }; steps: FlowStep[]; outputs: string[]; avatar: string }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: COLORS.bg,
        padding: 48,
        fontFamily: "Inter",
      },
      children: [
        { type: "div", props: { style: { color: COLORS.muted, fontSize: 16, letterSpacing: 2, textTransform: "uppercase", marginBottom: 24, display: "flex" }, children: title } },
        // Input
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", marginBottom: 20 },
            children: [
              { type: "span", props: { style: { color: COLORS.orange, fontSize: 12, marginRight: 12, display: "flex" }, children: "YOU" } },
              {
                type: "div",
                props: {
                  style: { display: "flex", padding: "12px 20px", background: COLORS.card, border: `2px solid ${COLORS.orange}`, borderRadius: 8 },
                  children: [{ type: "span", props: { style: { color: COLORS.text, fontSize: 15, display: "flex" }, children: `${input.emoji} ${input.text}` } }],
                },
              },
            ],
          },
        },
        // Arrow down
        { type: "div", props: { style: { color: COLORS.dim, fontSize: 20, marginLeft: 60, marginBottom: 12, display: "flex" }, children: "↓" } },
        // Steps row
        {
          type: "div",
          props: {
            style: { display: "flex", gap: 12, alignItems: "center", marginBottom: 20 },
            children: steps.flatMap((step, i) => {
              const box = {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 18px", background: COLORS.cardHighlight, border: `1px solid ${COLORS.accent}`, borderRadius: 8, minWidth: 140 },
                  children: [
                    { type: "span", props: { style: { fontSize: 15, fontWeight: 700, color: COLORS.text, display: "flex" }, children: `${step.emoji} ${step.title}` } },
                    { type: "span", props: { style: { fontSize: 11, color: COLORS.muted, marginTop: 4, display: "flex" }, children: step.subtitle } },
                  ],
                },
              };
              if (i < steps.length - 1) return [box, { type: "span", props: { style: { color: COLORS.accent, fontSize: 18, display: "flex" }, children: "→" } }];
              return [box];
            }),
          },
        },
        // Arrow down
        { type: "div", props: { style: { color: COLORS.dim, fontSize: 20, marginLeft: 60, marginBottom: 12, display: "flex" }, children: "↓" } },
        // Outputs row
        {
          type: "div",
          props: {
            style: { display: "flex", gap: 12 },
            children: outputs.map((out) => ({
              type: "div",
              props: {
                style: { display: "flex", padding: "10px 18px", background: COLORS.green + "22", border: `1px solid ${COLORS.green}`, borderRadius: 8 },
                children: [{ type: "span", props: { style: { color: COLORS.green, fontSize: 14, fontWeight: 600, display: "flex" }, children: out } }],
              },
            })),
          },
        },
        BrandingFooter({ avatar }),
      ],
    },
  };
}

// --- Image Generation ---
async function generateImage(template: any, width: number, height: number, filename: string) {
  const svg = await satori(template, {
    width,
    height,
    fonts: [
      { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
      { name: "Inter", data: fontBold, weight: 700, style: "normal" },
    ],
  });

  // Generate at 2x for retina
  const png = await sharp(Buffer.from(svg))
    .resize(width * 2, height * 2)
    .png({ quality: 90 })
    .toBuffer();

  const outPath = join(OUT_DIR, filename);
  writeFileSync(outPath, png);
  console.log(`✅ ${filename} (${width}x${height} @2x → ${(png.length / 1024).toFixed(0)}KB)`);
}

// --- Main ---
async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const avatar = await getAvatarBase64();

  // 1. Evolution Timeline
  await generateImage(
    TimelineTemplate({
      title: "How I Got Here",
      avatar,
      steps: [
        { year: "2023", emoji: "", title: "ChatGPT", subtitle: "Copy → Paste → Pray", highlight: false },
        { year: "2024", emoji: "", title: "Copilot Chat", subtitle: "IDE context helped", highlight: false },
        { year: "2025", emoji: "", title: "Copilot CLI", subtitle: "Runs commands, full repo", highlight: false },
        { year: "NOW", emoji: "", title: "Multi-Agent", subtitle: "CLI + OpenClaw + OpenCode", highlight: true },
      ],
    }),
    1400,
    500,
    "evolution.png"
  );

  // 2. Before/After Comparison
  await generateImage(
    ComparisonTemplate({
      avatar,
      before: {
        title: "✗ Before",
        subtitle: "~45 min per feature",
        items: [
          { text: "Google → StackOverflow → copy code", time: "5 min" },
          { text: 'Paste into ChatGPT → "adapt this for me"', time: "10 min" },
          { text: "Copy output → paste into VS Code → debug", time: "20 min" },
          { text: "Manually commit, push, deploy, test", time: "10 min" },
        ],
      },
      after: {
        title: "✓ After",
        subtitle: "~8 min per feature",
        items: [
          { text: "Describe what I need in terminal", time: "1 min" },
          { text: "Copilot CLI edits files + runs tests", time: "3 min" },
          { text: "Review diff → approve → auto-commit", time: "2 min" },
          { text: "Push + deploy (one command)", time: "2 min" },
        ],
      },
    }),
    1400,
    560,
    "before-after.png"
  );

  // 3. Prompt Flow
  await generateImage(
    FlowTemplate({
      title: "From Prompt to Working Code",
      avatar,
      input: { emoji: ">", text: '"Add pagination to the /positions API"' },
      steps: [
        { emoji: "1.", title: "Read Codebase", subtitle: "grep, LSP, file analysis" },
        { emoji: "2.", title: "Plan Changes", subtitle: "rubber-duck → validate" },
        { emoji: "3.", title: "Edit Files", subtitle: "surgical code changes" },
        { emoji: "4.", title: "Test", subtitle: "run existing tests" },
      ],
      outputs: ["Git Commit", "PR Ready", "Deployed"],
    }),
    1400,
    600,
    "prompt-flow.png"
  );

  console.log("\n🎉 All blog images generated!");
}

main().catch(console.error);
