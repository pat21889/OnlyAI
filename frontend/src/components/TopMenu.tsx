import Link from "next/link";
import getSession from "@/libs/getSession";
import LogoutButton from "./LogoutButton";

const link = "py-2 font-medium hover:text-blue-600";

// Per-request (reads cookies), so the layout renders it inside <Suspense>.
export default async function TopMenu() {
  const user = (await getSession())?.user;
  return (
    <nav className="flex flex-wrap items-center gap-x-7 gap-y-1 border-b border-[#E8D9D6] bg-white px-6 py-3 md:px-12">
      <Link href="/" className="mr-2 font-display text-xl font-bold text-blue-600">SportBook</Link>
      <Link href="/facility" className={link}>Facilities</Link>
      {user && <Link href="/mybooking" className={link}>My Bookings</Link>}
      {user?.role === "admin" && <Link href="/admin/facility/new" className={link}>Add Facility</Link>}
      <div className="ml-auto flex flex-wrap items-center gap-3">
        {user ? (
          <>
            <span data-testid="user-name" className="font-medium">{user.name} ({user.role})</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className={`${link} px-3`}>Login</Link>
            <Link href="/register" className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
