"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import userRegister, { type RegisterInput } from "@/libs/userRegister";
import validateRegister from "@/libs/validateRegister";
import useHydrated from "@/libs/useHydrated";

const fields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "tel", label: "Telephone", type: "tel" },
  { name: "password", label: "Password", type: "password" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = Object.fromEntries(new FormData(e.currentTarget)) as RegisterInput;
    const found = validateRegister(input);
    setErrors(found);
    setServerError("");
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      await userRegister(input);
      await signIn("credentials", { email: input.email, password: input.password, redirect: false });
      router.push("/");
      router.refresh();
    } catch (err) {
      setServerError((err as Error).message); // e.g. duplicate email
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} method="post" noValidate className="max-w-sm mx-auto mt-16 flex flex-col gap-4 bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-semibold">Register</h1>
      {fields.map((f) => (
        <label key={f.name} className="flex flex-col gap-1">{f.label}
          <input name={f.name} type={f.type} aria-invalid={!!errors[f.name]} className="border rounded px-3 py-2" />
          {errors[f.name] && <span className="text-sm text-red-600">{errors[f.name]}</span>}
        </label>
      ))}
      <label className="flex flex-col gap-1">Role
        <select name="role" defaultValue="member" className="border rounded px-3 py-2">
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      {serverError && <p role="alert" className="text-red-600">{serverError}</p>}
      <button type="submit" disabled={loading || !hydrated} className="rounded bg-blue-600 py-2 text-white disabled:opacity-50">
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
