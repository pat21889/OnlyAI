import type { Booking, BookingInput } from "@/types/booking";

// Member only. Backend answers 400 (bad date/time/duration), 404 (facility gone)
// or 409 (overlapping booking); its message is thrown so the form can show it.
export default async function createBooking(token: string, input: BookingInput): Promise<Booking> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  const json = await res.json().catch(() => ({})); // e.g. HTML 502 page from a proxy
  if (!res.ok) throw new Error(json.error || "Failed to create booking");
  return json.data;
}
