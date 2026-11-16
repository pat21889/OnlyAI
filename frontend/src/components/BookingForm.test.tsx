import { render, screen } from "@testing-library/react";
import BookingForm from "./BookingForm";
import type { Facility } from "@/types/facility";

// The server action pulls in next-auth; rendering checks don't need it.
jest.mock("@/app/booking/actions", () => ({ saveBooking: jest.fn() }));

const base = { location: "Building 1", capacity: 4, createdAt: "", updatedAt: "" };
const facilities: Facility[] = [
  { _id: "507f1f77bcf86cd799439011", name: "Court A", sportType: "Badminton", hourlyRate: 150, ...base },
  { _id: "507f1f77bcf86cd799439012", name: "Court B", sportType: "Tennis", hourlyRate: 200, ...base },
];

describe("BookingForm", () => {
  it("renders facility, date, time and duration fields", () => {
    render(<BookingForm facilities={facilities} />);
    expect(screen.getByRole("combobox", { name: "Facility" })).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toHaveAttribute("type", "date");
    expect(screen.getByLabelText("Start time")).toHaveAttribute("type", "time");
    expect(screen.getByRole("spinbutton", { name: /Duration/ })).toHaveValue(1);
    expect(screen.getByRole("button", { name: "Book" })).toBeInTheDocument();
  });

  it("lists every facility with its rate", () => {
    render(<BookingForm facilities={facilities} />);
    expect(screen.getByRole("option", { name: "Court A (Badminton, 150 THB/hour)" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Court B (Tennis, 200 THB/hour)" })).toBeInTheDocument();
  });

  it("preselects the facility from ?fid=", () => {
    render(<BookingForm facilities={facilities} defaultFacilityId={facilities[1]._id} />);
    expect(screen.getByRole("combobox", { name: "Facility" })).toHaveValue(facilities[1]._id);
  });

  it("starts with no facility selected when fid is missing", () => {
    render(<BookingForm facilities={facilities} />);
    expect(screen.getByRole("combobox", { name: "Facility" })).toHaveValue("");
  });
});
