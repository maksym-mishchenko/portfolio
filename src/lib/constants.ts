export const SITE = {
  name: "Maksym Mishchenko",
  title: "Software Engineer II @ Microsoft Security",
  status: "Software Engineer II @ Microsoft Security",
  url: "https://mmishchenko.dev",
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
  },
  {
    year: "2022",
    icon: "💼",
    title: "EPAM Systems",
    detail: "SW Engineer → Senior SE — DevEx, licensing & package management in CI/CD (financial services)",
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
