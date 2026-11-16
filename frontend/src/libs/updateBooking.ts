import type { Booking, BookingInput } from "@/types/booking";

// Owner or admin. Omitted fields keep their current value.
// Backend answers 400 (bad date/time/duration), 403 (not yours), 404 (booking or facility gone)
// or 409 (overlapping booking); its message is thrown so the form can show it.
export default async function updateBooking(
  token: string,
  id: string,
  input: Partial<BookingInput>,
): Promise<Booking> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookings/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  const json = await res.json().catch(() => ({})); // e.g. HTML 502 page from a proxy
  if (!res.ok) throw new Error(json.error || "Failed to update booking");
  return json.data;
}
