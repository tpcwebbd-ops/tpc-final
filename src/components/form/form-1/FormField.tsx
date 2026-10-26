/*
|-----------------------------------------
| setting up FormField.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

"use client";
import { type FormEvent, useState } from "react";

import { defaultData } from "./data";

type FormValues = { name: string; email: string; phone: string; message: string };
const emptyValues: FormValues = { name: "", email: "", phone: "", message: "" };

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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onSubmit) {
      setStatus("error");
      return;
    }
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

  if (status === "success") {
    return (
      <SubmissionResult
        tone="success"
        onTryAgain={() => {
          setValues(emptyValues);
          setStatus("idle");
        }}
      />
    );
  }
  if (status === "error") {
    return <SubmissionResult tone="error" onTryAgain={() => setStatus("idle")} />;
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-sm border border-stone-200 bg-white p-5">
      <h2 className="font-semibold">{data.heading}</h2>
      {data.showName !== "false" && (
        <input
          required
          name="name"
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          placeholder={data.namePlaceholder ?? defaultData.namePlaceholder}
          className="rounded-sm border p-2"
        />
      )}
      {data.showEmail !== "false" && (
        <input
          required
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          placeholder={data.emailPlaceholder ?? defaultData.emailPlaceholder}
          className="rounded-sm border p-2"
        />
      )}
      {data.showPhone !== "false" && (
        <input
          required
          name="phone"
          type="tel"
          value={values.phone}
          onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))}
          placeholder={data.phonePlaceholder ?? defaultData.phonePlaceholder}
          className="rounded-sm border p-2"
        />
      )}
      {data.showMessage !== "false" && (
        <textarea
          required
          name="message"
          value={values.message}
          onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
          placeholder={data.messagePlaceholder ?? defaultData.messagePlaceholder}
          className="min-h-28 rounded-sm border p-2"
        />
      )}
      <button
        disabled={isSubmitting}
        className="rounded-sm bg-amber-700 p-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting…" : data.buttonLabel}
      </button>
    </form>
  );
}

function SubmissionResult({ tone, onTryAgain }: { tone: "success" | "error"; onTryAgain: () => void }) {
  const success = tone === "success";
  return (
    <div
      className={`grid gap-3 rounded-sm border p-5 ${success ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`}
    >
      <h2 className="font-semibold">
        {success ? "Thank you. Your form was submitted successfully." : "We could not submit your form."}
      </h2>
      {!success && <p className="text-sm">Your entered details are still saved. Please try again.</p>}
      <button
        type="button"
        onClick={onTryAgain}
        className={`w-fit rounded-sm px-3 py-2 text-sm font-medium ${success ? "border border-emerald-700 hover:bg-emerald-100" : "bg-red-700 text-white hover:bg-red-800"}`}
      >
        {success ? "Submit another message" : "Try again"}
      </button>
    </div>
  );
}
