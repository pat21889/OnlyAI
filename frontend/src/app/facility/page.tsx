import Link from "next/link";
import getFacilities from "@/libs/getFacilities";
import getSession from "@/libs/getSession";
import FacilityCard from "@/components/FacilityCard";
import filterFacilities from "@/libs/filterFacilities";

export default async function FacilityPage({ searchParams }: PageProps<"/facility">) {
  const [params, all, session] = await Promise.all([searchParams, getFacilities(), getSession()]);
  // Query params can repeat (string[]); keep only the first value.
  const [q, sport, maxPrice] = ["q", "sport", "maxPrice"].map((k) => [params[k]].flat()[0] ?? "");
  const facilities = filterFacilities(all, { q, sport, maxPrice });
  const sportTypes = [...new Set(all.map((f) => f.sportType))].sort();
  const isAdmin = session?.user.role === "admin";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Facilities</h1>
        {isAdmin && (
          <Link href="/admin/facility/new" className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">+ Add facility</Link>
        )}
      </div>
      <form method="get" className="mb-6 flex flex-wrap gap-3" data-testid="facility-filter">
        <input name="q" defaultValue={q} placeholder="Search name or location" aria-label="Search" className="flex-1 min-w-48 rounded-lg border border-[#CDB9B5] px-3 py-2.5" />
        <select name="sport" defaultValue={sport} aria-label="Sport type" className="rounded-lg border border-[#CDB9B5] px-3 py-2.5">
          <option value="">All sports</option>
          {sportTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input name="maxPrice" type="number" min="0" defaultValue={maxPrice} placeholder="Max price/hr" aria-label="Max price per hour" className="w-36 rounded-lg border border-[#CDB9B5] px-3 py-2.5" />
        <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">Filter</button>
        <Link href="/facility" className="px-2 py-2 text-blue-600 hover:underline">Clear</Link>
      </form>
      {facilities.length === 0 ? (
        <p className="text-zinc-600">{all.length === 0 ? "No facilities yet." : "No facilities match your filters."}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => <FacilityCard key={f._id} facility={f} isAdmin={isAdmin} />)}
        </div>
      )}
    </div>
  );
}
