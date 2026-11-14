import validateRegister from "./validateRegister";
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
