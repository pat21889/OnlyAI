"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setBookings } from "@/redux/features/bookingSlice";
import { bookingDay, endTime } from "@/libs/bookingTime";
import DeleteBookingButton from "./DeleteBookingButton";
import type { Booking } from "@/types/booking";

type Props = { initialBookings: Booking[]; isAdmin: boolean };

// Loads the server-fetched bookings into Redux, then renders from the store
// so edits/deletes can update the list without a full reload.
export default function BookingList({ initialBookings, isAdmin }: Props) {
  const dispatch = useAppDispatch();
  const { items, loaded } = useAppSelector((s) => s.booking);

  useEffect(() => {
    dispatch(setBookings(initialBookings));
  }, [dispatch, initialBookings]);

  // Before the effect runs (server render, first paint) the store is still empty.
  const bookings = loaded ? items : initialBookings;

  if (bookings.length === 0) {
    return <p data-testid="no-bookings" className="text-zinc-600">No bookings yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded bg-white shadow">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-zinc-100 text-zinc-700">
          <tr>
            <th className="px-4 py-3">Facility</th>
            {isAdmin && <th className="px-4 py-3">User</th>}
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id} data-testid="booking-row" className="border-b last:border-0">
              <td className="px-4 py-3">
                <div className="font-medium">{b.facility?.name ?? "(deleted facility)"}</div>
                {b.facility && <div className="text-xs text-zinc-500">{b.facility.sportType} · {b.facility.location}</div>}
              </td>
              {isAdmin && (
                <td className="px-4 py-3">
                  <div>{b.user?.name ?? "(deleted user)"}</div>
                  {b.user && <div className="text-xs text-zinc-500">{b.user.email}</div>}
                </td>
              )}
              <td className="px-4 py-3">{bookingDay(b.bookingDate)}</td>
              <td className="px-4 py-3">{b.startTime}–{endTime(b.startTime, b.durationHours)}</td>
              <td className="px-4 py-3">{b.durationHours} hr</td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <Link href={`/mybooking/${b._id}/edit`} className="mr-4 text-blue-600 hover:underline">Edit</Link>
                <DeleteBookingButton
                  id={b._id}
                  label={`${b.facility?.name ?? ""} on ${bookingDay(b.bookingDate)} at ${b.startTime}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
