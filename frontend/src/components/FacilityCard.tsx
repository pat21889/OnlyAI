import Link from "next/link";
import type { Facility } from "@/types/facility";
import DeleteFacilityButton from "./DeleteFacilityButton";

export default function FacilityCard({ facility, isAdmin }: { facility: Facility; isAdmin: boolean }) {
  return (
    <div data-testid="facility-card" className="rounded bg-white p-5 shadow flex flex-col gap-2">
      <Link href={`/facility/${facility._id}`} className="text-lg font-semibold text-blue-700 hover:underline">
        {facility.name}
      </Link>
      <span className="w-fit rounded bg-blue-50 px-2 py-0.5 text-sm text-blue-700">{facility.sportType}</span>
      <p className="text-zinc-600">{facility.location}</p>
      <p className="text-sm">Up to {facility.capacity} people · {facility.hourlyRate} THB/hour</p>
      {isAdmin && (
        <div className="mt-2 flex items-center gap-4 border-t pt-2">
          <Link href={`/admin/facility/${facility._id}/edit`} className="hover:underline">Edit</Link>
          <DeleteFacilityButton id={facility._id} name={facility.name} />
        </div>
      )}
    </div>
  );
}
