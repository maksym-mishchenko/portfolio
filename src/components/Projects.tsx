"use client";

import { motion } from "framer-motion";
import { useState, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { track } from "@vercel/analytics";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
import { PROJECTS, type Project } from "@/lib/constants";
import { SectionHeader } from "./SectionHeader";

function ProjectCard({ project, index, featured }: { project: Project; index: number; featured?: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/50 ${
        featured ? "md:col-span-2 md:row-span-2 md:p-8" : ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 opacity-15 transition-opacity"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59,130,246,0.15), transparent 60%)`,
          }}
        />
      )}

      <div className="relative z-10">
        {project.thumbnail && (
          <div className="mb-5 overflow-hidden rounded-lg border border-border">
            <Image
              src={project.thumbnail}
              alt={`${project.title} preview`}
              width={1200}
              height={630}
              unoptimized
              className="w-full h-auto"
            />
          </div>
        )}
        <h3 className={`font-mono font-bold ${featured ? "text-2xl mb-3" : "text-lg mb-2"}`}>
          {project.title}
        </h3>
        <p className={`text-muted leading-relaxed ${featured ? "text-base mb-6" : "text-sm mb-4"}`}>
          {project.description}
        </p>

        {project.learned && (
          <p className={`text-accent/80 italic leading-relaxed ${featured ? "text-sm mb-6" : "text-xs mb-4"}`}>
            💡 {project.learned}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full bg-background px-3 py-1 text-xs font-mono text-muted border border-border"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.caseStudySlug && (
            <Link
              href={`/case-studies/${project.caseStudySlug}`}
              onClick={() => track("project_click", { project: project.title, type: "case_study" })}
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-accent hover:text-foreground transition-colors"
            >
              Case study
            </Link>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("project_click", { project: project.title, type: "github" })}
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
            >
              <GithubIcon size={16} />
              Code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("project_click", { project: project.title, type: "live" })}
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
            >
              <ExternalLink size={16} />
              Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="Selected work"
          subtitle="A security gateway for AI agents, this site, and a couple of experiments. Each card notes what I'd improve next."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} featured />
          ))}
          {rest.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i + featured.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
