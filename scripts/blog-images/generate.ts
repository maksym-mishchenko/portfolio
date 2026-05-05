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

// Branding colors — Cyber/Technical aesthetic
const COLORS = {
  bg: "#0a0a0f",
  bgGradientEnd: "#0f0f1a",
  card: "#12121f",
  cardHighlight: "#161628",
  accent: "#6366f1",
  accentGlow: "#818cf820",
  green: "#10b981",
  greenGlow: "#10b98118",
  red: "#f43f5e",
  redGlow: "#f43f5e18",
  orange: "#f59e0b",
  text: "#f8fafc",
  muted: "#94a3b8",
  dim: "#475569",
  border: "#1e293b",
  borderLight: "#334155",
};

// Load fonts
const fontRegular = readFileSync(FONT_PATH);
const fontBold = readFileSync(FONT_BOLD_PATH);

// Load avatar as base64 PNG (convert from webp)
async function getAvatarBase64(): Promise<string> {
  const pngBuffer = await sharp(AVATAR_PATH)
    .resize(128, 128)
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
        paddingTop: 16,
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
                  width: 32,
                  height: 32,
                  style: { borderRadius: "50%", border: `2px solid ${COLORS.border}` },
                },
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    { type: "span", props: { style: { color: COLORS.text, fontSize: 13, fontWeight: 600 }, children: "Maksym Mishchenko" } },
                    { type: "span", props: { style: { color: COLORS.dim, fontSize: 11 }, children: BLOG_URL } },
                  ],
                },
              },
            ],
          },
        },
        {
          type: "span",
          props: {
            style: { color: COLORS.dim, fontSize: 11, fontStyle: "italic" },
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
        background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.bgGradientEnd} 100%)`,
        padding: "40px 48px",
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: { color: COLORS.accent, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, display: "flex" },
            children: title,
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: 14, flex: 1, justifyContent: "center" },
            children: steps.flatMap((step, i) => {
              const isHighlight = step.highlight;
              const box = {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "22px 24px",
                    background: isHighlight ? COLORS.greenGlow : COLORS.card,
                    border: `1px solid ${isHighlight ? COLORS.green : COLORS.border}`,
                    borderRadius: 12,
                    width: 230,
                  },
                  children: [
                    { type: "span", props: { style: { color: isHighlight ? COLORS.green : COLORS.accent, fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 6, display: "flex" }, children: step.year } },
                    { type: "span", props: { style: { color: COLORS.text, fontSize: 18, fontWeight: 700, marginBottom: 6, display: "flex" }, children: step.title } },
                    { type: "span", props: { style: { color: COLORS.muted, fontSize: 12, textAlign: "center", display: "flex" }, children: step.subtitle } },
                  ],
                },
              };
              if (i < steps.length - 1) {
                return [box, { type: "div", props: { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }, children: [
                  { type: "div", props: { style: { width: 20, height: 1, background: COLORS.borderLight, display: "flex" }, children: "" } },
                  { type: "span", props: { style: { color: COLORS.dim, fontSize: 14, display: "flex" }, children: "›" } },
                  { type: "div", props: { style: { width: 20, height: 1, background: COLORS.borderLight, display: "flex" }, children: "" } },
                ] } }];
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
    const isAfter = side === "after";
    const glowBg = isAfter ? COLORS.greenGlow : COLORS.redGlow;
    return {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "26px 28px",
          background: glowBg,
          border: `1px solid ${color}30`,
          borderRadius: 16,
          gap: 12,
          justifyContent: "center",
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 },
              children: [
                { type: "div", props: { style: { width: 8, height: 8, borderRadius: "50%", background: color, display: "flex" }, children: "" } },
                { type: "span", props: { style: { color, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", display: "flex" }, children: data.title } },
              ],
            },
          },
          { type: "div", props: { style: { color: COLORS.muted, fontSize: 13, marginBottom: 4, display: "flex" }, children: data.subtitle } },
          ...data.items.map((item, i) => ({
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                background: COLORS.card,
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
              },
              children: [
                { type: "span", props: { style: { color: COLORS.text, fontSize: 14, display: "flex" }, children: `${i + 1}. ${item.text}` } },
                { type: "span", props: { style: { color: COLORS.dim, fontSize: 13, fontWeight: 600, display: "flex" }, children: item.time } },
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
        background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.bgGradientEnd} 100%)`,
        padding: "40px 48px",
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: { color: COLORS.accent, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 8, display: "flex" },
            children: "WORKFLOW EVOLUTION",
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", gap: 24, flex: 1, alignItems: "stretch" },
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
        background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.bgGradientEnd} 100%)`,
        padding: "40px 48px",
        fontFamily: "Inter",
      },
      children: [
        { type: "div", props: { style: { color: COLORS.accent, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, display: "flex" }, children: title } },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center", gap: 14 },
            children: [
              // Input
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: 12 },
                  children: [
                    { type: "span", props: { style: { color: COLORS.orange, fontSize: 12, fontWeight: 700, letterSpacing: 1, display: "flex" }, children: "INPUT" } },
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", padding: "12px 24px", background: COLORS.card, border: `1px solid ${COLORS.orange}60`, borderRadius: 12 },
                        children: [{ type: "span", props: { style: { color: COLORS.text, fontSize: 15, display: "flex" }, children: input.text } }],
                      },
                    },
                  ],
                },
              },
              // Connector
              { type: "div", props: { style: { width: 1, height: 16, background: COLORS.borderLight, display: "flex" }, children: "" } },
              // Steps row
              {
                type: "div",
                props: {
                  style: { display: "flex", gap: 10, alignItems: "center" },
                  children: steps.flatMap((step, i) => {
                    const box = {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 20px", background: COLORS.card, border: `1px solid ${COLORS.accent}40`, borderRadius: 12, width: 200 },
                        children: [
                          { type: "span", props: { style: { fontSize: 15, fontWeight: 700, color: COLORS.text, display: "flex" }, children: step.title } },
                          { type: "span", props: { style: { fontSize: 12, color: COLORS.muted, marginTop: 4, display: "flex" }, children: step.subtitle } },
                        ],
                      },
                    };
                    if (i < steps.length - 1) return [box, { type: "div", props: { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }, children: [
                      { type: "div", props: { style: { width: 16, height: 1, background: COLORS.accent, display: "flex" }, children: "" } },
                      { type: "span", props: { style: { color: COLORS.accent, fontSize: 12, display: "flex" }, children: "›" } },
                    ] } }];
                    return [box];
                  }),
                },
              },
              // Connector
              { type: "div", props: { style: { width: 1, height: 16, background: COLORS.borderLight, display: "flex" }, children: "" } },
              // Outputs row
              {
                type: "div",
                props: {
                  style: { display: "flex", gap: 12 },
                  children: outputs.map((out) => ({
                    type: "div",
                    props: {
                      style: { display: "flex", padding: "10px 20px", background: COLORS.greenGlow, border: `1px solid ${COLORS.green}40`, borderRadius: 10 },
                      children: [{ type: "span", props: { style: { color: COLORS.green, fontSize: 14, fontWeight: 600, display: "flex" }, children: out } }],
                    },
                  })),
                },
              },
            ],
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
    380,
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
    460,
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
    440,
    "prompt-flow.png"
  );

  console.log("\n🎉 All blog images generated!");
}

main().catch(console.error);
