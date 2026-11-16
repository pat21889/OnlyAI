import { notFound, redirect } from "next/navigation";
import getSession from "@/libs/getSession";
import getBooking from "@/libs/getBooking";
import getFacilities from "@/libs/getFacilities";
import BookingForm from "@/components/BookingForm";

// Owner or admin. getBooking returns null for someone else's booking (403) as well as a missing one,
// so members can't tell whether another user's booking id exists.
export default async function EditBookingPage({ params }: PageProps<"/mybooking/[bid]/edit">) {
  const [{ bid }, session] = await Promise.all([params, getSession()]);
  if (!session) redirect("/login");

  const [booking, facilities] = await Promise.all([getBooking(session.user.token, bid), getFacilities()]);
  if (!booking) notFound();

  return <BookingForm facilities={facilities} booking={booking} />;
}
