import type { BookingInput } from "@/types/booking";

export type BookingErrors = Partial<Record<keyof BookingInput, string>>;

export const MIN_HOURS = 0.5;
export const MAX_HOURS = 2;

// Local date as YYYY-MM-DD (strings in this format compare correctly with < and >).
export function todayString(now = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Turns form data into a BookingInput and checks the same rules as the backend.
// `today` is a parameter so tests don't depend on the real date.
export default function parseBookingForm(form: FormData, today = todayString()) {
  const text = (k: string) => String(form.get(k) ?? "").trim();
  const input: BookingInput = {
    facility: text("facility"),
    bookingDate: text("bookingDate"),
    startTime: text("startTime"),
    durationHours: Number(text("durationHours")),
  };

  const errors: BookingErrors = {};
  if (!/^[a-f0-9]{24}$/i.test(input.facility)) errors.facility = "Please choose a facility";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.bookingDate)) errors.bookingDate = "Please choose a date";
  else if (input.bookingDate < today) errors.bookingDate = "Booking date cannot be in the past";

  const time = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(input.startTime);
  if (!time) errors.startTime = "Please choose a start time";

  const d = input.durationHours;
  if (!text("durationHours") || !Number.isFinite(d)) errors.durationHours = "Please enter a duration";
  else if (d < MIN_HOURS || d > MAX_HOURS)
    errors.durationHours = `Duration must be between ${MIN_HOURS} and ${MAX_HOURS} hours`;
  else if (time && Number(time[1]) * 60 + Number(time[2]) + d * 60 > 24 * 60)
    errors.durationHours = "Booking must end on the same day (by 24:00)";

  return { input, errors };
}
