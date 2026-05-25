import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAllDraftPosts } from "@/lib/blog";
import StagingDashboard from "./_components/StagingDashboard";

const STAGING_SECRET = process.env.STAGING_SECRET ?? "";

export default async function StagingPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("staging_auth")?.value;

  if (!STAGING_SECRET || auth !== STAGING_SECRET) {
    redirect("/staging/login");
  }

  const drafts = getAllDraftPosts();

  return <StagingDashboard drafts={drafts} />;
}
