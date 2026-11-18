export default async function deleteFacility(token: string, id: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/facilities/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({})); // e.g. empty or HTML reply from a proxy
    throw new Error(json.error || `Failed to delete facility (server replied ${res.status})`);
  }
}
