import { act } from "react";
import { render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import BookingList from "./BookingList";
import { makeStore } from "@/redux/store";
import { removeBooking } from "@/redux/features/bookingSlice";
import type { Booking } from "@/types/booking";

// Delete button imports a server action (next-auth); covered in DeleteBookingButton.test.tsx.
jest.mock("./DeleteBookingButton", () => function DeleteStub() { return <button>Delete</button>; });

const booking = (id: string, overrides: Partial<Booking> = {}): Booking => ({
  _id: id,
  facility: { _id: "f1", name: "Badminton Court 1", sportType: "Badminton", location: "Sports Hall", capacity: 4, hourlyRate: 200 },
  user: { _id: "u1", name: "Somchai", email: "somchai@example.com", tel: "0811111111", role: "member" },
  bookingDate: "2026-11-20T00:00:00.000Z",
  startTime: "18:00",
  durationHours: 1.5,
  createdAt: "",
  updatedAt: "",
  ...overrides,
});

const bookings = [
  booking("a"),
  booking("b", {
    facility: { _id: "f2", name: "Tennis Court", sportType: "Tennis", location: "Zone C", capacity: 4, hourlyRate: 400 },
    user: { _id: "u2", name: "Suda", email: "suda@example.com", tel: "0822222222", role: "member" },
    bookingDate: "2026-11-21T00:00:00.000Z",
    startTime: "07:00",
    durationHours: 2,
  }),
];

const renderList = (items: Booking[], isAdmin = false) => {
  const store = makeStore();
  render(
    <Provider store={store}>
      <BookingList initialBookings={items} isAdmin={isAdmin} />
    </Provider>,
  );
  return store;
};

describe("BookingList", () => {
  it("renders one row per booking with facility, date, time range and duration", () => {
    renderList(bookings);
    const rows = screen.getAllByTestId("booking-row");
    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByText("Badminton Court 1")).toBeInTheDocument();
    expect(within(rows[0]).getByText("2026-11-20")).toBeInTheDocument();
    expect(within(rows[0]).getByText("18:00–19:30")).toBeInTheDocument();
    expect(within(rows[0]).getByText("1.5 hr")).toBeInTheDocument();
    expect(within(rows[0]).getByText("300 THB")).toBeInTheDocument();
    expect(within(rows[1]).getByText("07:00–09:00")).toBeInTheDocument();
    expect(within(rows[1]).getByText("800 THB")).toBeInTheDocument();
  });

  it("has Edit and Delete on every row", () => {
    renderList(bookings);
    expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Edit" }).map((a) => a.getAttribute("href"))).toEqual([
      "/mybooking/a/edit",
      "/mybooking/b/edit",
    ]);
  });

  it("hides the User column for members", () => {
    renderList(bookings);
    expect(screen.queryByRole("columnheader", { name: "User" })).not.toBeInTheDocument();
    expect(screen.queryByText("Somchai")).not.toBeInTheDocument();
  });

  it("shows the User column with name and email for admins", () => {
    renderList(bookings, true);
    expect(screen.getByRole("columnheader", { name: "User" })).toBeInTheDocument();
    expect(screen.getByText("Somchai")).toBeInTheDocument();
    expect(screen.getByText("suda@example.com")).toBeInTheDocument();
  });

  it("shows an empty message when there are no bookings", () => {
    renderList([]);
    expect(screen.getByTestId("no-bookings")).toHaveTextContent("No bookings yet.");
  });

  it("loads the bookings into Redux and re-renders from the store", () => {
    const store = renderList(bookings);
    expect(store.getState().booking).toMatchObject({ loaded: true, items: bookings });

    act(() => {
      store.dispatch(removeBooking("a"));
    });
    expect(screen.getAllByTestId("booking-row")).toHaveLength(1);
    expect(screen.queryByText("Badminton Court 1")).not.toBeInTheDocument();
  });
});
