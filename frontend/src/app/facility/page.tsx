import Link from "next/link";
import getFacilities from "@/libs/getFacilities";
import getSession from "@/libs/getSession";
import FacilityCard from "@/components/FacilityCard";

export default async function FacilityPage() {
  const [facilities, session] = await Promise.all([getFacilities(), getSession()]);
  const isAdmin = session?.user.role === "admin";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Facilities</h1>
        {isAdmin && (
          <Link href="/admin/facility/new" className="rounded bg-blue-600 px-4 py-2 text-white">+ Add facility</Link>
        )}
      </div>
      {facilities.length === 0 ? (
        <p className="text-zinc-600">No facilities yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => <FacilityCard key={f._id} facility={f} isAdmin={isAdmin} />)}
        </div>
      )}
    </div>
  );
}
