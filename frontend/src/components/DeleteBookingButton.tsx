"use client";
import { useState, useTransition } from "react";
import { removeBookingAction } from "@/app/mybooking/actions";
import { useAppDispatch } from "@/redux/store";
import { removeBooking } from "@/redux/features/bookingSlice";

type Props = { id: string; label: string }; // label: shown in the confirm dialog

export default function DeleteBookingButton({ id, label }: Props) {
  const dispatch = useAppDispatch();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function onClick() {
    if (!confirm(`Delete booking ${label}?`)) return;
    setError("");
    startTransition(async () => {
      const res = await removeBookingAction(id);
      if (res.message) setError(res.message);
      else dispatch(removeBooking(id));
    });
  }

  return (
    <>
      <button onClick={onClick} disabled={pending} className="text-red-600 hover:underline disabled:opacity-50">
        {pending ? "Deleting..." : "Delete"}
      </button>
      {error && <span role="alert" className="block text-xs text-red-600">{error}</span>}
    </>
  );
}
