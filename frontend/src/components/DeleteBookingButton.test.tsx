import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import DeleteBookingButton from "./DeleteBookingButton";
import { makeStore } from "@/redux/store";
import { setBookings } from "@/redux/features/bookingSlice";
import { removeBookingAction } from "@/app/mybooking/actions";
import type { Booking } from "@/types/booking";

// The real action pulls in next-auth and calls the backend.
jest.mock("@/app/mybooking/actions", () => ({ removeBookingAction: jest.fn() }));
const action = removeBookingAction as jest.Mock;

const booking = (id: string) => ({ _id: id }) as Booking;

const setup = () => {
  const store = makeStore();
  store.dispatch(setBookings([booking("a"), booking("b")]));
  render(
    <Provider store={store}>
      <DeleteBookingButton id="a" label="Court A on 2026-11-20" />
    </Provider>,
  );
  return store;
};

const ids = (store: ReturnType<typeof makeStore>) => store.getState().booking.items.map((b) => b._id);

beforeEach(() => {
  action.mockReset();
  jest.spyOn(window, "confirm");
});

describe("DeleteBookingButton", () => {
  it("does nothing when the user cancels the confirm dialog", () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    const store = setup();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(window.confirm).toHaveBeenCalledWith("Delete booking Court A on 2026-11-20?");
    expect(action).not.toHaveBeenCalled();
    expect(ids(store)).toEqual(["a", "b"]);
  });

  it("deletes and removes the booking from the store after confirming", async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    action.mockResolvedValue({});
    const store = setup();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => expect(ids(store)).toEqual(["b"]));
    expect(action).toHaveBeenCalledWith("a");
  });

  it("shows the backend error and keeps the booking", async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    action.mockResolvedValue({ message: "Not authorized to delete this booking" });
    const store = setup();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Not authorized to delete this booking");
    expect(ids(store)).toEqual(["a", "b"]);
  });
});
