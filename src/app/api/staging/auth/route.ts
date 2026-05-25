import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const STAGING_SECRET = process.env.STAGING_SECRET ?? "";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { secret } = body as { secret?: string };

  if (!STAGING_SECRET || secret !== STAGING_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("staging_auth", STAGING_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return Response.json({ success: true });
}
