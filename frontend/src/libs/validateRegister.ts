import type { RegisterInput } from "./userRegister";

// Length only: Thai landlines have 9 digits, mobiles 10.
const THAI_TEL = /^\d{9,10}$/;

// "081-234-5678", "081 234 5678" and "+66 81 234 5678" all become "0812345678".
export function normalizeTel(tel: string) {
  const t = tel.replace(/[\s().-]/g, "");
  return t.startsWith("+66") ? `0${t.slice(3)}` : t;
}

// Mirrors the backend User model rules so users see errors before submitting.
export default function validateRegister(input: RegisterInput) {
  const errors: Partial<Record<keyof RegisterInput, string>> = {};
  if (!input.name.trim()) errors.name = "Please enter your name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email = "Please enter a valid email";
  if (!input.tel.trim()) errors.tel = "Please enter a telephone number";
  else if (!THAI_TEL.test(normalizeTel(input.tel))) errors.tel = "Phone number must be 9 or 10 digits";
  if (input.password.length < 6) errors.password = "Password must be at least 6 characters";
  if (input.role !== "admin" && input.role !== "member") errors.role = "Please choose a role";
  return errors;
}
