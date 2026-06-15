import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full mx-auto bg-[#18181b] rounded-xl border border-[#27272a] overflow-hidden">
        {/* Terminal title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#18181b] border-b border-[#27272a]">
          <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span className="w-3 h-3 rounded-full bg-[#eab308]" />
          <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span className="ml-2 text-xs text-[#71717a] font-mono">404</span>
        </div>

        {/* Terminal body */}
        <div className="p-6 font-mono text-sm space-y-2">
          <p>
            <span className="text-accent">$</span>{" "}
            <span className="text-[#fafafa]">GET /this-page</span>
          </p>
          <p className="text-[#ef4444]">Error: 404 Not Found</p>
          <p className="text-[#71717a]">The page you&apos;re looking for doesn&apos;t exist.</p>
          <div className="pt-4 flex flex-col gap-2">
            <p>
              <span className="text-accent">$</span>{" "}
              <span className="text-[#71717a]">Available routes:</span>
            </p>
            <p>
              <span className="text-accent">→</span>{" "}
              <Link href="/" className="text-accent hover:underline">
                /home
              </Link>
            </p>
            <p>
              <span className="text-accent">→</span>{" "}
              <Link href="/blog" className="text-accent hover:underline">
                /blog
              </Link>
            </p>
            <p>
              <span className="text-accent">→</span>{" "}
              <Link href="/now" className="text-accent hover:underline">
                /now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
