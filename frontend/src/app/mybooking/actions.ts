"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getSession from "@/libs/getSession";
import deleteBooking from "@/libs/deleteBooking";
import updateBooking from "@/libs/updateBooking";
import parseBookingForm from "@/libs/parseBookingForm";
import type { BookingFormState } from "@/app/booking/actions";

// Server actions are callable by anyone who can reach the page, so re-check the session here.
// Members and admins may both edit/delete; the backend checks ownership (403 for someone else's booking).
async function userToken() {
  const user = (await getSession())?.user;
  if (!user) throw new Error("Please log in first");
  return user.token;
}

// Bound with .bind(null, id) in BookingForm. Same validation as creating (#5);
// backend errors (400 / 403 / 404 / 409) come back as `message` for the form to show.
export async function editBooking(id: string, _prev: BookingFormState, form: FormData): Promise<BookingFormState> {
  const values = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
  const { input, errors } = parseBookingForm(form);
  if (Object.keys(errors).length) return { errors, values };

  try {
    await updateBooking(await userToken(), id, input);
  } catch (err) {
    return { message: (err as Error).message, values };
  }
  revalidatePath("/mybooking");
  redirect("/mybooking"); // throws; must stay outside try/catch
}

export async function removeBookingAction(id: string): Promise<{ message?: string }> {
  try {
    await deleteBooking(await userToken(), id);
  } catch (err) {
    return { message: (err as Error).message };
  }
  revalidatePath("/mybooking");
  return {};
}
