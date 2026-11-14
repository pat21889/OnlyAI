"use client";
import { useActionState } from "react";
import { saveFacility } from "@/app/admin/facility/actions";
import type { Facility } from "@/types/facility";

const fields = [
  { name: "name", label: "Name", type: "text" },
  { name: "sportType", label: "Sport type", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "capacity", label: "Capacity (people)", type: "number" },
  { name: "hourlyRate", label: "Hourly rate (THB)", type: "number" },
] as const;

export default function FacilityForm({ facility }: { facility?: Facility }) {
  const [state, action, pending] = useActionState(saveFacility.bind(null, facility?._id), {});

  return (
    <form action={action} noValidate className="max-w-md mx-auto mt-10 flex flex-col gap-4 bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-semibold">{facility ? "Edit facility" : "Add facility"}</h1>
      {fields.map((f) => (
        <label key={f.name} className="flex flex-col gap-1">{f.label}
          <input
            name={f.name}
            type={f.type}
            list={f.name === "sportType" ? "sport-types" : undefined}
            step={f.name === "hourlyRate" ? "any" : undefined}
            defaultValue={state.values?.[f.name] ?? facility?.[f.name]}
            aria-invalid={!!state.errors?.[f.name]}
            className="border rounded px-3 py-2"
          />
          {state.errors?.[f.name] && <span className="text-sm text-red-600">{state.errors[f.name]}</span>}
        </label>
      ))}
      <datalist id="sport-types">
        {["Badminton", "Tennis", "Futsal", "Basketball", "Gym"].map((s) => <option key={s} value={s} />)}
      </datalist>
      {state.message && <p role="alert" className="text-red-600">{state.message}</p>}
      <button disabled={pending} className="rounded bg-blue-600 py-2 text-white disabled:opacity-50">
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
