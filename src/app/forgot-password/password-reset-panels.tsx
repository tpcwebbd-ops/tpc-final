/*
|-----------------------------------------
| setting up password-reset-panels.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";

const fieldClassName =
  "w-full rounded-sm border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-4 focus:ring-amber-500/10";

export function ForgotPasswordPanel() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"error" | "success">("error");
  const [submitting, setSubmitting] = useState(false);

  async function requestReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/password-reset/request/v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatusType("error");
        setStatus(getRequestErrorMessage(result.error));
      } else {
        setStatusType("success");
        setStatus("A reset link has been sent to your email.");
      }
    } catch {
      setStatusType("error");
      setStatus("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PasswordLayout>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Reset password</h1>
        <form className="mt-7 space-y-4" onSubmit={requestReset}>
          <label className="block text-sm font-medium text-stone-700">
            <span className="mb-1.5 block">Email</span>
            <span className="relative block">
              <input
                autoComplete="email"
                className={fieldClassName}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </span>
          </label>
          <button
            className="group cursor-pointer mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Sending…" : "Send reset link"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
        <Status status={status} type={statusType} />
        <p className="mt-6 text-center text-sm text-stone-500">
          <Link className="font-semibold text-amber-800 hover:underline" href="/login">
            Back to sign in
          </Link>
        </p>
      </div>
    </PasswordLayout>
  );
}

export function NewPasswordPanel({ initialError, token }: { initialError?: string; token?: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(
    initialError === "INVALID_TOKEN" || !token ? "This reset link is invalid or has expired." : "",
  );
  const [statusType, setStatusType] = useState<"error" | "success">("error");
  const [submitting, setSubmitting] = useState(false);
  const validToken = Boolean(token) && initialError !== "INVALID_TOKEN";

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setStatus("");
    if (password !== confirmPassword) {
      setStatusType("error");
      setStatus("Passwords do not match. Please try again.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await authClient.resetPassword({ newPassword: password, token });
      setStatusType(result.error ? "error" : "success");
      setStatus(
        result.error
          ? getResetErrorMessage(result.error.message)
          : "Password updated successfully. You can now sign in.",
      );
    } catch {
      setStatusType("error");
      setStatus("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PasswordLayout>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">New password</h1>
        {validToken && (
          <form className="mt-7 space-y-4" onSubmit={resetPassword}>
            <PasswordField
              label="New password"
              onChange={setPassword}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              value={password}
            />
            <PasswordField
              label="Confirm password"
              onChange={setConfirmPassword}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              value={confirmPassword}
            />
            <button
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Updating…" : "Update password"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        )}
        <Status status={status} type={statusType} />
        <p className="mt-6 text-center text-sm text-stone-500">
          <Link
            className="font-semibold text-amber-800 hover:underline"
            href={statusType === "success" ? "/login" : "/forgot-password"}
          >
            {statusType === "success" ? "Sign in" : "Request a new link"}
          </Link>
        </p>
      </div>
    </PasswordLayout>
  );
}

function PasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf0] px-4 py-4 text-stone-900 sm:px-6 sm:py-6 lg:grid lg:place-items-center lg:px-10 lg:py-10">
      <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-[0_24px_80px_-34px_rgba(120,53,15,0.20)] lg:min-h-[590px] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative isolate min-h-[220px] overflow-hidden bg-[#f8f0df] px-7 py-8 sm:min-h-[260px] sm:p-10 lg:min-h-0 lg:p-14">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(90deg,rgba(146,64,14,.06)_1px,transparent_1px),linear-gradient(rgba(146,64,14,.06)_1px,transparent_1px)] [background-size:32px_32px]" />
          <p className="relative text-xs font-bold tracking-[0.28em] text-amber-900">NexaMart</p>
          <div className="relative mx-auto mt-7 h-32 w-52 sm:mt-9 sm:h-40 sm:w-64 lg:mt-24">
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 animate-[orbit_14s_linear_infinite] rounded-full border border-amber-700/30 sm:h-36 sm:w-36" />
            <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-[orbit_9s_linear_infinite_reverse] rounded-full border border-amber-700/25 sm:h-28 sm:w-28" />
            <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-sm bg-amber-800 text-xl text-[#f8f0df] shadow-[0_10px_30px_rgba(120,53,15,0.22)]">
              ↗
            </div>
            <div className="absolute left-[18%] top-[47%] h-4 w-4 animate-[soft-pulse_3s_ease-in-out_infinite] rounded-full bg-amber-500" />
            <div className="absolute right-[17%] top-[25%] h-2.5 w-2.5 animate-[soft-pulse_3s_ease-in-out_infinite_1s] rounded-full bg-stone-900" />
          </div>
        </section>
        <section className="flex items-center px-5 py-8 sm:px-10 sm:py-12 lg:px-14">{children}</section>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  onChange,
  show,
  toggle,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  show: boolean;
  toggle: () => void;
  value: string;
}) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      <span className="mb-1.5 block">{label}</span>
      <span className="relative block">
        <input
          autoComplete="new-password"
          className={fieldClassName}
          minLength={8}
          onChange={(event) => onChange(event.target.value)}
          placeholder="At least 8 characters"
          required
          type={show ? "text" : "password"}
          value={value}
        />
        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <button
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-700"
          onClick={toggle}
          type="button"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
    </label>
  );
}

function Status({ status, type }: { status: string; type: "error" | "success" }) {
  return status ? (
    <p
      className={`mt-4 rounded-sm px-3 py-2.5 text-sm ${type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
      role="status"
      aria-live="polite"
    >
      {status}
    </p>
  ) : null;
}

function getRequestErrorMessage(message?: string) {
  const normalizedMessage = message?.toLowerCase() ?? "";
  if (normalizedMessage.includes("not found")) return "No account was found with this email.";
  return message ?? "We could not send the reset link. Please try again.";
}

function getResetErrorMessage(message?: string) {
  const normalizedMessage = message?.toLowerCase() ?? "";
  if (normalizedMessage.includes("token") || normalizedMessage.includes("expired"))
    return "This reset link is invalid or has expired.";
  return message ?? "We could not update your password. Please try again.";
}
