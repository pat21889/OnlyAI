import type { Facility } from "@/types/facility";

// Returns null when the facility doesn't exist (or was deleted), so pages can show 404.
export default async function getFacility(id: string): Promise<Facility | null> {
  // Backend answers 500 (not 404) for a malformed MongoDB id, so check the format here.
  if (!/^[a-f0-9]{24}$/i.test(id)) return null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/facilities/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load facility");
  return (await res.json()).data;
}
