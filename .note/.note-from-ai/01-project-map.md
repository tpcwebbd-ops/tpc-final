# Project map

| Concern              | Current location                                        | Use it for                                                                |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------- |
| App routes           | `src/app`                                               | Public, auth, dashboard, API, and tools routes.                           |
| API utilities        | `src/app/api/lib`                                       | Auth, client auth, authorization, Redis, rate limit, shared utility code. |
| Dashboard pages      | `src/app/dashboard`                                     | Role-aware dashboard UI.                                                  |
| Dashboard APIs       | `src/app/api/dashboard/*/v1`                            | Versioned server-side resources.                                          |
| Redux                | `src/redux`                                             | RTK Query cache, mutations, shared dashboard types.                       |
| Public layout blocks | `src/components/{menu,footer,topbanner,pages,whatsapp}` | Database-backed public rendering.                                         |
| Seed/import defaults | `src/app/tools/import-data/defaults.ts`                 | Default sidebar/page records.                                             |
| Deployment config    | `.env.example`, `next.config.ts`, `README.md`           | Required variables, security headers, operations.                         |

## Main flows

```text
Browser → proxy.ts → session + permission check → API route → MongoDB
                                   ↘ Redis shared cache/rate limiter

Public page → MongoDB published records → server renderer → revalidation after save
```

`src/proxy.ts` protects `/dashboard/*` and `/api/dashboard/*`. A sensitive API route should also perform its own authorization check for defense in depth.

## Conventions

- API paths are versioned: `/api/dashboard/<resource>/v1`.
- UI routes match their permission/sidebar URL where possible.
- Use `LoadingState`, existing confirmation UI, and existing RTK Query slices instead of new parallel feedback patterns.
- New TypeScript files must retain the repository file header required by ESLint.
