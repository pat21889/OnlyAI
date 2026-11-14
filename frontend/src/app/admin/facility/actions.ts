"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getSession from "@/libs/getSession";
import parseFacilityForm, { type FacilityErrors } from "@/libs/parseFacilityForm";
import createFacility from "@/libs/createFacility";
import updateFacility from "@/libs/updateFacility";
import deleteFacility from "@/libs/deleteFacility";

// values: echoed back so the form keeps what was typed (React resets forms after an action).
export type FacilityFormState = { errors?: FacilityErrors; message?: string; values?: Record<string, string> };

// Server actions are callable by anyone who can reach the page, so re-check the role here.
async function adminToken() {
  const user = (await getSession())?.user;
  if (user?.role !== "admin") throw new Error("Only admins can manage facilities");
  return user.token;
}

// id undefined → create, otherwise update. Bound with .bind(null, id) in FacilityForm.
export async function saveFacility(
  id: string | undefined,
  _prev: FacilityFormState,
  form: FormData,
): Promise<FacilityFormState> {
  const token = await adminToken();
  const { input, errors } = parseFacilityForm(form);
  const values = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
  if (Object.keys(errors).length) return { errors, values };

  let savedId: string;
  try {
    savedId = (id ? await updateFacility(token, id, input) : await createFacility(token, input))._id;
  } catch (err) {
    return { message: (err as Error).message, values }; // e.g. duplicate name
  }
  revalidatePath("/facility");
  redirect(`/facility/${savedId}`); // throws; must stay outside try/catch
}

export async function removeFacility(id: string): Promise<{ message?: string }> {
  const token = await adminToken();
  try {
    await deleteFacility(token, id);
  } catch (err) {
    return { message: (err as Error).message };
  }
  revalidatePath("/facility");
  redirect("/facility");
}
