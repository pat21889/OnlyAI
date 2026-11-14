import Link from "next/link";
import getSession from "@/libs/getSession";
import LogoutButton from "./LogoutButton";

// Per-request (reads cookies), so the layout renders it inside <Suspense>.
export default async function TopMenu() {
  const user = (await getSession())?.user;
  return (
    <nav className="flex items-center gap-6 px-6 h-14 border-b bg-white">
      <Link href="/" className="font-semibold">SportBook</Link>
      <Link href="/facility">Facilities</Link>
      {user && <Link href="/mybooking">My Bookings</Link>}
      {user?.role === "admin" && <Link href="/admin/facility/new">Add Facility</Link>}
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
