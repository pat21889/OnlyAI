import FacilityForm from "@/components/FacilityForm";

// Admin-only: src/proxy.ts redirects non-admins away from /admin/*.
export default function NewFacilityPage() {
  return <FacilityForm />;
}
