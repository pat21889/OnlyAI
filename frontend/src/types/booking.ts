import type { Facility } from "./facility";

// Body for POST/PUT /api/v1/bookings
export type BookingInput = {
  facility: string; // facility _id
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  durationHours: number; // 0.5–2
};

// What the backend returns: facility and user are populated.
export type Booking = {
  _id: string;
  facility: Pick<Facility, "_id" | "name" | "sportType" | "location" | "capacity" | "hourlyRate">;
  user: { _id: string; name: string; email: string; tel: string; role: "admin" | "member" };
  bookingDate: string; // ISO date, midnight UTC
  startTime: string;
  durationHours: number;
  createdAt: string;
  updatedAt: string;
};
