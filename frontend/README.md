# SportBook frontend

Next.js 16 (App Router, `cacheComponents` on) + NextAuth v4 + Tailwind.

## Setup

```bash
cp .env.example .env.local   # then set NEXTAUTH_SECRET
npm install
npm run dev                  # http://localhost:3000 (backend must run on :5000)
```

## Auth contract (for booking/facility pages)

- Server component: `const session = await getServerSession(authOptions)` (call `await connection()` first, and render inside `<Suspense>`)
- Client component: `const { data: session } = useSession()`
- `session.user` = `{ id, name, email, role: "admin" | "member", token }`
- Call the backend with `Authorization: Bearer ${session.user.token}`
- `src/proxy.ts` redirects guests away from `/mybooking`, `/booking`, `/admin` (admin role only)

## Tests

```bash
npm test                     # Jest unit tests (src/**/*.test.ts[x])
npm run cy:open              # Cypress UI (needs `npm run dev` + backend running)
npm run cy:run               # Cypress headless
CYPRESS_BASE_URL=https://<app>.vercel.app npm run cy:run   # against deployed site
```
