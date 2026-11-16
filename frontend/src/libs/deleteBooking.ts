// Owner or admin. Throws the backend message on 403 / 404.
export default async function deleteBooking(token: string, id: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookings/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({})); // e.g. HTML 502 page from a proxy
    throw new Error(json.error || "Failed to delete booking");
  }
}
