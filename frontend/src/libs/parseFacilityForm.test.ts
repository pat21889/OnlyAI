import parseFacilityForm from "./parseFacilityForm";

const form = (overrides: Record<string, string> = {}) => {
  const fd = new FormData();
  const values = { name: " Court A ", sportType: "Badminton", location: "Bldg 1", capacity: "4", hourlyRate: "150", ...overrides };
  Object.entries(values).forEach(([k, v]) => fd.set(k, v));
  return fd;
};

describe("parseFacilityForm", () => {
  it("parses valid input into trimmed strings and numbers", () => {
    const { input, errors } = parseFacilityForm(form());
    expect(errors).toEqual({});
    expect(input).toEqual({ name: "Court A", sportType: "Badminton", location: "Bldg 1", capacity: 4, hourlyRate: 150 });
  });

  it("flags every empty field", () => {
    const { errors } = parseFacilityForm(form({ name: "", sportType: " ", location: "", capacity: "", hourlyRate: "" }));
    expect(Object.keys(errors).sort()).toEqual(["capacity", "hourlyRate", "location", "name", "sportType"]);
  });

  it.each(["0", "-1", "2.5", "abc"])("rejects capacity %s", (capacity) => {
    expect(parseFacilityForm(form({ capacity })).errors.capacity).toBeDefined();
  });

  it("allows a free (0) or decimal hourly rate, rejects negative", () => {
    expect(parseFacilityForm(form({ hourlyRate: "0" })).errors.hourlyRate).toBeUndefined();
    expect(parseFacilityForm(form({ hourlyRate: "99.5" })).errors.hourlyRate).toBeUndefined();
    expect(parseFacilityForm(form({ hourlyRate: "-1" })).errors.hourlyRate).toBeDefined();
  });
});
