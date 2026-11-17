import { MAX_HOURS, MIN_HOURS } from "./parseBookingForm";

// "2026-11-20T00:00:00.000Z" -> "2026-11-20".
// The backend stores the date at midnight UTC, so slice the string instead of
// formatting a Date in local time (which shifts the day in some time zones).
export function bookingDay(isoDate: string) {
  return isoDate.slice(0, 10);
}

// ("18:00", 1.5) -> "19:30"; ("23:00", 1) -> "24:00" (bookings must end by midnight).
export function endTime(startTime: string, durationHours: number) {
  const [h, m] = startTime.split(":").map(Number);
  const end = h * 60 + m + Math.round(durationHours * 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(end / 60))}:${pad(end % 60)}`;
}

// (300, 1.5) -> 450. null when the duration is outside what the backend accepts,
// so the form doesn't show a price for a booking that can't be made.
export function totalPrice(hourlyRate: number | undefined, durationHours: number) {
  if (hourlyRate === undefined || !Number.isFinite(hourlyRate) || hourlyRate < 0) return null;
  if (!Number.isFinite(durationHours) || durationHours < MIN_HOURS || durationHours > MAX_HOURS) return null;
  return hourlyRate * durationHours;
}

// 1200 -> "1,200", 99.5 -> "99.5"
export function formatPrice(amount: number) {
  return amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
