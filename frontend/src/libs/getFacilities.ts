import type { Facility } from "@/types/facility";

export default async function getFacilities(): Promise<Facility[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/facilities`);
  if (!res.ok) throw new Error("Failed to load facilities");
  return (await res.json()).data;
}
