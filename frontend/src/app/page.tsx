import Link from "next/link";

const SPORTS = ["Badminton", "Basketball", "Football", "Swimming", "Tennis"];
const STEPS = [
  ["Find a facility", "Search or filter by sport, location and price."],
  ["Choose a time", "Pick a date, start time and how many hours."],
  ["Show up and play", "Manage or cancel any time from My Bookings."],
];

export default function Home() {
  return (
    <div>
      <section className="bg-blue-600 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-20 md:py-28">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#F3D6D2]">Courts, fields and pools</span>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-6xl">Book sports facilities in seconds</h1>
          <p className="max-w-lg text-lg text-[#F3D6D2]">Badminton, tennis, basketball, football and swimming. Pick a facility, choose a time, done.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/facility" className="rounded-lg bg-white px-7 py-3.5 font-semibold text-blue-600 hover:bg-blue-50">Browse facilities</Link>
            <Link href="/booking" className="rounded-lg border-2 border-white px-7 py-3 font-semibold hover:bg-white/10">Book now</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pt-14">
        <h2 className="mb-1 text-3xl font-bold">Pick your sport</h2>
        <p className="mb-6 text-zinc-600">Jump straight to the courts you need.</p>
        <div className="flex flex-wrap gap-3">
          {SPORTS.map((s) => (
            <Link key={s} href={`/facility?sport=${s}`} className="rounded-full bg-blue-50 px-5 py-3 font-semibold text-blue-600 hover:bg-[#efd3d0]">{s}</Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="mb-6 text-3xl font-bold">How it works</h2>
        <ol className="grid gap-6 sm:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="flex flex-col gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-display text-xl font-bold text-white">{i + 1}</span>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-zinc-600">{body}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
