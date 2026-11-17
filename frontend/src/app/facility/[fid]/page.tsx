import Link from "next/link";
import { notFound } from "next/navigation";
import getFacility from "@/libs/getFacility";
import getSession from "@/libs/getSession";
import DeleteFacilityButton from "@/components/DeleteFacilityButton";

export default async function FacilityDetailPage({ params }: PageProps<"/facility/[fid]">) {
  const { fid } = await params;
  const [facility, session] = await Promise.all([getFacility(fid), getSession()]);
  if (!facility) notFound();
  const isAdmin = session?.user.role === "admin";

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link href="/facility" className="text-blue-600 hover:underline">← All facilities</Link>
      <div className="mt-4 rounded-xl border border-[#E8D9D6] bg-white p-8">
        <h1 className="text-3xl font-bold mb-2">{facility.name}</h1>
        <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">{facility.sportType}</span>
        <dl className="mt-6 grid grid-cols-2 gap-y-3">
          <dt className="text-zinc-500">Location</dt><dd>{facility.location}</dd>
          <dt className="text-zinc-500">Capacity</dt><dd>{facility.capacity} people</dd>
          <dt className="text-zinc-500">Hourly rate</dt><dd>{facility.hourlyRate} THB</dd>
        </dl>
        <div className="mt-8 flex items-center gap-4">
          {/* Admins can't create bookings (backend rule), so they get manage controls instead. */}
          {isAdmin ? (
            <>
              <Link href={`/admin/facility/${facility._id}/edit`} className="rounded-lg border border-[#CDB9B5] px-4 py-2">Edit</Link>
              <DeleteFacilityButton id={facility._id} name={facility.name} />
            </>
          ) : (
            <Link href={`/booking?fid=${facility._id}`} className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              Book this facility
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
