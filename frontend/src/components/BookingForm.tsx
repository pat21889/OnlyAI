"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { saveBooking } from "@/app/booking/actions";
import { editBooking } from "@/app/mybooking/actions";
import { MAX_HOURS, MIN_HOURS, todayString } from "@/libs/parseBookingForm";
import { bookingDay, formatPrice, totalPrice } from "@/libs/bookingTime";
import type { Booking } from "@/types/booking";
import type { Facility } from "@/types/facility";

// booking undefined → create (member only), otherwise edit that booking (owner or admin).
type Props = { facilities: Facility[]; defaultFacilityId?: string; booking?: Booking };

export default function BookingForm({ facilities, defaultFacilityId, booking }: Props) {
  const isEdit = !!booking;
  const [state, action, pending] = useActionState(isEdit ? editBooking.bind(null, booking._id) : saveBooking, {});
  const v = state.values;
  const err = state.errors ?? {};

  // Values shown when the form first opens: what the action echoed back, else the booking being edited.
  const initial = {
    facility: v?.facility ?? booking?.facility?._id ?? defaultFacilityId ?? "",
    bookingDate: v?.bookingDate ?? (booking ? bookingDay(booking.bookingDate) : undefined),
    startTime: v?.startTime ?? booking?.startTime,
    durationHours: v?.durationHours ?? String(booking?.durationHours ?? 1),
  };
  // The facility list only has active facilities; a booking may point at one that was closed since.
  const facilityGone = isEdit && !facilities.some((f) => f._id === booking.facility?._id);
  const initialFacility = facilityGone && !v ? "" : initial.facility;

  // Facility and duration are tracked only to show the price; the inputs stay uncontrolled.
  // Reset them whenever the action returns, because the form remounts with new defaults.
  const [picked, setPicked] = useState({ facility: initialFacility, duration: initial.durationHours });
  const [seenState, setSeenState] = useState(state);
  if (seenState !== state) {
    setSeenState(state);
    setPicked({ facility: initialFacility, duration: initial.durationHours });
  }
  const rate = facilities.find((f) => f._id === picked.facility)?.hourlyRate;
  const hours = Number(picked.duration);
  const price = totalPrice(rate, hours);

  return (
    // key: remount after each submit so defaultValues reflect what the action echoed back
    <form
      key={JSON.stringify(state)}
      action={action}
      noValidate
      className="max-w-md mx-auto mt-10 flex flex-col gap-4 bg-white p-8 rounded shadow"
    >
      <h1 className="text-2xl font-semibold">{isEdit ? "Edit booking" : "Book a facility"}</h1>
      {isEdit && booking.user && <p className="text-sm text-zinc-600">Booked by {booking.user.name}</p>}

      <label className="flex flex-col gap-1">Facility
        <select
          name="facility"
          defaultValue={initialFacility}
          onChange={(e) => setPicked((p) => ({ ...p, facility: e.target.value }))}
          aria-invalid={!!err.facility}
          className="border rounded px-3 py-2"
        >
          <option value="" disabled>Choose a facility</option>
          {facilities.map((f) => (
            <option key={f._id} value={f._id}>{f.name} ({f.sportType}, {f.hourlyRate} THB/hour)</option>
          ))}
        </select>
        {facilityGone && !err.facility && (
          <span className="text-sm text-amber-700">
            {booking.facility?.name ?? "The original facility"} is no longer available. Please choose another one.
          </span>
        )}
        {err.facility && <span className="text-sm text-red-600">{err.facility}</span>}
      </label>

      <label className="flex flex-col gap-1">Date
        <input
          name="bookingDate"
          type="date"
          min={todayString()}
          suppressHydrationWarning // server and browser may be in different time zones
          defaultValue={initial.bookingDate}
          aria-invalid={!!err.bookingDate}
          className="border rounded px-3 py-2"
        />
        {err.bookingDate && <span className="text-sm text-red-600">{err.bookingDate}</span>}
      </label>

      <label className="flex flex-col gap-1">Start time
        <input
          name="startTime"
          type="time"
          defaultValue={initial.startTime}
          aria-invalid={!!err.startTime}
          className="border rounded px-3 py-2"
        />
        {err.startTime && <span className="text-sm text-red-600">{err.startTime}</span>}
      </label>

      <label className="flex flex-col gap-1">Duration (hours, {MIN_HOURS}–{MAX_HOURS})
        <input
          name="durationHours"
          type="number"
          step="0.5"
          min={MIN_HOURS}
          max={MAX_HOURS}
          defaultValue={initial.durationHours}
          onChange={(e) => setPicked((p) => ({ ...p, duration: e.target.value }))}
          aria-invalid={!!err.durationHours}
          className="border rounded px-3 py-2"
        />
        {err.durationHours && <span className="text-sm text-red-600">{err.durationHours}</span>}
      </label>

      <p data-testid="total-price" aria-live="polite" className="rounded bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
        {rate === undefined
          ? "Choose a facility to see the price"
          : price === null
            ? `Enter a duration of ${MIN_HOURS}–${MAX_HOURS} hours to see the price`
            : <>Total: <strong className="text-base text-zinc-900">{formatPrice(price)} THB</strong></>}
      </p>

      {state.message && <p role="alert" className="text-red-600">{state.message}</p>}
      {state.success && (
        <p role="status" data-testid="booking-success" className="rounded bg-green-50 p-3 text-green-700">
          {state.success}. <Link href="/mybooking" className="underline">View my bookings</Link>
        </p>
      )}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="flex-1 rounded bg-blue-600 py-2 text-white disabled:opacity-50">
          {isEdit ? (pending ? "Saving..." : "Save changes") : (pending ? "Booking..." : "Book")}
        </button>
        {isEdit && <Link href="/mybooking" className="text-zinc-600 hover:underline">Cancel</Link>}
      </div>
    </form>
  );
}
