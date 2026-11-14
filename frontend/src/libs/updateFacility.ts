import type { Facility, FacilityInput } from "@/types/facility";

export default async function updateFacility(token: string, id: string, input: FacilityInput): Promise<Facility> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/facilities/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to update facility");
  return json.data;
}
