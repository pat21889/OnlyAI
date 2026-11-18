"use client";
import { useId, useRef, useState } from "react";
import useDismiss from "@/libs/useDismiss";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

// YYYY-MM-DD -> "Wed, 25 Nov 2026" (built from local midnight, so no time zone shifts the day).
function pretty(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

const nav = "flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl font-bold text-blue-600 disabled:opacity-40";

// Themed calendar instead of the browser's date popup. Days before `min` can't be picked.
// The chosen date is posted through a hidden input named `name`.
export default function DatePicker({ name, labelledBy, value, min, invalid, onChange }: {
  name: string;
  labelledBy: string;
  value: string;
  min: string;
  invalid?: boolean;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ y: 0, m: 0 });

  useDismiss(open, box, () => setOpen(false));

  function toggle() {
    if (!open) {
      const [y, m] = (value || min).split("-").map(Number);
      setView({ y, m: m - 1 });
    }
    setOpen(!open);
  }

  const [minY, minM] = min.split("-").map(Number);
  const atMin = view.y * 12 + view.m <= minY * 12 + (minM - 1);
  const go = (delta: number) => setView(({ y, m }) => {
    const t = y * 12 + m + delta;
    return { y: Math.floor(t / 12), m: t % 12 };
  });
  const lead = new Date(view.y, view.m, 1).getDay();
  const count = new Date(view.y, view.m + 1, 0).getDate();

  return (
    <div ref={box} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        id={id}
        aria-labelledby={`${labelledBy} ${id}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        className={`flex w-full items-center justify-between gap-2 rounded-lg bg-white px-3 py-2.5 text-left ${open ? "border-2 border-blue-600" : invalid ? "border-2 border-red-600" : "border border-[#CDB9B5]"}`}
      >
        <span suppressHydrationWarning>{value ? pretty(value) : "Choose a date"}</span>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#850909" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>
      {open && (
        <div role="dialog" aria-label="Choose date" className="absolute left-0 top-full z-10 mt-2 w-80 max-w-full rounded-xl border border-[#E8D9D6] bg-white p-4 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" aria-label="Previous month" disabled={atMin} onClick={() => go(-1)} className={nav}>&lsaquo;</button>
            <span className="font-display text-lg font-bold">{MONTHS[view.m]} {view.y}</span>
            <button type="button" aria-label="Next month" onClick={() => go(1)} className={nav}>&rsaquo;</button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} className="py-1.5 text-[13px] font-semibold text-zinc-600">{d}</span>)}
            {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: count }, (_, i) => {
              const day = iso(view.y, view.m, i + 1);
              const past = day < min;
              const picked = day === value;
              return (
                <button
                  key={day}
                  type="button"
                  data-date={day}
                  disabled={past}
                  aria-pressed={picked}
                  aria-label={pretty(day)}
                  onClick={() => { onChange(day); setOpen(false); }}
                  className={`h-10 rounded-lg font-medium ${picked ? "bg-blue-600 font-semibold text-white" : day === min ? "border-2 border-blue-600 font-semibold text-blue-600" : past ? "cursor-not-allowed text-[#B9A8A5]" : "hover:bg-blue-50"}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
