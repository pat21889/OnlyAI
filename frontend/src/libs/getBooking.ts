import type { Booking } from "@/types/booking";

// Returns null when the booking doesn't exist or belongs to someone else (404 / 403),
// so the edit page can show "not found" without revealing that the id exists.
export default async function getBooking(token: string, id: string): Promise<Booking | null> {
  // Backend answers 500 (not 404) for a malformed MongoDB id, so check the format here.
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404 || res.status === 403) return null;
  if (!res.ok) {
    const json = await res.json().catch(() => ({})); // e.g. HTML 502 page from a proxy
    throw new Error(json.error || "Failed to load booking");
  }
  return (await res.json()).data;
}
