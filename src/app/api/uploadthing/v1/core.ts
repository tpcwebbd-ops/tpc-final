/*
|-----------------------------------------
| setting up core.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { rateLimitDistributed } from "@/app/api/lib/api-rate-limit";
import { auth, client } from "@/app/api/lib/auth";
import { authorizeDashboardRequest } from "@/app/api/lib/dashboard-authorization";

const f = createUploadthing();
type UploadOwnership = { fileKey: string; url: string; author: string; userId: string; createdAt: Date };

async function recordUpload(metadata: { email: string; userId: string }, file: { key: string; ufsUrl: string }) {
  await client
    .db()
    .collection<UploadOwnership>("uploadthing_uploads")
    .updateOne(
      { fileKey: file.key },
      {
        $set: { url: file.ufsUrl, author: metadata.email.trim().toLowerCase(), userId: metadata.userId },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );
}

const authorize = async (req: Request, files?: ReadonlyArray<{ name: string }>, extensions?: string[]) => {
  if (await rateLimitDistributed(req, "media-upload-api", 20, 60_000))
    throw new UploadThingError("Too many upload requests. Please try again shortly.");
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) throw new UploadThingError("Sign in required.");
  const authorization = await authorizeDashboardRequest(session, "/dashboard/media", "POST");
  if (!authorization.allowed) throw new UploadThingError(authorization.state.message ?? "Unauthorized.");
  if (
    extensions?.length &&
    files?.some((file) => !extensions.some((extension) => file.name.toLowerCase().endsWith(extension)))
  )
    throw new UploadThingError(`Only ${extensions.join(", ")} files are allowed.`);
  return { userId: session.user.id, email: session.user.email };
};

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(({ req, files }) => authorize(req, files))
    .onUploadComplete(async ({ metadata, file }) => {
      await recordUpload(metadata, file);
      return { uploadedBy: metadata.email, url: file.ufsUrl, key: file.key };
    }),
  videoUploader: f({ video: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(({ req, files }) => authorize(req, files))
    .onUploadComplete(async ({ metadata, file }) => {
      await recordUpload(metadata, file);
      return { uploadedBy: metadata.email, url: file.ufsUrl, key: file.key };
    }),
  audioUploader: f({ audio: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(({ req, files }) => authorize(req, files))
    .onUploadComplete(async ({ metadata, file }) => {
      await recordUpload(metadata, file);
      return { uploadedBy: metadata.email, url: file.ufsUrl, key: file.key };
    }),
  zipUploader: f({ blob: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(({ req, files }) => authorize(req, files, [".zip"]))
    .onUploadComplete(async ({ metadata, file }) => {
      await recordUpload(metadata, file);
      return { uploadedBy: metadata.email, url: file.ufsUrl, key: file.key };
    }),
  documentUploader: f({
    "application/msword": { maxFileSize: "8MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(({ req, files }) => authorize(req, files, [".doc", ".docx"]))
    .onUploadComplete(async ({ metadata, file }) => {
      await recordUpload(metadata, file);
      return { uploadedBy: metadata.email, url: file.ufsUrl, key: file.key };
    }),
  documentTextUploader: f({
    "application/msword": { maxFileSize: "8MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "8MB", maxFileCount: 1 },
    "text/plain": { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(({ req, files }) => authorize(req, files, [".doc", ".docx", ".txt"]))
    .onUploadComplete(async ({ metadata, file }) => {
      await recordUpload(metadata, file);
      return { uploadedBy: metadata.email, url: file.ufsUrl, key: file.key };
    }),
  pdfUploader: f({ pdf: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(({ req, files }) => authorize(req, files, [".pdf"]))
    .onUploadComplete(async ({ metadata, file }) => {
      await recordUpload(metadata, file);
      return { uploadedBy: metadata.email, url: file.ufsUrl, key: file.key };
    }),
  textUploader: f({ "text/plain": { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(({ req, files }) => authorize(req, files, [".txt"]))
    .onUploadComplete(({ metadata, file }) => ({ uploadedBy: metadata.email, url: file.ufsUrl, key: file.key })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
