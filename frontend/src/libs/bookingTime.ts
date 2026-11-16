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
