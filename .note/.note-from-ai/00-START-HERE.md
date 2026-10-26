# NexaMart implementation notes

Use this folder as the compact build handbook for this repository. It records the current architecture and reusable implementation patterns; source code remains the final authority.

## Read in this order

1. [01-project-map.md](01-project-map.md) — where things live.
2. [02-auth-security.md](02-auth-security.md) — authentication, roles, blocking, and API protection.
3. [03-new-resource.md](03-new-resource.md) — add a dashboard CRUD feature correctly.
4. [04-content-runtime.md](04-content-runtime.md) — pages, menu, layout settings, and caching.
5. [05-media-pwa.md](05-media-pwa.md) — uploads, media ownership, and PWA.
6. [06-deploy-operate.md](06-deploy-operate.md) — environment, Vercel, scaling, and release checks.

## Rules for future work

- Inspect the named route, API, Redux slice, and public renderer before changing a feature.
- Enforce security on the server/API; client visibility is only UX.
- Reuse the existing route and naming conventions. Do not create a second pattern for the same job.
- Run `npx tsc --noEmit`, targeted ESLint, and `npm run build` after meaningful changes.
- Update only the relevant note when the architecture changes; do not duplicate it in another file.
