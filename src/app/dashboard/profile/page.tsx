/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";
import { UploadButton } from "@/app/api/lib/uploadthing";
import { iconMap } from "@/components/all-icons/all-icons";
import { useCreateMediaMutation, useGetMediaQuery } from "@/redux/features/dashboard/media/mediaSlice";
import {
  type Profile,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/features/dashboard/profile/profileSlice";

const PAGE_SIZES = [10, 25, 50, 100] as const;

export default function ProfilePage() {
  const { data, isFetching, isLoading } = useGetProfileQuery();
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  if (isLoading) return <ProfilePageLoader label="Loading your profile" />;
  return (
    <>
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[90] rounded-sm px-4 py-3 text-sm text-white shadow-xl transition duration-700 ${toast.error ? "bg-red-700" : "bg-stone-900"}`}
          role="status"
        >
          {toast.message}
        </div>
      )}
      <ProfileEditor
        initialProfile={data?.profile ?? emptyProfile}
        key={JSON.stringify(data?.profile ?? emptyProfile)}
        setToast={setToast}
      />
      {isFetching && <ProfilePageLoader label="Refreshing your profile" overlay />}
    </>
  );
}

const emptyProfile: Profile = {
  name: "",
  email: "",
  mobileNumber: "",
  address: "",
  bio: "",
  profilePicture: "",
  gender: "",
};

function ProfileEditor({
  initialProfile,
  setToast,
}: {
  initialProfile: Profile;
  setToast: React.Dispatch<React.SetStateAction<{ message: string; error?: boolean } | null>>;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [mediaOpen, setMediaOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const result = await updateProfile({
        name: profile.name,
        mobileNumber: profile.mobileNumber,
        address: profile.address,
        bio: profile.bio,
        profilePicture: profile.profilePicture,
        gender: profile.gender,
      }).unwrap();
      setProfile(result.profile);
      setToast({ message: "Profile updated." });
    } catch (error) {
      setToast({ message: messageFrom(error, "Could not update profile."), error: true });
    }
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ message: "New passwords do not match.", error: true });
      return;
    }
    setPasswordSaving(true);
    try {
      const result = await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
      if (result.error) throw new Error(result.error.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setToast({ message: "Password updated." });
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Could not update password.", error: true });
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-65px)] bg-[#fffaf0] px-4 py-8 sm:px-6 lg:px-10">
      {(isSaving || passwordSaving) && (
        <ProfilePageLoader label={isSaving ? "Updating your profile" : "Updating your password"} overlay />
      )}
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="relative overflow-hidden rounded-sm border border-[#eadfca] bg-white p-5 shadow-[0_20px_60px_-35px_rgba(120,53,15,.35)] sm:p-8">
          <div className="absolute -right-16 -top-16 h-40 w-40 animate-[soft-pulse_4s_ease-in-out_infinite] rounded-full bg-amber-200/50 blur-2xl" />
          <form className="relative" onSubmit={(event) => void saveProfile(event)}>
            <div className="flex flex-col items-center">
              <div className="relative h-28 w-28 rounded-full border-4 border-white bg-amber-100 shadow-[0_12px_30px_rgba(120,53,15,.2)] sm:h-32 sm:w-32">
                {profile.profilePicture ? (
                  <Image
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                    height={128}
                    src={profile.profilePicture}
                    width={128}
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center rounded-full text-3xl font-semibold text-amber-900">
                    {profile.name.trim().charAt(0).toUpperCase() || "?"}
                  </span>
                )}
                <button
                  aria-label="Choose profile picture"
                  className="absolute -bottom-1 -right-1 grid h-10 w-10 cursor-pointer place-items-center rounded-full border-2 border-white bg-stone-900 text-white shadow-lg transition duration-700 hover:scale-110 hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSaving}
                  onClick={() => setMediaOpen(true)}
                  type="button"
                >
                  {iconMap.Edit2}
                </button>
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Profile</h1>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field label="Name">
                <input
                  className="input"
                  onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                  required
                  value={profile.name}
                />
              </Field>
              <Field label="Gender">
                <select
                  className="input cursor-pointer"
                  onChange={(event) => setProfile({ ...profile, gender: event.target.value as Profile["gender"] })}
                  value={profile.gender}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="Mobile">
                <input
                  className="input"
                  inputMode="tel"
                  onChange={(event) => setProfile({ ...profile, mobileNumber: event.target.value })}
                  value={profile.mobileNumber}
                />
              </Field>
              <Field label="Email">
                <input
                  className="input cursor-not-allowed bg-stone-100 text-stone-500"
                  readOnly
                  value={profile.email}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Address">
                  <textarea
                    className="input min-h-24 resize-y"
                    onChange={(event) => setProfile({ ...profile, address: event.target.value })}
                    value={profile.address}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Bio">
                  <textarea
                    className="input min-h-24 resize-y"
                    onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
                    value={profile.bio}
                  />
                </Field>
              </div>
            </div>
            <button
              className="mt-6 inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-sm bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white transition duration-700 hover:-translate-y-0.5 hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              {iconMap.Save}
              {isSaving ? "Saving…" : "Save"}
            </button>
          </form>
        </section>
        <section className="rounded-sm border border-[#eadfca] bg-white p-5 shadow-[0_20px_60px_-35px_rgba(120,53,15,.18)] sm:p-8">
          <div className="flex items-center gap-2 text-stone-900">
            {iconMap.Lock}
            <h2 className="text-xl font-semibold tracking-tight">Password</h2>
          </div>
          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(event) => void updatePassword(event)}>
            <Field label="Current password">
              <input
                autoComplete="current-password"
                className="input"
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                type="password"
                value={currentPassword}
              />
            </Field>
            <Field label="New password">
              <input
                autoComplete="new-password"
                className="input"
                minLength={8}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                type="password"
                value={newPassword}
              />
            </Field>
            <Field label="Confirm password">
              <input
                autoComplete="new-password"
                className="input"
                minLength={8}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                type="password"
                value={confirmPassword}
              />
            </Field>
            <div className="sm:col-span-2">
              <button
                className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-sm bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-950 ring-1 ring-inset ring-amber-200 transition duration-700 hover:-translate-y-0.5 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={passwordSaving}
                type="submit"
              >
                {iconMap.Save}
                {passwordSaving ? "Updating…" : "Update password"}
              </button>
            </div>
          </form>
        </section>
      </div>
      {mediaOpen && (
        <ProfilePictureModal
          close={() => setMediaOpen(false)}
          onSelect={(profilePicture) => {
            setProfile({ ...profile, profilePicture });
            setMediaOpen(false);
            setToast({ message: "Profile picture selected." });
          }}
        />
      )}
    </main>
  );
}

function ProfilePictureModal({ close, onSelect }: { close: () => void; onSelect: (url: string) => void }) {
  const { data, isLoading } = useGetMediaQuery();
  const [create] = useCreateMediaMutation();
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState<"" | "imageBB" | "Uploadthings">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10);
  const [uploading, setUploading] = useState(false);
  const images = useMemo(
    () =>
      (data?.items ?? []).filter(
        (item) =>
          item.type === "picture" &&
          (!provider || item.uploadPlane === provider) &&
          `${item.name} ${item.author}`.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [data?.items, provider, query],
  );
  const totalPages = Math.max(1, Math.ceil(images.length / pageSize));
  const visible = images.slice((Math.min(page, totalPages) - 1) * pageSize, Math.min(page, totalPages) * pageSize);
  async function upload(result: { name: string; ufsUrl: string; key: string }[] | undefined) {
    const file = result?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await create({
        name: file.name,
        url: file.ufsUrl,
        type: "picture",
        uploadPlane: "Uploadthings",
        fileKey: file.key,
      }).unwrap();
      onSelect(file.ufsUrl);
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
      <section
        aria-modal="true"
        className="w-full max-w-3xl animate-[modal-enter_.7s_cubic-bezier(.22,1,.36,1)] overflow-hidden rounded-sm bg-[#fffaf0] shadow-2xl"
        role="dialog"
      >
        <header className="flex items-center justify-between border-b border-[#eadfca] p-5">
          <h2 className="font-semibold text-stone-900">Profile picture</h2>
          <button
            aria-label="Close"
            className="cursor-pointer rounded-sm p-2 transition duration-700 hover:scale-110 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={uploading}
            onClick={close}
            type="button"
          >
            {iconMap.X}
          </button>
        </header>
        <div className="max-h-[70vh] overflow-y-auto p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="input flex-1"
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Filter media"
              value={query}
            />
            <select
              className="input cursor-pointer sm:w-44"
              onChange={(event) => {
                setProvider(event.target.value as typeof provider);
                setPage(1);
              }}
              value={provider}
            >
              <option value="">All media</option>
              <option value="imageBB">ImageBB</option>
              <option value="Uploadthings">UploadThings</option>
            </select>
            <UploadButton
              appearance={{
                button:
                  "cursor-pointer rounded-sm bg-slate-600 px-3 py-2 text-sm font-medium text-amber-950 transition hover:bg-slate-800 text-sm",
              }}
              content={{ button: uploading ? "Uploading…" : "Upload" }}
              endpoint="imageUploader"
              onClientUploadComplete={(result) => void upload(result)}
              onUploadError={() => setUploading(false)}
            />
          </div>
          {isLoading ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div className="aspect-square animate-pulse rounded-sm bg-amber-100" key={index} />
              ))}
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visible.map((item) => (
                <button
                  className="group cursor-pointer overflow-hidden rounded-sm border border-[#eadfca] bg-white text-left transition duration-700 hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={uploading}
                  key={item.id}
                  onClick={() => onSelect(item.url)}
                  type="button"
                >
                  <Image
                    alt={item.name}
                    className="aspect-square w-full object-cover"
                    height={160}
                    src={item.url}
                    width={160}
                  />
                  <span className="block truncate p-2 text-xs font-medium text-stone-700">{item.name}</span>
                </button>
              ))}
            </div>
          )}
          {!isLoading && !visible.length && (
            <div className="mt-5 rounded-sm border border-dashed border-[#eadfca] p-8 text-center text-sm text-stone-500">
              No images found.
            </div>
          )}
          {images.length > 10 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#eadfca] pt-4">
              <select
                className="input w-auto cursor-pointer py-1"
                onChange={(event) => {
                  setPageSize(Number(event.target.value) as typeof pageSize);
                  setPage(1);
                }}
                value={pageSize}
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 text-sm">
                <button
                  className="inline-flex min-h-8 cursor-pointer items-center rounded-sm border border-[#eadfca] px-3 py-1.5 text-xs transition duration-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  type="button"
                >
                  Previous
                </button>
                <span>
                  {Math.min(page, totalPages)} / {totalPages}
                </span>
                <button
                  className="inline-flex min-h-8 cursor-pointer items-center rounded-sm border border-[#eadfca] px-3 py-1.5 text-xs transition duration-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
function ProfilePageLoader({ label, overlay = false }: { label: string; overlay?: boolean }) {
  return (
    <div
      aria-live="polite"
      className={
        overlay
          ? "fixed inset-0 z-[70] grid place-items-center bg-[#fffaf0]/75 p-4 backdrop-blur-sm"
          : "min-h-[calc(100vh-65px)] grid place-items-center bg-[#fffaf0] p-4"
      }
      role="status"
    >
      <div className="relative grid min-w-56 place-items-center overflow-hidden rounded-sm border border-[#eadfca] bg-white px-8 py-7 text-center shadow-[0_20px_60px_-35px_rgba(120,53,15,.48)]">
        <div className="absolute -left-10 -top-10 h-24 w-24 animate-[soft-pulse_2.4s_ease-in-out_infinite] rounded-full bg-amber-200/70 blur-2xl" />
        <div className="absolute -bottom-12 -right-10 h-28 w-28 animate-[soft-pulse_2.4s_ease-in-out_infinite] rounded-full bg-orange-100 blur-2xl [animation-delay:1.2s]" />
        <div className="relative grid h-14 w-14 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full border border-amber-300/70" />
          <span className="absolute inset-1 animate-[soft-pulse_1.6s_ease-in-out_infinite] rounded-full bg-amber-100" />
          <span className="relative h-5 w-5 animate-spin rounded-full border-2 border-amber-700 border-t-transparent [animation-duration:1.1s]" />
        </div>
        <p className="relative mt-4 text-sm font-semibold text-stone-800">{label}</p>
        <div aria-hidden="true" className="relative mt-3 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-600" />
        </div>
      </div>
    </div>
  );
}
function messageFrom(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error &&
    "data" in error &&
    typeof (error as { data?: { error?: string } }).data?.error === "string"
    ? (error as { data: { error: string } }).data.error
    : fallback;
}
