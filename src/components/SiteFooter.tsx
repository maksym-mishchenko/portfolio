import { SITE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="py-10 border-t border-border print:hidden">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">© {new Date().getFullYear()} Maksym Mishchenko.</p>
        <div className="flex items-center gap-4">
          <a
            href="/blog/feed.xml"
            className="text-sm text-muted hover:text-foreground transition-colors"
            aria-label="RSS Feed"
          >
            RSS
          </a>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={SITE.email}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
