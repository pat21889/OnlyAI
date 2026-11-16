import type { Booking } from "@/types/booking";

// Members get their own bookings, admins get everyone's (decided by the backend from the token).
export default async function getBookings(token: string): Promise<Booking[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({})); // e.g. HTML 502 page from a proxy
    throw new Error(json.error || "Failed to load bookings");
  }
  return (await res.json()).data;
}
