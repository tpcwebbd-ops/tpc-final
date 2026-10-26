# Content and public runtime

## Pages

- Editor/API: `src/app/dashboard/admin/pages` and `src/app/api/dashboard/pages/v1`.
- Public renderer: `src/app/[...pagePath]/page.tsx` and `src/components/pages/PageBlocks.tsx`.
- A page is public only when `published: true`. Form submissions must belong to a published page and declared form block.
- Save, publish, delete, or revalidate actions must refresh the affected path and `site-pages` cache tag.

## Shared layout settings

- Menu, Footer, Top Banner, WhatsApp, and Navigation each have a dashboard API plus public component.
- Menu records are independent. Publishing is collection-wide: exactly one record can be published.
- When introducing a new visual variant, update the saved type, editor picker, defaults/importer, and public renderer in the same change.

## Cache rule

Persist first, then invalidate/revalidate. Never report a successful save from client state before the server mutation succeeds.

## Build/revalidation

`/dashboard/admin/build` is the operational cache refresh surface. Exclude private, auth, dashboard, and password-recovery paths from public build targets.
