import "next-auth";
import "next-auth/jwt";

type BackendUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  token: string; // backend JWT: send as `Authorization: Bearer ${token}`
};

declare module "next-auth" {
  interface Session {
    user: BackendUser;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends BackendUser {}
}

declare module "next-auth/jwt" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface JWT extends BackendUser {}
}
