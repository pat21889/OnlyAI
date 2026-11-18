import validateRegister, { normalizeTel } from "./validateRegister";
import type { RegisterInput } from "./userRegister";

const valid: RegisterInput = {
  name: "Alice",
  email: "alice@example.com",
  tel: "0812345678",
  role: "member",
  password: "secret1",
};

describe("validateRegister", () => {
  it("accepts valid input", () => {
    expect(validateRegister(valid)).toEqual({});
  });

  it("flags every empty field", () => {
    const errors = validateRegister({ name: " ", email: "", tel: "", role: "member", password: "" });
    expect(Object.keys(errors).sort()).toEqual(["email", "name", "password", "tel"]);
  });

  it.each(["0812345678", "081-234-5678", "081 234 5678", "+66812345678", "021234567"])(
    "accepts phone %s",
    (tel) => expect(validateRegister({ ...valid, tel }).tel).toBeUndefined(),
  );

  it.each(["12345", "08123456", "081234567890", "abcdefghij"])(
    "rejects phone %s (not 9 or 10 digits)",
    (tel) => expect(validateRegister({ ...valid, tel }).tel).toMatch(/9 or 10 digits/),
  );

  it("normalizes separators and +66", () => {
    expect(normalizeTel("081-234-5678")).toBe("0812345678");
    expect(normalizeTel("+66 81 234 5678")).toBe("0812345678");
  });

  it("rejects password shorter than 6", () => {
    expect(validateRegister({ ...valid, password: "12345" }).password).toMatch(/6/);
  });

  it.each(["alice", "alice@", "alice@example", "a lice@example.com"])("rejects bad email %s", (email) => {
    expect(validateRegister({ ...valid, email }).email).toBeDefined();
  });

  it("rejects unknown role", () => {
    expect(validateRegister({ ...valid, role: "owner" as RegisterInput["role"] }).role).toBeDefined();
  });
});
