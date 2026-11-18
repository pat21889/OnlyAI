import type { Facility, FacilityInput } from "@/types/facility";

export default async function createFacility(token: string, input: FacilityInput): Promise<Facility> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/facilities`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  const json = await res.json().catch(() => ({})); // e.g. empty or HTML reply from a proxy
  if (!res.ok) throw new Error(json.error || `Failed to create facility (server replied ${res.status})`);
  return json.data;
}
