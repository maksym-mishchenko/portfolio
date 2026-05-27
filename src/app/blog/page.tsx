import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogList } from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Blog — Maksym Mishchenko",
  description:
    "Writing about AI agents, engineering workflows, and building things that actually work.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogList posts={posts} />;
}
