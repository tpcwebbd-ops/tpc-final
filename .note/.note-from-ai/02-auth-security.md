# Authentication, authorization, and API security

## Current implementation

- Server auth: `src/app/api/lib/auth.ts` using Better Auth + MongoDB.
- Client auth: `src/app/api/lib/auth-client.ts`.
- Role logic: `src/app/api/lib/dashboard-authorization.ts`.
- Gateway: `src/proxy.ts`.
- Rate limiting: `src/app/api/lib/api-rate-limit.ts`; Redis counter support is in `redis.ts`.

## How to protect a new dashboard API

1. Call `auth.api.getSession({ headers: request.headers })`; return `401` when absent.
2. Call `authorizeDashboardRequest(session, "/api/dashboard/<resource>/v1", request.method)`; return `403` when denied.
3. Apply `rateLimit` for routine route protection. Use `await rateLimitDistributed(...)` for public, login-adjacent, or abuse-prone endpoints so Vercel instances share the limit.
4. Validate body, query values, ownership, and resource IDs before every database mutation.
5. Use the correct permission operation: GET=`read`, POST=`create`, PATCH/PUT=`update`, DELETE=`delete`.

## Roles and blocking

- Access records are in the `access` collection: email, role ID/name, and `blocked`.
- Roles hold read/create/update/delete maps keyed by sidebar IDs.
- The default `user` role is limited to Profile, Media, and Install.
- A blocked user is rejected at the gateway and authorization helper. Blocking also deletes the account's `session` records.
- Do not set `AuthorizationEnable=false` outside local setup.

## Security checklist

- Add the API-to-dashboard mapping in `apiResourcePaths()` for every new resource.
- Add child dashboard paths to `pageResourcePaths()` if direct reload must inherit a parent permission.
- Do not trust client role state, form input, IDs, or ownership claims.
- Keep `BETTER_AUTH_SECRET`, MongoDB, Redis, SMTP, and upload tokens server-only.
- Configure Redis in production; the in-memory limiter cannot protect multiple Vercel instances.
