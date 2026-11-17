import { fireEvent, render, screen } from "@testing-library/react";
import BookingForm from "./BookingForm";
import type { Facility } from "@/types/facility";
import type { Booking } from "@/types/booking";

// The server action pulls in next-auth; rendering checks don't need it.
jest.mock("@/app/booking/actions", () => ({ saveBooking: jest.fn() }));
jest.mock("@/app/mybooking/actions", () => ({ editBooking: jest.fn() }));

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
  it("shows no price until a facility is chosen", () => {
    render(<BookingForm facilities={facilities} />);
    expect(screen.getByTestId("total-price")).toHaveTextContent("Choose a facility to see the price");
  });

  it("shows the total price and updates it when facility or duration changes", () => {
    render(<BookingForm facilities={facilities} defaultFacilityId={facilities[0]._id} />);
    expect(screen.getByTestId("total-price")).toHaveTextContent("Total: 150 THB (150 THB/hour × 1 hr)");

    fireEvent.change(screen.getByRole("spinbutton", { name: /Duration/ }), { target: { value: "1.5" } });
    expect(screen.getByTestId("total-price")).toHaveTextContent("Total: 225 THB (150 THB/hour × 1.5 hr)");

    fireEvent.change(screen.getByRole("combobox", { name: "Facility" }), { target: { value: facilities[1]._id } });
    expect(screen.getByTestId("total-price")).toHaveTextContent("Total: 300 THB (200 THB/hour × 1.5 hr)");
  });

  it("hides the total when the duration is invalid", () => {
    render(<BookingForm facilities={facilities} defaultFacilityId={facilities[0]._id} />);
    fireEvent.change(screen.getByRole("spinbutton", { name: /Duration/ }), { target: { value: "3" } });
    expect(screen.getByTestId("total-price")).toHaveTextContent("Enter a duration of 0.5–2 hours to see the price");
  });
});

describe("BookingForm (edit mode)", () => {
  const booking: Booking = {
    _id: "507f1f77bcf86cd7994390aa",
    facility: { _id: facilities[1]._id, name: "Court B", sportType: "Tennis", location: "Building 1", capacity: 4, hourlyRate: 200 },
    user: { _id: "u1", name: "Somchai", email: "somchai@example.com", tel: "0811111111", role: "member" },
    bookingDate: "2026-11-20T00:00:00.000Z",
    startTime: "18:30",
    durationHours: 1.5,
    createdAt: "",
    updatedAt: "",
  };

  it("fills the fields from the booking", () => {
    render(<BookingForm facilities={facilities} booking={booking} />);
    expect(screen.getByRole("heading", { name: "Edit booking" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Facility" })).toHaveValue(facilities[1]._id);
    expect(screen.getByLabelText("Date")).toHaveValue("2026-11-20");
    expect(screen.getByLabelText("Start time")).toHaveValue("18:30");
    expect(screen.getByRole("spinbutton", { name: /Duration/ })).toHaveValue(1.5);
    expect(screen.getByText("Booked by Somchai")).toBeInTheDocument();
    expect(screen.getByTestId("total-price")).toHaveTextContent("Total: 300 THB (200 THB/hour × 1.5 hr)");
  });

  it("shows Save changes and a Cancel link back to My Bookings", () => {
    render(<BookingForm facilities={facilities} booking={booking} />);
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute("href", "/mybooking");
  });

  it("asks for another facility when the booked one is no longer active", () => {
    const closed = { ...booking, facility: { ...booking.facility, _id: "507f1f77bcf86cd7994390ff", name: "Old Court" } };
    render(<BookingForm facilities={facilities} booking={closed} />);
    // The hint sits inside the <label>, so it becomes part of the select's accessible name.
    expect(screen.getByRole("combobox", { name: /^Facility/ })).toHaveValue("");
    expect(screen.getByText(/Old Court is no longer available/)).toBeInTheDocument();
  });
});
