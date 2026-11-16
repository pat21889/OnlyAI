import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Booking } from "@/types/booking";

// Client-side copy of the bookings shown on /mybooking.
// The server page fetches the list and BookingList loads it in with setBookings.
// loaded: false until setBookings runs, so BookingList can show the server data meanwhile.
export type BookingState = { items: Booking[]; loaded: boolean };

const initialState: BookingState = { items: [], loaded: false };

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookings(state, action: PayloadAction<Booking[]>) {
      state.items = action.payload;
      state.loaded = true;
    },
    addBooking(state, action: PayloadAction<Booking>) {
      if (!state.items.some((b) => b._id === action.payload._id)) state.items.push(action.payload);
    },
    updateBooking(state, action: PayloadAction<Booking>) {
      const i = state.items.findIndex((b) => b._id === action.payload._id);
      if (i !== -1) state.items[i] = action.payload;
    },
    removeBooking(state, action: PayloadAction<string>) {
      state.items = state.items.filter((b) => b._id !== action.payload);
    },
    clearBookings(state) {
      state.items = [];
      state.loaded = false;
    },
  },
});

export const { setBookings, addBooking, updateBooking, removeBooking, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
