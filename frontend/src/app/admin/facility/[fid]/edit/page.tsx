import { notFound } from "next/navigation";
import getFacility from "@/libs/getFacility";
import FacilityForm from "@/components/FacilityForm";

export default async function EditFacilityPage({ params }: PageProps<"/admin/facility/[fid]/edit">) {
  const facility = await getFacility((await params).fid);
  if (!facility) notFound();
  return <FacilityForm facility={facility} />;
}
