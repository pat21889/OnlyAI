import Link from "next/link";
import getFacilities from "@/libs/getFacilities";
import getSession from "@/libs/getSession";
import BookingForm from "@/components/BookingForm";

// Login required: src/proxy.ts redirects guests to /login.
// Opened from a facility page as /booking?fid=<id>, or directly to pick from the dropdown.
export default async function BookingPage({ searchParams }: PageProps<"/booking">) {
  const [{ fid }, facilities, session] = await Promise.all([searchParams, getFacilities(), getSession()]);

  // Backend only lets members create bookings.
  if (session?.user.role === "admin") {
    return (
      <div className="max-w-md mx-auto mt-10 rounded bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold mb-2">Book a facility</h1>
        <p data-testid="admin-no-booking">Admins cannot create bookings. You can manage existing bookings in My Bookings.</p>
        <Link href="/mybooking" className="mt-4 inline-block text-blue-600 hover:underline">Go to My Bookings</Link>
      </div>
    );
  }

  if (facilities.length === 0) {
    return <p className="max-w-md mx-auto mt-10 text-zinc-600">No facilities available to book yet.</p>;
  }

  return <BookingForm facilities={facilities} defaultFacilityId={facilities.some((f) => f._id === fid) ? (fid as string) : undefined} />;
}
