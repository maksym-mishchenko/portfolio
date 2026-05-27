import { ScrollProgress } from "@/components/ScrollProgress";
import { StickyNav } from "@/components/StickyNav";
import { BackToTop } from "@/components/BackToTop";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Journey } from "@/components/Journey";
import { TechStack } from "@/components/TechStack";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { SITE } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <StickyNav />
      <main id="main">
        <Hero />
        <Projects />
        <Journey />
        <TechStack />
        <About />
        <Contact />
      </main>
      <footer className="py-10 border-t border-border">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">© {new Date().getFullYear()} Maksym Mishchenko.</p>
          <div className="flex items-center gap-4">
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href={SITE.email}
              className="text-sm text-muted hover:text-foreground transition-colors"
              aria-label="Email"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
      <BackToTop />
    </>
  );
}
