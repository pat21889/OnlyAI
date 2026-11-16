import parseBookingForm, { todayString } from "./parseBookingForm";

const TODAY = "2026-11-16";
const FID = "507f1f77bcf86cd799439011";

const form = (overrides: Record<string, string> = {}) => {
  const fd = new FormData();
  const values = { facility: FID, bookingDate: "2026-11-20", startTime: "14:00", durationHours: "1.5", ...overrides };
  Object.entries(values).forEach(([k, v]) => fd.set(k, v));
  return fd;
};
const parse = (overrides: Record<string, string> = {}) => parseBookingForm(form(overrides), TODAY);

describe("parseBookingForm", () => {
  it("accepts valid input and converts duration to a number", () => {
    const { input, errors } = parse();
    expect(errors).toEqual({});
    expect(input).toEqual({ facility: FID, bookingDate: "2026-11-20", startTime: "14:00", durationHours: 1.5 });
  });

  it("accepts today's date", () => {
    expect(parse({ bookingDate: TODAY }).errors.bookingDate).toBeUndefined();
  });

  it("rejects a past date", () => {
    expect(parse({ bookingDate: "2026-11-15" }).errors.bookingDate).toBe("Booking date cannot be in the past");
  });

  it.each(["3", "2.5", "0.25", "0", "-1"])("rejects duration %s hours", (durationHours) => {
    expect(parse({ durationHours }).errors.durationHours).toMatch(/between 0.5 and 2/);
  });

  it.each(["0.5", "1", "2"])("accepts duration %s hours", (durationHours) => {
    expect(parse({ durationHours }).errors.durationHours).toBeUndefined();
  });

  it("rejects a booking that runs past midnight", () => {
    expect(parse({ startTime: "23:00", durationHours: "2" }).errors.durationHours).toMatch(/same day/);
    expect(parse({ startTime: "22:00", durationHours: "2" }).errors.durationHours).toBeUndefined();
  });

  it("flags every empty field", () => {
    const { errors } = parse({ facility: "", bookingDate: "", startTime: "", durationHours: "" });
    expect(Object.keys(errors).sort()).toEqual(["bookingDate", "durationHours", "facility", "startTime"]);
  });

  it("rejects a badly formatted time", () => {
    expect(parse({ startTime: "25:00" }).errors.startTime).toBeDefined();
  });
});

describe("todayString", () => {
  it("formats a local date as YYYY-MM-DD", () => {
    expect(todayString(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
