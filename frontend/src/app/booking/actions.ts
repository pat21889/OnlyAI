"use server";
import { revalidatePath } from "next/cache";
import getSession from "@/libs/getSession";
import parseBookingForm, { type BookingErrors } from "@/libs/parseBookingForm";
import createBooking from "@/libs/createBooking";

// values: echoed back so the form keeps what was typed (React resets forms after an action).
export type BookingFormState = {
  errors?: BookingErrors;
  message?: string; // error from the backend, e.g. overlapping booking
  success?: string;
  values?: Record<string, string>;
};

// Server actions are callable by anyone who can reach the page, so re-check the role here.
async function memberToken() {
  const user = (await getSession())?.user;
  if (!user) throw new Error("Please log in first");
  if (user.role !== "member") throw new Error("Admins cannot create bookings");
  return user.token;
}

export async function saveBooking(_prev: BookingFormState, form: FormData): Promise<BookingFormState> {
  const values = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
  let token: string;
  try {
    token = await memberToken();
  } catch (err) {
    return { message: (err as Error).message, values };
  }

  const { input, errors } = parseBookingForm(form);
  if (Object.keys(errors).length) return { errors, values };

  try {
    const booking = await createBooking(token, input);
    revalidatePath("/mybooking");
    return {
      success: `Booking confirmed: ${booking.facility.name} on ${input.bookingDate} at ${input.startTime} for ${input.durationHours} hour(s)`,
      values: { facility: input.facility }, // keep the facility selected for the next booking
    };
  } catch (err) {
    return { message: (err as Error).message, values };
  }
}
