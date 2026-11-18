"use client";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import useHydrated from "@/libs/useHydrated";
import PasswordField from "@/components/PasswordField";

function LoginForm() {
  const hydrated = useHydrated();
  const router = useRouter();
  const raw = useSearchParams().get("callbackUrl") || "/";
  // Only same-site paths, so a crafted link can't send users to another site after login.
  const callbackUrl = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) return setError("Invalid email or password");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} method="post" className="max-w-sm mx-auto mt-16 flex flex-col gap-4 bg-white p-8 rounded-xl border border-[#E8D9D6]">
      <h1 className="text-2xl font-semibold">Login</h1>
      <label className="flex flex-col gap-1">Email
        <input name="email" type="email" required className="border border-[#CDB9B5] rounded-lg px-3 py-2.5" />
      </label>
      <PasswordField required />
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <button type="submit" disabled={loading || !hydrated} className="rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Logging in..." : "Login"}
      </button>
      <p className="text-sm">No account? <Link href="/register" className="text-blue-600">Register</Link></p>
    </form>
  );
}

export default function LoginPage() {
  // useSearchParams needs a Suspense boundary for static rendering
  return <Suspense><LoginForm /></Suspense>;
}
