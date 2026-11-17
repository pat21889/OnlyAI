"use client";

// retry() re-fetches the page data (reset() would only re-render with the same error).
export default function MyBookingError({ retry }: { error: Error; retry: () => void }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <p role="alert" className="text-red-600 mb-4">Couldn&apos;t load your bookings. Is the backend running?</p>
      <button type="button" onClick={() => retry()} className="rounded-lg border border-[#CDB9B5] px-4 py-2">Try again</button>
    </div>
  );
}
