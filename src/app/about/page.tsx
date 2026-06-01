import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT, JOURNEY, NOW, PROJECTS, SITE, TECH_STACK } from "@/lib/constants";
import { personSchema, safeJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "About — Maksym Mishchenko",
  description:
    "Professional snapshot for Maksym Mishchenko, Software Engineer II at Microsoft Security working on identity, security, developer tooling, and AI-agent automation.",
};

const professionalJourney = JOURNEY.filter((item) => !item.resumeHide);
const selectedProjects = PROJECTS.filter((project) => project.resume !== false);

export default function AboutPage() {
  return (
    <main id="main" className="min-h-screen px-6 py-24 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema()) }}
      />

      <div className="mx-auto max-w-5xl space-y-14">
        <section className="rounded-2xl border border-border bg-surface/40 p-6 sm:p-8">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
            {ABOUT.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {SITE.name}
          </h1>
          <p className="mt-3 text-lg font-medium text-accent">{SITE.status}</p>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-foreground">
            {ABOUT.headline}
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">{ABOUT.summary}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/resume"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              View resume
            </Link>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              LinkedIn
            </a>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href={SITE.email}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              Email
            </a>
          </div>
        </section>

        <section aria-labelledby="work-on">
          <h2 id="work-on" className="text-2xl font-semibold text-foreground">
            What I work on
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {ABOUT.focusAreas.map((area) => (
              <article key={area.title} className="rounded-xl border border-border bg-surface/40 p-5">
                <h3 className="text-lg font-semibold text-foreground">{area.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{area.description}</p>
                <p className="mt-4 text-sm leading-relaxed text-accent">{area.proof}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="proof-of-work">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="proof-of-work" className="text-2xl font-semibold text-foreground">
                Proof of work
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                A few direct links that show the type of systems, trade-offs, and delivery work I care about.
              </p>
            </div>
            <Link href="/case-studies" className="text-sm text-accent hover:underline">
              All case studies -&gt;
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-xl border border-accent/40 bg-surface/50 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                Flagship case study
              </p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">mcpgate</h3>
              <p className="mt-3 leading-relaxed text-muted">
                Security gateway for MCP tool calls with policy enforcement, audit trails, and reverse-channel prompt-injection defenses.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {ABOUT.proofLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface/40 p-5">
              <h3 className="text-lg font-semibold text-foreground">Selected projects</h3>
              <div className="mt-4 space-y-4">
                {selectedProjects.map((project) => (
                  <article key={project.title}>
                    <h4 className="font-medium text-foreground">{project.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{project.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="timeline">
          <h2 id="timeline" className="text-2xl font-semibold text-foreground">
            Timeline at a glance
          </h2>
          <div className="mt-6 space-y-4">
            {professionalJourney.map((item) => (
              <article key={`${item.year}-${item.title}`} className="border-l-2 border-border pl-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <span className="font-mono text-xs text-accent">{item.year}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="current-focus" className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 id="current-focus" className="text-2xl font-semibold text-foreground">
              Current focus
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              What I am paying attention to right now, kept in sync with the rest of the site.
            </p>
          </div>
          <div className="space-y-3">
            {NOW.map((item) => (
              <p key={item.text} className="rounded-xl border border-border bg-surface/40 p-4 text-sm text-muted">
                <span className="mr-2" aria-hidden="true">
                  {item.emoji}
                </span>
                {item.text}
              </p>
            ))}
          </div>
        </section>

        <section aria-labelledby="tech-stack">
          <h2 id="tech-stack" className="text-2xl font-semibold text-foreground">
            Working stack
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TECH_STACK.map((category) => (
              <div key={category.name} className="rounded-xl border border-border bg-surface/40 p-5">
                <h3 className="font-semibold text-foreground">{category.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span key={item} className="rounded-full bg-background px-2.5 py-1 text-xs text-muted">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
