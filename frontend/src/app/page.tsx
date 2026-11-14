import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Book sports facilities in seconds</h1>
      <p className="text-zinc-600 mb-8">Badminton, tennis, futsal courts and gyms.</p>
      <Link href="/facility" className="inline-block rounded bg-blue-600 px-6 py-3 text-white">
        Browse facilities
      </Link>
    </div>
  );
}
