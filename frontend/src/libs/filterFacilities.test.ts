import filterFacilities from "./filterFacilities";
import type { Facility } from "@/types/facility";

const make = (name: string, sportType: string, location: string, hourlyRate: number) =>
  ({ _id: name, name, sportType, location, capacity: 4, hourlyRate, createdAt: "", updatedAt: "" }) as Facility;

const list = [
  make("Badminton Court 1", "Badminton", "Sports Hall", 200),
  make("Tennis Court", "Tennis", "Outdoor Zone", 400),
  make("Badminton Court 2", "Badminton", "Outdoor Zone", 150),
];

describe("filterFacilities", () => {
  it("returns everything when no filter is set or values are blank/invalid", () => {
    expect(filterFacilities(list, {})).toHaveLength(3);
    expect(filterFacilities(list, { q: " ", sport: "", maxPrice: "abc" })).toHaveLength(3);
  });
  it("matches text against name or location, case-insensitively", () => {
    expect(filterFacilities(list, { q: "outdoor" }).map((f) => f.name)).toEqual(["Tennis Court", "Badminton Court 2"]);
    expect(filterFacilities(list, { q: "COURT 1" })).toHaveLength(1);
  });
  it("filters by sport and max price (inclusive), combined with AND", () => {
    expect(filterFacilities(list, { sport: "Badminton" })).toHaveLength(2);
    expect(filterFacilities(list, { maxPrice: "200" })).toHaveLength(2);
    expect(filterFacilities(list, { sport: "Badminton", maxPrice: "150", q: "outdoor" })).toHaveLength(1);
  });
});
