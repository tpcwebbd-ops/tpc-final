/*
|-----------------------------------------
| setting up media model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/
import "server-only";

import type { Document } from "mongodb";

import { database } from "@/lib/db";

export type Media = {
  id: string;
  name: string;
  author: string;
  url: string;
  uploadPlane: "imageBB" | "Youtube" | "Uploadthings";
  type: "picture" | "video" | "audio" | "zip" | "doc" | "pdf" | "txt";
  deleteUrl?: string;
  fileKey?: string;
  createdAt: Date;
};
export type UploadOwnership = { fileKey: string; url: string; author: string };

export const mediaCollection = <T extends Document>() => database().collection<T>("media");
export const uploadOwnershipCollection = <T extends Document>() => database().collection<T>("uploadthing_uploads");
export const listMedia = (author?: string) =>
  mediaCollection<Media>()
    .find(author ? { author } : {})
    .sort({ createdAt: -1 })
    .toArray();
export const findUploadOwnership = (fileKey: string, url: string, author: string) =>
  uploadOwnershipCollection<UploadOwnership>().findOne({ fileKey, url, author });
export const findMediaByFileKey = (fileKey: string) => mediaCollection<Media>().findOne({ fileKey });
export const createMedia = (item: Media) => mediaCollection<Media>().insertOne(item);
export const findMedia = (id: string) => mediaCollection<Media>().findOne({ id });
export const renameMedia = (id: string, name: string) => mediaCollection<Media>().updateOne({ id }, { $set: { name } });
export const deleteMedia = (id: string) => mediaCollection<Media>().deleteOne({ id });
export const findMediaBulk = (ids: string[], author?: string) =>
  mediaCollection<Media>()
    .find(author ? { id: { $in: ids }, author } : { id: { $in: ids } })
    .toArray();
export const deleteMediaBulk = (ids: string[]) => mediaCollection<Media>().deleteMany({ id: { $in: ids } });
