"use client";
import { useId, useRef, useState } from "react";
import useDismiss from "@/libs/useDismiss";

const pad = (n: number) => String(n).padStart(2, "0");
const SIZE = 240;
const C = SIZE / 2;

const hourOf = (v: string) => (/^\d{2}:\d{2}$/.test(v) ? Number(v.slice(0, 2)) : null);
const at = (deg: number, r: number) => [C + r * Math.sin((deg * Math.PI) / 180), C - r * Math.cos((deg * Math.PI) / 180)];

// 24-hour analog clock: tap the hour (00-11 outer ring, 12-23 inner ring), then :00 or :30.
// Bookings start on the hour or half hour (the shortest booking is 30 minutes).
// The chosen time is posted through a hidden input named `name`.
export default function TimePicker({ name, labelledBy, value, invalid, isDisabled, onChange }: {
  name: string;
  labelledBy: string;
  value: string;
  invalid?: boolean;
  isDisabled: (slot: string) => boolean;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"hour" | "minute">("hour");
  const [hour, setHour] = useState<number | null>(null);
  useDismiss(open, box, () => setOpen(false));

  function toggle() {
    if (!open) {
      setHour(hourOf(value));
      setMode("hour");
    }
    setOpen(!open);
  }

  type Item = { label: string; deg: number; r: number; d: number; off: boolean; on: boolean; pick: () => void };
  const items: Item[] = mode === "hour"
    ? Array.from({ length: 24 }, (_, h) => ({
      label: pad(h),
      deg: (h % 12) * 30,
      r: h < 12 ? 98 : 62, // outer ring 00-11, inner ring 12-23
      d: h < 12 ? 36 : 32,
      off: isDisabled(`${pad(h)}:00`) && isDisabled(`${pad(h)}:30`),
      on: h === hour,
      pick: () => { setHour(h); setMode("minute"); },
    }))
    : hour === null ? [] : (["00", "30"] as const).map((min) => ({
      label: min,
      deg: min === "00" ? 0 : 180,
      r: 84,
      d: 40,
      off: isDisabled(`${pad(hour)}:${min}`),
      on: `${pad(hour)}:${min}` === value,
      pick: () => { onChange(`${pad(hour)}:${min}`); setOpen(false); },
    }));
  const hand = items.find((i) => i.on);

  const seg = (on: boolean) => `rounded-lg px-2.5 ${on ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`;

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
        <span>{value || "Select time"}</span>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#850909" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
        </svg>
      </button>
      {open && (
        <div role="dialog" aria-label="Choose time" className="absolute left-0 top-full z-10 mt-2 w-72 max-w-full rounded-xl border border-[#E8D9D6] bg-white p-4 shadow-xl">
          <div className="mb-3.5 flex items-center gap-1 font-display text-4xl font-bold">
            <button type="button" aria-label="Choose hour" onClick={() => setMode("hour")} className={seg(mode === "hour")}>{hour === null ? "--" : pad(hour)}</button>
            <span>:</span>
            <button type="button" aria-label="Choose minutes" disabled={hour === null} onClick={() => setMode("minute")} className={seg(mode === "minute")}>{value ? value.slice(3) : "--"}</button>
          </div>
          <div className="relative mx-auto rounded-full bg-blue-50" style={{ width: SIZE, height: SIZE }}>
            <svg aria-hidden="true" width={SIZE} height={SIZE} className="absolute left-0 top-0">
              {hand && <line x1={C} y1={C} x2={at(hand.deg, hand.r)[0]} y2={at(hand.deg, hand.r)[1]} stroke="#850909" strokeWidth="2" />}
              <circle cx={C} cy={C} r="4" fill="#850909" />
            </svg>
            {items.map((i) => {
              const [x, y] = at(i.deg, i.r);
              return (
                <button
                  key={i.label}
                  type="button"
                  disabled={i.off}
                  aria-pressed={i.on}
                  aria-label={mode === "hour" ? `${i.label} o'clock` : `${pad(hour!)}:${i.label}`}
                  onClick={i.pick}
                  style={{ left: x - i.d / 2, top: y - i.d / 2, width: i.d, height: i.d }}
                  className={`absolute flex items-center justify-center rounded-full font-semibold ${i.on ? "bg-blue-600 text-white" : i.off ? "cursor-not-allowed text-[#B9A8A5]" : "hover:bg-[#efd3d0]"}`}
                >
                  {i.label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-center text-[13px] text-zinc-600">
            {mode === "hour" ? "Hours already passed today are greyed out." : "Bookings start on the hour or half hour."}
          </p>
        </div>
      )}
    </div>
  );
}
