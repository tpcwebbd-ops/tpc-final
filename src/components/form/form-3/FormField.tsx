/*
|-----------------------------------------
| setting up FormField.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 30 August, 2026
|-----------------------------------------
*/

"use client";
import { type FormEvent, useState } from "react";

import { defaultData } from "./data";

type FormValues = { name: string; email: string; message: string };
const emptyValues: FormValues = { name: "", email: "", message: "" };

export default function FormField({
  data = defaultData,
  onSubmit,
}: {
  data?: Record<string, string>;
  onSubmit?: (values: Record<string, string>) => Promise<void>;
}) {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const value = (key: keyof typeof defaultData) => data[key] ?? defaultData[key];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onSubmit) return setStatus("error");
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status !== "idle") {
    const success = status === "success";
    return (
      <section className="overflow-hidden custom-parent-border bg-white">
        <div className="bg-stone-950 p-7 text-white sm:p-10">
          <h1 className="text-3xl font-semibold">{value("title")}</h1>
          <p className="mt-3 text-sm text-stone-300">{value("intro")}</p>
        </div>
        <div className={`grid gap-3 p-6 ${success ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
          <h2 className="font-semibold">
            {success ? "Thank you. Your message was sent successfully." : "We could not submit your form."}
          </h2>
          <p className="text-sm">{success ? "Our team will get back to you soon." : "Please try again."}</p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              if (success) setValues(emptyValues);
            }}
            className="w-fit rounded-sm border border-current px-3 py-2 text-sm font-medium"
          >
            {success ? "Send another message" : "Try again"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden custom-parent-border bg-white">
      <div className="bg-stone-950 p-7 text-white sm:p-10">
        <h1 className="text-3xl font-semibold">{value("title")}</h1>
        <p className="mt-3 text-sm text-stone-300">{value("intro")}</p>
      </div>
      <div className="grid gap-0 md:grid-cols-2">
        <div className="grid gap-3 p-6">
          <article>
            <b>{value("emailLabel")}</b>
            <p className="mt-1 text-sm text-stone-600">{value("email")}</p>
          </article>
          <article>
            <b>{value("addressLabel")}</b>
            <p className="mt-1 text-sm text-stone-600">{value("address")}</p>
          </article>
          <article>
            <b>{value("locationLabel")}</b>
            <p className="mt-1 text-sm text-stone-600">{value("location")}</p>
          </article>
          <iframe
            className="mt-3 h-52 w-full rounded-sm border"
            loading="lazy"
            src={value("mapUrl")}
            title="Google Map"
          />
        </div>
        <form
          className="grid content-start gap-3 border-t border-[#eadfca] p-6 md:border-l md:border-t-0"
          onSubmit={submit}
        >
          <label className="grid gap-1 text-sm font-medium text-stone-700">
            {value("nameLabel")}
            <input
              className="rounded-sm border border-stone-200 p-2 text-sm"
              name="name"
              placeholder={value("namePlaceholder")}
              required
              value={values.name}
              onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-stone-700">
            {value("emailFieldLabel")}
            <input
              className="rounded-sm border border-stone-200 p-2 text-sm"
              name="email"
              placeholder={value("emailPlaceholder")}
              required
              type="email"
              value={values.email}
              onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-stone-700">
            {value("messageLabel")}
            <textarea
              className="min-h-28 rounded-sm border border-stone-200 p-2 text-sm"
              name="message"
              placeholder={value("messagePlaceholder")}
              required
              value={values.message}
              onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
            />
          </label>
          <button
            disabled={isSubmitting}
            className="w-fit rounded-sm bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-900 transition duration-700 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting…" : value("buttonLabel")}
          </button>
        </form>
      </div>
    </section>
  );
}
