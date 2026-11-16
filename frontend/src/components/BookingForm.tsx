"use client";
import { useActionState } from "react";
import Link from "next/link";
import { saveBooking } from "@/app/booking/actions";
import { MAX_HOURS, MIN_HOURS, todayString } from "@/libs/parseBookingForm";
import type { Facility } from "@/types/facility";

type Props = { facilities: Facility[]; defaultFacilityId?: string };

export default function BookingForm({ facilities, defaultFacilityId }: Props) {
  const [state, action, pending] = useActionState(saveBooking, {});
  const v = state.values;
  const err = state.errors ?? {};

  return (
    // key: remount after each submit so defaultValues reflect what the action echoed back
    <form
      key={JSON.stringify(state)}
      action={action}
      noValidate
      className="max-w-md mx-auto mt-10 flex flex-col gap-4 bg-white p-8 rounded shadow"
    >
      <h1 className="text-2xl font-semibold">Book a facility</h1>

      <label className="flex flex-col gap-1">Facility
        <select
          name="facility"
          defaultValue={v?.facility ?? defaultFacilityId ?? ""}
          aria-invalid={!!err.facility}
          className="border rounded px-3 py-2"
        >
          <option value="" disabled>Choose a facility</option>
          {facilities.map((f) => (
            <option key={f._id} value={f._id}>{f.name} ({f.sportType}, {f.hourlyRate} THB/hour)</option>
          ))}
        </select>
        {err.facility && <span className="text-sm text-red-600">{err.facility}</span>}
      </label>

      <label className="flex flex-col gap-1">Date
        <input
          name="bookingDate"
          type="date"
          min={todayString()}
          suppressHydrationWarning // server and browser may be in different time zones
          defaultValue={v?.bookingDate}
          aria-invalid={!!err.bookingDate}
          className="border rounded px-3 py-2"
        />
        {err.bookingDate && <span className="text-sm text-red-600">{err.bookingDate}</span>}
      </label>

      <label className="flex flex-col gap-1">Start time
        <input
          name="startTime"
          type="time"
          defaultValue={v?.startTime}
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
          defaultValue={v?.durationHours ?? "1"}
          aria-invalid={!!err.durationHours}
          className="border rounded px-3 py-2"
        />
        {err.durationHours && <span className="text-sm text-red-600">{err.durationHours}</span>}
      </label>

      {state.message && <p role="alert" className="text-red-600">{state.message}</p>}
      {state.success && (
        <p role="status" data-testid="booking-success" className="rounded bg-green-50 p-3 text-green-700">
          {state.success}. <Link href="/mybooking" className="underline">View my bookings</Link>
        </p>
      )}

      <button disabled={pending} className="rounded bg-blue-600 py-2 text-white disabled:opacity-50">
        {pending ? "Booking..." : "Book"}
      </button>
    </form>
  );
}
