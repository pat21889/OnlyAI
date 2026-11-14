export default async function userLogIn(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null; // NextAuth treats null as "invalid credentials"
  return (await res.json()).data as {
    id: string;
    name: string;
    email: string;
    role: "admin" | "member";
    token: string;
  };
}
