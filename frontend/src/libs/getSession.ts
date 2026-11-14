import { connection } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// Server-side session. connection() first: getServerSession uses randomBytes,
// which cacheComponents forbids during prerender. Render callers inside <Suspense>/loading.tsx.
export default async function getSession() {
  await connection();
  return getServerSession(authOptions);
}
