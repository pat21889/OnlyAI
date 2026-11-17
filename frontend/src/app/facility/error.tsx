"use client";

export default function FacilityError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <p role="alert" className="text-red-600 mb-4">Couldn&apos;t load facilities. Is the backend running?</p>
      <button type="button" onClick={reset} className="rounded-lg border border-[#CDB9B5] px-4 py-2">Try again</button>
    </div>
  );
}
