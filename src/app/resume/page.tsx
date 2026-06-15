import type { Metadata } from "next";
import { SITE, JOURNEY, PROJECTS, TECH_STACK } from "@/lib/constants";
import { ResumeActions } from "@/components/ResumeActions";

export const metadata: Metadata = {
  title: "Resume — Maksym Mishchenko",
  description: "Software Engineer II at Microsoft Security. Resume and professional experience.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  const resumeProjects = PROJECTS.filter((p) => p.resume !== false);
  const resumeJourney = JOURNEY.filter((n) => !n.resumeHide);

  const education = resumeJourney.filter((n) =>
    ["🎓", "🇺🇦"].includes(n.icon)
  );
  const experience = resumeJourney
    .filter((n) => n.icon === "💼" || n.icon === "🚀")
    .reverse();
  const certifications = resumeJourney.filter((n) => n.icon === "☁️");

  return (
    <main id="main" className="min-h-screen">
      {/* Actions bar — hidden on print */}
      <div className="max-w-5xl mx-auto px-6 pt-6 print:hidden">
        <ResumeActions />
      </div>

      {/* Resume document */}
      <div className="resume-doc max-w-5xl mx-auto px-4 sm:px-6 pb-16 print:px-0 print:pb-0 print:max-w-none">

        {/* ── Header ── */}
        <header className="py-10 print:py-6 border-b border-border print:border-gray-300">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight print:text-3xl">
            {SITE.name}
          </h1>
          <p className="text-lg text-accent mt-1 font-medium print:text-black print:text-base">
            {SITE.title}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-muted print:text-gray-600">
            <a href={SITE.url} className="hover:text-foreground transition-colors inline-flex items-center gap-1.5 print:text-gray-600">
              <span className="text-accent print:text-gray-400">🌐</span>
              {SITE.url.replace("https://", "")}
            </a>
            <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5 print:text-gray-600">
              <span className="text-accent print:text-gray-400">⌥</span>
              github.com/maksym-mishchenko
            </a>
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1.5 print:text-gray-600">
              <span className="text-accent print:text-gray-400">in</span>
              linkedin.com/in/maksym-mishchenko-1036381b8
            </a>
            <a href={SITE.email} className="hover:text-foreground transition-colors inline-flex items-center gap-1.5 print:text-gray-600">
              <span className="text-accent print:text-gray-400">✉</span>
              {SITE.email.replace("mailto:", "")}
            </a>
          </div>
        </header>

        {/* ── Two-column body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0 print:grid-cols-[1fr_2fr]">

          {/* ── Left sidebar ── */}
          <aside className="py-8 lg:pr-8 lg:border-r border-border print:pr-6 print:border-r print:border-gray-300 print:py-5">

            {/* Skills */}
            <section className="mb-8 print:mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4 print:text-gray-500">
                Technical Skills
              </h2>
              <div className="space-y-3">
                {TECH_STACK.map((category) => (
                  <div key={category.name}>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5 print:text-gray-500">
                      {category.name}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {category.items.map((item) => (
                        <span
                          key={item}
                          className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-foreground print:bg-gray-100 print:border-gray-300 print:text-gray-800"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="mb-8 print:mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4 print:text-gray-500">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((node) => (
                  <div key={node.title}>
                    <p className="text-sm font-semibold text-foreground print:text-black">{node.title}</p>
                    <p className="text-xs text-muted mt-0.5 print:text-gray-600">{node.detail}</p>
                    <p className="text-xs text-accent mt-0.5 font-mono print:text-gray-500">{node.year}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            {certifications.length > 0 && (
              <section className="mb-8 print:mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4 print:text-gray-500">
                  Certifications
                </h2>
                <div className="space-y-2">
                  {certifications.map((node) => (
                    <div key={node.title}>
                      {node.link ? (
                        <a
                          href={node.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-foreground hover:text-accent transition-colors print:text-black"
                        >
                          {node.title} ↗
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground print:text-black">{node.title}</p>
                      )}
                      <p className="text-xs text-muted mt-0.5 print:text-gray-600">{node.detail}</p>
                      <p className="text-xs text-accent mt-0.5 font-mono print:text-gray-500">{node.year}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Location */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-3 print:text-gray-500">
                Location
              </h2>
              <p className="text-sm text-muted print:text-gray-600">Prague, Czechia 🇨🇿</p>
            </section>
          </aside>

          {/* ── Right main ── */}
          <div className="py-8 lg:pl-8 print:pl-6 print:py-5">

            {/* Summary */}
            <section className="mb-8 print:mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4 print:text-gray-500">
                Summary
              </h2>
              <p className="text-sm text-muted leading-relaxed print:text-gray-700">
                Software Engineer II at Microsoft Security, working on Identity &amp; Application Governance.
                5+ years of experience building backend systems, developer tooling, and security-focused infrastructure
                across financial services and enterprise software. Originally from Ukraine, based in Prague.
              </p>
            </section>

            {/* Experience */}
            <section className="mb-8 print:mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4 print:text-gray-500">
                Experience
              </h2>
              <div className="space-y-5">
                {experience.map((node) => (
                  <div
                    key={node.title}
                    className="relative pl-4 border-l-2 border-border hover:border-accent transition-colors print:border-gray-300 print:pl-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 print:flex-row print:justify-between">
                      <h3 className="text-base font-semibold text-foreground print:text-black print:text-sm">
                        {node.title}
                      </h3>
                      <span className="text-xs font-mono text-accent shrink-0 print:text-gray-500">
                        {node.year}
                      </span>
                     </div>
                     <p className="text-sm text-muted mt-1 print:text-gray-600 print:text-xs">{node.detail}</p>
                    {node.achievements && (
                      <ul className="mt-2 space-y-1.5 text-sm text-muted print:text-xs print:text-gray-700">
                        {node.achievements.map((achievement) => (
                          <li key={achievement} className="flex gap-2">
                            <span
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent print:bg-gray-500"
                              aria-hidden="true"
                            />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                   </div>
                 ))}
               </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4 print:text-gray-500">
                Selected Projects
              </h2>
              <div className="space-y-5">
                {resumeProjects.map((project) => (
                  <div
                    key={project.title}
                    className="relative pl-4 border-l-2 border-border hover:border-accent/60 transition-colors print:border-gray-300 print:pl-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                      <h3 className="text-base font-semibold text-foreground print:text-black print:text-sm">
                        {project.title}
                      </h3>
                      <div className="flex gap-2">
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-accent hover:underline print:text-gray-500"
                          >
                            {project.live.replace("https://", "")} ↗
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted hover:text-foreground transition-colors print:text-gray-500"
                          >
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted mt-0.5 print:text-gray-600 print:text-xs">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-muted print:bg-gray-100 print:border-gray-300 print:text-gray-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
