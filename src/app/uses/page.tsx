import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Uses — Maksym Mishchenko",
  description: "The tools, hardware, and software I use for software engineering.",
};

interface UsesCategory {
  name: string;
  items: { name: string; detail: string }[];
}

const USES: UsesCategory[] = [
  {
    name: "Editor & Terminal",
    items: [
      { name: "VS Code", detail: "Primary editor with GitHub Copilot" },
      { name: "JetBrains Rider", detail: "For .NET/C# projects at work" },
      { name: "Warp", detail: "Terminal with AI features" },
      { name: "GitHub Copilot CLI", detail: "AI-powered terminal assistant" },
    ],
  },
  {
    name: "Languages & Frameworks",
    items: [
      { name: "C# / .NET", detail: "Primary at Microsoft" },
      { name: "TypeScript / Next.js", detail: "Side projects & frontends" },
      { name: "Python / FastAPI", detail: "AI agents & automation" },
      { name: "Java / Spring Boot", detail: "Previous roles" },
    ],
  },
  {
    name: "Infrastructure",
    items: [
      { name: "Azure", detail: "Work cloud + personal VM" },
      { name: "Vercel", detail: "Frontend deployments" },
      { name: "Cloudflare", detail: "DNS, email routing, tunnels" },
      { name: "Docker", detail: "Containerized services on VM" },
      { name: "GitHub Actions", detail: "CI/CD pipelines" },
    ],
  },
  {
    name: "Hardware",
    items: [
      { name: 'MacBook Pro 14"', detail: "M3 Pro — personal machine" },
      { name: "Magic Keyboard", detail: "With Touch ID" },
      { name: "AirPods Pro", detail: "For focus work" },
    ],
  },
  {
    name: "Apps",
    items: [
      { name: "Arc", detail: "Primary browser" },
      { name: "Notion", detail: "Notes & documentation" },
      { name: "Telegram", detail: "Bot ecosystem & notifications" },
      { name: "1Password", detail: "Secrets management" },
    ],
  },
];

export default function UsesPage() {
  return (
    <main id="main" className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Home
        </Link>

        <h1 className="mb-4 font-mono text-3xl font-bold">Uses</h1>
        <p className="mb-12 text-muted">
          The tools, hardware, and software I use daily for software engineering.
        </p>

        <div className="space-y-12">
          {USES.map((category) => (
            <section key={category.name}>
              <h2 className="mb-4 font-mono text-lg font-semibold text-accent">
                {category.name}
              </h2>
              <ul className="space-y-3">
                {category.items.map((item) => (
                  <li key={item.name} className="flex gap-3">
                    <span className="font-medium text-foreground shrink-0">
                      {item.name}
                    </span>
                    <span className="text-muted">— {item.detail}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
