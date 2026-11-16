import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import bookingReducer from "./features/bookingSlice";

// A new store per browser session (and per test), never a shared module-level store,
// so one user's bookings can't leak to another during server rendering.
export const makeStore = () =>
  configureStore({
    reducer: { booking: bookingReducer },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
