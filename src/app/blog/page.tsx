import { BlogSearch } from "@/components/BlogSearch";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | Maksym Mishchenko",
  description: "Thoughts on software engineering, AI systems, and building products.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <p className="mb-4 font-mono text-sm text-emerald-400">$ ls ~/blog</p>
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Blog</h1>
          <p className="text-lg text-slate-400">
            Notes on engineering, AI, and the craft of building software.
          </p>
        </div>

        <BlogSearch posts={posts} />
      </div>
    </main>
  );
}
