/*
|-----------------------------------------
| setting up site-settings model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

import "server-only";

import type { Document } from "mongodb";

import { database } from "@/lib/db";
import { pagesCollection } from "@/lib/models/pages";

export const footerCollection = <T extends Document>() => database().collection<T>("footer");
export const topBannerCollection = <T extends Document>() => database().collection<T>("topbanner");
export const menuCollection = <T extends Document>() => database().collection<T>("menu");
export const navigationCollection = <T extends Document>() => database().collection<T>("navigation");
export const whatsappSettingsCollection = <T extends Document>() => database().collection<T>("whatsappSettings");
export const trackingCollection = <T extends Document>() => database().collection<T>("tracking");
export const buildRevalidationCollection = <T extends Document>() => database().collection<T>("build_revalidation");
export const seoSettingsCollection = () => database().collection<SeoSettingsRecord>("seo_settings");

export type SeoSettingsTarget = { type: "layout" } | { type: "page"; pageId: string };
export type SeoSettingsRecord = {
  targetKey: "layout" | `page:${string}`;
  target: SeoSettingsTarget;
  title: string;
  description: string;
  socialImage: string | null;
  canonicalUrl: string | null;
  focusKeyword: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const findSeoSettings = (targetKey: SeoSettingsRecord["targetKey"]) =>
  seoSettingsCollection().findOne({ targetKey });
export const createSeoSettings = (item: SeoSettingsRecord) => seoSettingsCollection().insertOne(item);
export const updateSeoSettings = (
  targetKey: SeoSettingsRecord["targetKey"],
  changes: Partial<Pick<SeoSettingsRecord, "title" | "description" | "socialImage" | "canonicalUrl" | "focusKeyword">>,
  updatedAt: Date,
) => seoSettingsCollection().updateOne({ targetKey }, { $set: { ...changes, updatedAt } });
export const deleteSeoSettings = (targetKey: SeoSettingsRecord["targetKey"]) =>
  seoSettingsCollection().deleteMany({ targetKey });
export const deletePageSeoSettings = (pageId: string) =>
  seoSettingsCollection().deleteMany({ targetKey: `page:${pageId}` });

export type BuildRecord = { key: string; cooldownUntil: Date; updatedAt: Date };
export const findBuildRecords = (keys: string[]) =>
  buildRevalidationCollection<BuildRecord>()
    .find({ key: { $in: keys } })
    .toArray();
export const findBuildRecord = (key: string) => buildRevalidationCollection<BuildRecord>().findOne({ key });
export const saveBuildCooldowns = (keys: string[], cooldownUntil: Date, updatedAt: Date) =>
  buildRevalidationCollection<BuildRecord>().bulkWrite(
    keys.map((key) => ({
      updateOne: { filter: { key }, update: { $set: { key, cooldownUntil, updatedAt } }, upsert: true },
    })),
  );
export const findBuildPages = () =>
  pagesCollection()
    .find({}, { projection: { path: 1, title: 1 } })
    .toArray();

export type FooterRecord = { key: "site"; variant: string; data: Record<string, unknown>; updatedAt?: Date };
export const findFooter = () => footerCollection<FooterRecord>().findOne({ key: "site" });
export const saveFooter = (item: FooterRecord) =>
  footerCollection<FooterRecord>().updateOne({ key: "site" }, { $set: item }, { upsert: true });
export const deleteFooter = () => footerCollection<FooterRecord>().deleteOne({ key: "site" });

export type TopBannerRecord = { key: "site"; variant: string; data: Record<string, unknown>; updatedAt?: Date };
export const findTopBanner = () => topBannerCollection<TopBannerRecord>().findOne({ key: "site" });
export const saveTopBanner = (item: TopBannerRecord) =>
  topBannerCollection<TopBannerRecord>().updateOne({ key: "site" }, { $set: item }, { upsert: true });
export const deleteTopBanner = () => topBannerCollection<TopBannerRecord>().deleteOne({ key: "site" });

export type TrackingProvider = "facebook" | "gtm" | "ga4" | "tiktok";
export type TrackingRecord = {
  id: string;
  provider: TrackingProvider;
  pixelId: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export const findTrackingRecords = () => trackingCollection<TrackingRecord>().find({}).sort({ provider: 1 }).toArray();
export const findTrackingByProvider = (provider: TrackingProvider) =>
  trackingCollection<TrackingRecord>().findOne({ provider });
export const createTracking = (item: TrackingRecord) => trackingCollection<TrackingRecord>().insertOne(item);
export const updateTracking = (id: string, pixelId: string, enabled: boolean) =>
  trackingCollection<TrackingRecord>().findOneAndUpdate(
    { id },
    { $set: { pixelId, enabled, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
export const deleteTracking = (id: string) => trackingCollection().deleteOne({ id });
export const deleteTrackingRecords = (ids: string[]) => trackingCollection().deleteMany({ id: { $in: ids } });

export type WhatsAppPadding = "0" | "small" | "medium" | "large" | "extra-large" | "xxl" | "3xl" | "4xl" | "5xl";
export type WhatsAppPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export type WhatsAppSettings = {
  key: "site";
  number: string;
  padding?: WhatsAppPadding;
  paddingX?: WhatsAppPadding;
  paddingY?: WhatsAppPadding;
  marginX?: WhatsAppPadding;
  marginY?: WhatsAppPadding;
  position: WhatsAppPosition;
  defaultMessage: string;
  isVisible: boolean;
  desktopTextVisible: boolean;
  updatedAt: Date;
};
export const findWhatsAppSettings = () => whatsappSettingsCollection<WhatsAppSettings>().findOne({ key: "site" });
export const saveWhatsAppSettings = (settings: WhatsAppSettings) =>
  whatsappSettingsCollection<WhatsAppSettings>().updateOne({ key: "site" }, { $set: settings }, { upsert: true });

export const findNavigation = <T extends Document & { key: string }>() =>
  navigationCollection<T>().findOne({ key: "mobile" } as never);
export const saveNavigation = <T extends Document>(data: T) =>
  navigationCollection().updateOne(
    { key: "mobile" },
    { $set: { key: "mobile", data, updatedAt: new Date() } },
    { upsert: true },
  );
