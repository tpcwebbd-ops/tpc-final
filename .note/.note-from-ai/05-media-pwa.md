# Media and PWA

## Media

- Upload route: `src/app/api/uploadthing/v1/core.ts`.
- Media API/UI: `src/app/api/dashboard/media/v1` and `src/app/dashboard/media`.
- Upload middleware requires a session and Media create permission, then records the owner in `uploadthing_uploads`.
- Ordinary users can access only their own media; privileged users can manage all media.
- Remote download is proxied by `media/v1/[id]/download`; keep host allowlists and ownership checks. Do not turn it into an arbitrary URL fetcher.
- UploadThing is for files. ImageBB is for images only. Keep their credentials and client/server responsibilities separate.

## PWA

- Manifest: `src/app/manifest.ts`.
- Service worker: `public/service-worker.js`.
- Install experience: `src/app/dashboard/install` and PWA controls/components.
- After changing the service worker, test an update in a real browser with old caches present. Do not cache authenticated API responses.

## Add a new upload type

1. Add a strict file route with a size/count/MIME policy in `core.ts`.
2. Reuse the common authorization middleware and ownership record.
3. Validate any URL saved to MongoDB; never treat a client-supplied MIME type or URL as trusted.
4. Add UI only after the server policy exists.
