import Link from "next/link";
import getSession from "@/libs/getSession";

const heading = "mb-1.5 text-[13px] font-semibold uppercase tracking-wider text-[#f3d6d2]";
const link = "py-1.5 hover:text-white hover:underline";

// Per-request (reads cookies), so the layout renders it inside <Suspense>.
export default async function Footer() {
  const user = (await getSession())?.user;
  return (
    <footer className="mt-16 bg-[#1f1214] text-[#e8d9d6]">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-16 gap-y-8 px-6 py-10 md:px-12">
        <div className="flex max-w-xs flex-col gap-2.5">
          <span className="font-display text-xl font-bold text-white">SportBook</span>
          <span className="leading-relaxed">Book courts, fields and pools in seconds.</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-16 gap-y-8">
          <div className="flex flex-col">
            <span className={heading}>Explore</span>
            <Link href="/facility" className={link}>Facilities</Link>
            <Link href="/booking" className={link}>Book a facility</Link>
          </div>
          <div className="flex flex-col">
            <span className={heading}>Account</span>
            {user ? (
              <>
                <Link href="/mybooking" className={link}>My Bookings</Link>
                {user.role === "admin" && <Link href="/admin/facility/new" className={link}>Add Facility</Link>}
              </>
            ) : (
              <>
                <Link href="/login" className={link}>Login</Link>
                <Link href="/register" className={link}>Register</Link>
              </>
            )}
          </div>
        </nav>
      </div>
      <div className="border-t border-[#3a2427]">
        <p className="mx-auto max-w-6xl px-6 py-4 text-sm text-[#cdb9b5] md:px-12">&copy; {new Date().getFullYear()} SportBook. Sports facility booking system.</p>
      </div>
    </footer>
  );
}
