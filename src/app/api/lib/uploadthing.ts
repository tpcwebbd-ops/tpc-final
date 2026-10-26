/*
|-----------------------------------------
| setting up uploadthing.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/v1/core";

// UploadThing's client default is `/api/uploadthing`. The route is versioned in
// this application, so configure the generated clients once for every caller.
const uploadThingUrl = "/api/uploadthing/v1";

export const UploadButton = generateUploadButton<OurFileRouter>({ url: uploadThingUrl });
export const UploadDropzone = generateUploadDropzone<OurFileRouter>({ url: uploadThingUrl });
