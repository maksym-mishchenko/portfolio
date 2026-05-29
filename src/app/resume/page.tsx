import type { Metadata } from "next";
import { SITE, JOURNEY, PROJECTS, TECH_STACK } from "@/lib/constants";
import { ResumeActions } from "@/components/ResumeActions";

export const metadata: Metadata = {
  title: "Resume — Maksym Mishchenko",
  description: "Software Engineer II at Microsoft Security. Resume and professional experience.",
};

export default function ResumePage() {
  const resumeProjects = PROJECTS.filter((p) => p.resume !== false);
  return (
    <main id="main" className="max-w-3xl mx-auto px-6 py-12 print:py-4 print:px-2 print:max-w-none">
      <ResumeActions />

      {/* Header */}
      <header className="mb-10 print:mb-6">
        <h1 className="text-3xl font-bold print:text-2xl">{SITE.name}</h1>
        <p className="text-lg text-muted mt-1 print:text-base">{SITE.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted">
          <a href={SITE.url} className="hover:text-foreground transition-colors print:text-foreground">
            {SITE.url.replace("https://", "")}
          </a>
          <a href={SITE.github} className="hover:text-foreground transition-colors print:text-foreground">
            GitHub
          </a>
          <a href={SITE.linkedin} className="hover:text-foreground transition-colors print:text-foreground">
            LinkedIn
          </a>
          <a href={SITE.email} className="hover:text-foreground transition-colors print:text-foreground">
            {SITE.email.replace("mailto:", "")}
          </a>
        </div>
      </header>

      {/* Experience & Journey */}
      <section className="mb-10 print:mb-6">
        <h2 className="text-xl font-bold border-b border-border pb-2 mb-4 print:text-lg">
          Experience & Education
        </h2>
        <div className="space-y-4">
          {JOURNEY.map((node) => (
            <div key={`${node.year}-${node.title}`} className="flex gap-4">
              <span className="text-sm text-muted font-mono w-24 shrink-0 print:w-20">
                {node.year}
              </span>
              <div>
                <p className="font-medium">{node.title}</p>
                <p className="text-sm text-muted">{node.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-10 print:mb-6">
        <h2 className="text-xl font-bold border-b border-border pb-2 mb-4 print:text-lg">
          Projects
        </h2>
        <div className="space-y-4">
          {resumeProjects.map((project) => (
            <div key={project.title}>
              <div className="flex items-baseline gap-2">
                <h3 className="font-medium">{project.title}</h3>
                {project.live && (
                  <a
                    href={project.live}
                    className="text-xs text-accent hover:underline print:text-foreground"
                  >
                    {project.live.replace("https://", "")}
                  </a>
                )}
              </div>
              <p className="text-sm text-muted mt-0.5">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-muted print:border-gray-300 print:bg-gray-100 print:text-gray-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-10 print:mb-6">
        <h2 className="text-xl font-bold border-b border-border pb-2 mb-4 print:text-lg">
          Technical Skills
        </h2>
        <div className="space-y-2">
          {TECH_STACK.map((category) => (
            <div key={category.name} className="flex gap-2">
              <span className="font-medium text-sm w-24 shrink-0">{category.name}:</span>
              <span className="text-sm text-muted">{category.items.join(", ")}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
