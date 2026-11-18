export type RegisterInput = {
  name: string;
  email: string;
  tel: string;
  role: "admin" | "member";
  password: string;
};

export default async function userRegister(input: RegisterInput) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json().catch(() => ({})); // e.g. empty or HTML reply from a proxy
  if (!res.ok) throw new Error(json.error || `Registration failed (server replied ${res.status})`);
  return json.data;
}
