import Link from "next/link";
import { connection } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import LogoutButton from "./LogoutButton";

// Per-request (reads cookies), so the layout renders it inside <Suspense>.
// connection() first: getServerSession uses randomBytes, which cacheComponents forbids during prerender.
export default async function TopMenu() {
  await connection();
  const user = (await getServerSession(authOptions))?.user;
  return (
    <nav className="flex items-center gap-6 px-6 h-14 border-b bg-white">
      <Link href="/" className="font-semibold">SportBook</Link>
      <Link href="/facility">Facilities</Link>
      {user && <Link href="/mybooking">My Bookings</Link>}
      {user?.role === "admin" && <Link href="/admin/facility">Manage Facilities</Link>}
      <div className="ml-auto flex items-center gap-4">
        {user ? (
          <>
            <span data-testid="user-name">{user.name} ({user.role})</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
