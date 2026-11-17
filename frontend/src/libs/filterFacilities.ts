import type { Facility } from "@/types/facility";

export type FacilityFilter = { q?: string; sport?: string; maxPrice?: string };

// Text matches name or location; blank or invalid values are ignored.
export default function filterFacilities(facilities: Facility[], { q, sport, maxPrice }: FacilityFilter): Facility[] {
  const text = q?.trim().toLowerCase();
  const max = maxPrice?.trim() ? Number(maxPrice) : NaN;
  return facilities.filter(
    (f) =>
      (!text || f.name.toLowerCase().includes(text) || f.location.toLowerCase().includes(text)) &&
      (!sport || f.sportType === sport) &&
      (Number.isNaN(max) || f.hourlyRate <= max)
  );
}
