# Add a dashboard resource

Use this sequence for a new CRUD feature such as `campaigns` or `products`.

1. Define the database shape and safe serializer in `src/app/api/dashboard/<resource>/v1/route.ts`.
2. Build list/create and item/bulk endpoints as needed. Authenticate, authorize, rate-limit, validate, and escape search input.
3. Register the resource in `apiResourcePaths()` in `dashboard-authorization.ts`.
4. Create an RTK Query slice in `src/redux/features/dashboard/<resource>/`; add tag invalidation so mutations refresh the list.
5. Add the dashboard page under the route represented by the sidebar permission. Use existing table/card, loading, toast, and confirmation patterns.
6. Add a sidebar/default record only when the feature needs navigation. Update `src/app/tools/import-data/defaults.ts` too, so new and old databases converge.
7. If data is public, add a dedicated renderer and cache/revalidation plan; do not expose the admin API as a public data source.

## Definition of done

- Unauthorized request: `401`; signed-in but denied: `403`; blocked user: `403`.
- List pagination/search and mutations have validated limits.
- Bulk/delete actions require confirmation in the UI.
- API, Redux cache, permission mapping, navigation/defaults, and renderer (when applicable) are all updated together.
- Run typecheck, targeted lint, and production build.
