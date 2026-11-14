import { withAuth } from "next-auth/middleware";

// Not logged in → redirected to /login. /admin pages also require role "admin".
export default withAuth({
  callbacks: {
    authorized: ({ req, token }) =>
      !!token && (!req.nextUrl.pathname.startsWith("/admin") || token.role === "admin"),
  },
  pages: { signIn: "/login" },
});

export const config = { matcher: ["/mybooking/:path*", "/booking/:path*", "/admin/:path*"] };
