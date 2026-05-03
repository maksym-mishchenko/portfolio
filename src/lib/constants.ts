export const SITE = {
  name: "Maksym Mishchenko",
  title: "Software Engineer II @ Microsoft Security",
  url: "https://maksym.dev",
  github: "https://github.com/maksym-mishchenko",
  linkedin: "https://linkedin.com/in/maksym-mishchenko-1036381b8",
  email: "mailto:contact@maksym.dev",
} as const;

export interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    title: "English Helper",
    description:
      "AI-powered Telegram Mini App for vocabulary learning with spaced repetition, HMAC-SHA256 auth, and 19 API routes.",
    tech: ["Next.js", "FastAPI", "Telegram API", "Azure VM"],
    github: "https://github.com/maksym-mishchenko/english-helper-app",
    featured: true,
  },
  {
    title: "Stock Intelligence Bot",
    description:
      "Automated weekly stock reports combining Discord sentiment, YouTube analysis, and portfolio tracking.",
    tech: ["Python", "IBKR API", "Discord", "Telegram"],
    github: "https://github.com/maksym-mishchenko/stock-bot",
  },
  {
    title: "OpenClaw",
    description:
      "Personal AI assistant ecosystem with multi-agent architecture, task routing, and Telegram interface.",
    tech: ["Python", "FastAPI", "Multi-Agent", "Azure VM"],
    github: "https://github.com/maksym-mishchenko/openclaw",
  },
  {
    title: "PowerBI Buddy",
    description:
      "AI assistant for Power BI — helps write DAX, optimize models, and troubleshoot reports.",
    tech: ["Next.js", "OpenAI API", "Vercel"],
    github: "https://github.com/maksym-mishchenko/powerbi-buddy",
    live: "https://powerbi-buddy.vercel.app",
  },
];

export interface JourneyNode {
  year: string;
  icon: string;
  title: string;
  detail: string;
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
    detail: "Software Engineer → Senior SE — Java libraries, DevOps tooling",
  },
  {
    year: "2023",
    icon: "☁️",
    title: "AWS Certified",
    detail: "Cloud Practitioner certification",
  },
  {
    year: "2025",
    icon: "🚀",
    title: "Microsoft Security",
    detail: "Software Engineer II — Identity & Application Governance, Prague",
  },
  {
    year: "Now",
    icon: "🔧",
    title: "Building",
    detail: "Side projects, open source, learning security",
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
  { name: "Cloud", items: ["Azure", "AWS", "Docker", "Vercel"] },
  { name: "Tools", items: ["Git", "GitHub Actions", "Telegram API"] },
];

export const ZERO_TRUST_STEPS = [
  { id: "request", label: "Request", icon: "📨", description: "Incoming HTTP request" },
  { id: "tls", label: "TLS", icon: "🔒", description: "TLS 1.3 termination & certificate validation" },
  { id: "rate-limit", label: "Rate Limit", icon: "⏱️", description: "Token bucket rate limiting per IP" },
  { id: "cors", label: "CORS", icon: "🌐", description: "Origin allowlist check" },
  { id: "validate", label: "Validate", icon: "✅", description: "Zod schema validation on all inputs" },
  { id: "auth", label: "Auth", icon: "🔑", description: "JWT verification & scope check" },
  { id: "logic", label: "Logic", icon: "⚙️", description: "Business logic execution" },
  { id: "response", label: "Response", icon: "📤", description: "Sanitized response with security headers" },
] as const;
