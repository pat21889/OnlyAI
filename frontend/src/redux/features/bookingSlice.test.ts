import reducer, {
  addBooking,
  clearBookings,
  removeBooking,
  setBookings,
  updateBooking,
  type BookingState,
} from "./bookingSlice";
import type { Booking } from "@/types/booking";

const booking = (id: string, overrides: Partial<Booking> = {}): Booking => ({
  _id: id,
  facility: { _id: "f1", name: "Badminton Court 1", sportType: "Badminton", location: "Hall", capacity: 4, hourlyRate: 200 },
  user: { _id: "u1", name: "Somchai", email: "somchai@example.com", tel: "0811111111", role: "member" },
  bookingDate: "2026-11-20T00:00:00.000Z",
  startTime: "18:00",
  durationHours: 1,
  createdAt: "2026-11-16T00:00:00.000Z",
  updatedAt: "2026-11-16T00:00:00.000Z",
  ...overrides,
});

const state = (...items: Booking[]): BookingState => ({ items, loaded: true });

describe("bookingSlice", () => {
  it("starts empty and not loaded", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual({ items: [], loaded: false });
  });

  it("setBookings replaces the whole list and marks it loaded", () => {
    const next = reducer({ items: [booking("a")], loaded: false }, setBookings([booking("b"), booking("c")]));
    expect(next.items.map((b) => b._id)).toEqual(["b", "c"]);
    expect(next.loaded).toBe(true);
  });

  it("addBooking appends a new booking", () => {
    const next = reducer(state(booking("a")), addBooking(booking("b")));
    expect(next.items.map((b) => b._id)).toEqual(["a", "b"]);
  });

  it("addBooking ignores a booking that is already in the list", () => {
    const next = reducer(state(booking("a")), addBooking(booking("a", { startTime: "09:00" })));
    expect(next.items).toHaveLength(1);
    expect(next.items[0].startTime).toBe("18:00");
  });

  it("updateBooking replaces the booking with the same _id", () => {
    const next = reducer(
      state(booking("a"), booking("b")),
      updateBooking(booking("b", { startTime: "20:00", durationHours: 2 })),
    );
    expect(next.items[0]).toEqual(booking("a"));
    expect(next.items[1]).toMatchObject({ _id: "b", startTime: "20:00", durationHours: 2 });
  });

  it("updateBooking leaves state unchanged for an unknown _id", () => {
    const before = state(booking("a"));
    expect(reducer(before, updateBooking(booking("zzz")))).toEqual(before);
  });

  it("removeBooking deletes by _id", () => {
    const next = reducer(state(booking("a"), booking("b")), removeBooking("a"));
    expect(next.items.map((b) => b._id)).toEqual(["b"]);
  });

  it("removeBooking with an unknown _id keeps every booking", () => {
    const next = reducer(state(booking("a")), removeBooking("zzz"));
    expect(next.items).toHaveLength(1);
  });

  it("clearBookings empties the list and resets loaded", () => {
    expect(reducer(state(booking("a"), booking("b")), clearBookings())).toEqual({ items: [], loaded: false });
  });
});
