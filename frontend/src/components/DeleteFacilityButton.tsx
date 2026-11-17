"use client";
import { useState, useTransition } from "react";
import { removeFacility } from "@/app/admin/facility/actions";

export default function DeleteFacilityButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function onClick() {
    if (!confirm(`Delete "${name}"? Existing bookings are kept.`)) return;
    startTransition(async () => {
      const res = await removeFacility(id);
      if (res?.message) setError(res.message);
    });
  }

  return (
    <>
      <button type="button" onClick={onClick} disabled={pending} className="text-red-600 hover:underline disabled:opacity-50">
        {pending ? "Deleting..." : "Delete"}
      </button>
      {error && <span role="alert" className="text-sm text-red-600">{error}</span>}
    </>
  );
}
