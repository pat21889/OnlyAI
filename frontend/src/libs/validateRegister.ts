import type { RegisterInput } from "./userRegister";

// Mirrors the backend User model rules so users see errors before submitting.
export default function validateRegister(input: RegisterInput) {
  const errors: Partial<Record<keyof RegisterInput, string>> = {};
  if (!input.name.trim()) errors.name = "Please enter your name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email = "Please enter a valid email";
  if (!input.tel.trim()) errors.tel = "Please enter a telephone number";
  if (input.password.length < 6) errors.password = "Password must be at least 6 characters";
  if (input.role !== "admin" && input.role !== "member") errors.role = "Please choose a role";
  return errors;
}
