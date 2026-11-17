import Link from "next/link";
import { redirect } from "next/navigation";
import getSession from "@/libs/getSession";
import getBookings from "@/libs/getBookings";
import BookingList from "@/components/BookingList";
import ReduxProvider from "@/redux/ReduxProvider";

// Login required: src/proxy.ts redirects guests to /login.
// Members see their own bookings, admins see everyone's (the backend filters by token).
export default async function MyBookingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const isAdmin = session.user.role === "admin";
  const bookings = await getBookings(session.user.token);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{isAdmin ? "All Bookings" : "My Bookings"}</h1>
        {!isAdmin && (
          <Link href="/booking" className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">+ New booking</Link>
        )}
      </div>
      <ReduxProvider>
        <BookingList initialBookings={bookings} isAdmin={isAdmin} />
      </ReduxProvider>
    </div>
  );
}
