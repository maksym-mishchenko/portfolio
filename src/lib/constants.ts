export const SITE = {
  name: "Maksym Mishchenko",
  title: "Software Engineer II @ Microsoft Security",
  status: "Software Engineer II @ Microsoft Security",
  url: "https://mmishchenko.dev",
  image: "https://mmishchenko.dev/avatar.webp",
  location: "Prague, Czechia",
  github: "https://github.com/maksym-mishchenko",
  linkedin: "https://linkedin.com/in/maksym-mishchenko-1036381b8",
  email: "mailto:maksym@mmishchenko.dev",
} as const;

export interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  thumbnail?: string;
  learned?: string;
  resume?: boolean;
  caseStudySlug?: string;
}

export const PROJECTS: Project[] = [
  {
    title: "mcpgate",
    description:
      "Security gateway for MCP tool calls with policy enforcement, audit trails, and reverse-channel prompt-injection defenses.",
    tech: ["Go", "MCP", "AI Security", "SQLite"],
    github: "https://github.com/maksym-mishchenko/mcpgate",
    featured: true,
    learned: "Agent tool output is untrusted input; security controls need to inspect both result and error channels.",
    caseStudySlug: "mcpgate-v1-1",
  },
  {
    title: "mmishchenko.dev",
    description:
      "This portfolio — built with Next.js 16, MDX blog with interactive animated components, RSS feed, and automated devlog publishing pipeline.",
    tech: ["Next.js", "MDX", "Tailwind CSS", "Framer Motion"],
    live: "https://mmishchenko.dev",
    github: "https://github.com/maksym-mishchenko/portfolio",
    thumbnail: "/images/portfolio/mmishchenko-dev.svg",
    learned: "MDX pipelines, satori OG image generation, and print-optimized resume rendering.",
  },
  {
    title: "Investing Treasure Map",
    description:
      "Stranger Things-themed interactive guide to investing basics — built for my English teacher who was curious how to start investing.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    live: "https://investing.mmishchenko.dev",
    github: "https://github.com/maksym-mishchenko/investing-treasure-map",
    thumbnail: "/images/portfolio/investing-treasure-map.svg",
    learned: "Gamification UX patterns and making complex financial concepts accessible.",
    resume: false,
  },
];

export interface JourneyNode {
  year: string;
  icon: string;
  title: string;
  detail: string;
  achievements?: string[];
  link?: string;
  resumeHide?: boolean;
}

export const JOURNEY: JourneyNode[] = [
  {
    year: "2016",
    icon: "🇺🇦",
    title: "Ukraine → Czechia",
    detail: "Moved to study Computer Science",
  },
  {
    year: "2016–2020",
    icon: "🎓",
    title: "BSc Computer Science",
    detail: "Technical University of Ostrava",
  },
  {
    year: "2019",
    icon: "💼",
    title: "Stora Enso",
    detail: "Java Developer — invoice processing, land management systems",
    achievements: [
      "Built and maintained Java business-system features for invoice processing and land-management workflows.",
      "Worked on enterprise data flows where reliability, traceability, and business correctness mattered.",
    ],
  },
  {
    year: "2022",
    icon: "💼",
    title: "EPAM Systems",
    detail: "SW Engineer → Senior SE — DevEx, licensing & package management in CI/CD (financial services)",
    achievements: [
      "Delivered developer-experience work around CI/CD, licensing, and package-management workflows for financial-services environments.",
      "Progressed from Software Engineer to Senior Software Engineer while working across enterprise delivery constraints.",
    ],
  },
  {
    year: "2023",
    icon: "☁️",
    title: "AWS Certified",
    detail: "Cloud Practitioner certification",
    link: "https://www.credly.com/badges/3617b306-40c2-4bab-94e4-2f20265e41d3",
  },
  {
    year: "2025",
    icon: "🚀",
    title: "Microsoft Security",
    detail: "Software Engineer II — Identity & Application Governance, Prague",
    achievements: [
      "Work on Identity & Application Governance systems in Microsoft Security.",
      "Focus on governance, trust boundaries, secure enterprise workflows, and practical security controls.",
    ],
  },
  {
    year: "2026",
    icon: "🗺️",
    title: "Investing Treasure Map",
    detail: "Stranger Things-themed interactive investing guide — quizzes, badges, calculators",
    link: "https://investing.mmishchenko.dev",
    resumeHide: true,
  },
  {
    year: "Now",
    icon: "🔧",
    title: "Building",
    detail: "Side projects, automation, learning security",
    resumeHide: true,
  },
];

export interface TechCategory {
  name: string;
  items: string[];
}

export const TECH_STACK: TechCategory[] = [
  { name: "Languages", items: ["Java", "C#", "Python", "TypeScript"] },
  {
    name: "AI & Agents",
    items: [
      "LLM Orchestration",
      "MCP",
      "Claude API",
      "OpenAI API",
      "LangChain",
      "Autonomous Agents",
    ],
  },
  { name: "Frontend", items: ["Next.js", "React", "Tailwind CSS"] },
  { name: "Backend", items: [".NET", "FastAPI", "Spring Boot"] },
  { name: "Cloud", items: ["Azure", "AWS"] },
  { name: "Tools", items: ["Git", "GitHub Actions", "Docker", "Vercel", "Telegram API"] },
];

export interface NowItem {
  emoji: string;
  text: string;
}

export const NOW: NowItem[] = [
  { emoji: "💼", text: "Working at Microsoft Security on Identity & Application Governance" },
  { emoji: "🤖", text: "Building AI agent automation with OpenClaw — personal assistant ecosystem" },
  { emoji: "📝", text: "Writing about engineering workflows and AI agents on this blog" },
  { emoji: "🔐", text: "Deepening security expertise — cloud identity, zero trust, AppSec" },
  { emoji: "🇨🇿", text: "Based in Prague, Czechia" },
];

export const NOW_LAST_UPDATED = "June 2026";

export const ABOUT = {
  eyebrow: "Professional snapshot",
  headline: "I build security-minded systems, developer tooling, and AI-agent automation.",
  summary:
    "Software Engineer II at Microsoft Security working on Identity & Application Governance. I focus on backend systems, security controls, automation, and practical AI-agent workflows that make engineering teams safer and faster.",
  focusAreas: [
    {
      title: "Identity & security systems",
      description:
        "Current work in Microsoft Security, with a focus on governance, trust boundaries, and secure enterprise workflows.",
      proof: "See the mcpgate case study for policy enforcement, audit trails, and prompt-injection defenses.",
    },
    {
      title: "Developer tooling",
      description:
        "Experience building CI/CD, package management, licensing, and workflow automation across enterprise environments.",
      proof: "See the resume for Microsoft Security, EPAM, and Stora Enso experience.",
    },
    {
      title: "Agentic AI & automation",
      description:
        "Hands-on work with MCP, AI-agent governance, personal automation, and human-in-the-loop workflows.",
      proof: "See OpenClaw and mcpgate-related portfolio work.",
    },
  ],
  proofLinks: [
    {
      label: "Read the mcpgate case study",
      href: "/case-studies/mcpgate-v1-1",
      description: "Deep technical write-up on MCP gateway security controls.",
    },
    {
      label: "Open the share-ready summary",
      href: "/case-studies/mcpgate-v1-1/share",
      description: "Copy-ready recruiter and referral summary.",
    },
    {
      label: "View resume",
      href: "/resume",
      description: "Print-optimized professional experience and project summary.",
    },
  ],
} as const;
