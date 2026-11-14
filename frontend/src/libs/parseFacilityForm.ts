import type { FacilityInput } from "@/types/facility";

export type FacilityErrors = Partial<Record<keyof FacilityInput, string>>;

// Turns form data into a FacilityInput and checks it against the backend model rules.
export default function parseFacilityForm(form: FormData) {
  const text = (k: string) => String(form.get(k) ?? "").trim();
  const input: FacilityInput = {
    name: text("name"),
    sportType: text("sportType"),
    location: text("location"),
    capacity: Number(text("capacity")),
    hourlyRate: Number(text("hourlyRate")),
  };

  const errors: FacilityErrors = {};
  if (!input.name) errors.name = "Please enter a name";
  if (!input.sportType) errors.sportType = "Please enter a sport type";
  if (!input.location) errors.location = "Please enter a location";
  if (!text("capacity") || !Number.isInteger(input.capacity) || input.capacity < 1)
    errors.capacity = "Capacity must be a whole number of at least 1";
  if (!text("hourlyRate") || !Number.isFinite(input.hourlyRate) || input.hourlyRate < 0)
    errors.hourlyRate = "Hourly rate must be 0 or more";

  return { input, errors };
}
