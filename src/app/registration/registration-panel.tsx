/*
|-----------------------------------------
| setting up registration-panel.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";

const fieldClassName =
  "peer w-full rounded-sm border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-4 focus:ring-amber-500/10";

export function RegistrationPanel() {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"error" | "success">("error");
  const [submitting, setSubmitting] = useState(false);

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (password !== confirmPassword) {
      setStatusType("error");
      setStatus("Passwords do not match. Please try again.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        ...(mobileNumber.trim() ? { mobileNumber: mobileNumber.trim() } : {}),
      });
      if (result.error) {
        setStatusType("error");
        setStatus(getAuthErrorMessage(result.error.message));
        return;
      }
      const emailResponse = await fetch("/api/auth/resend-verification/v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const emailResult = (await emailResponse.json()) as { error?: string };
      setStatusType(emailResponse.ok ? "success" : "error");
      if (emailResponse.ok)
        localStorage.setItem(
          `webapps:verification-resend:${email.trim().toLowerCase()}`,
          String(Date.now() + 5 * 60 * 1000),
        );
      setStatus(
        emailResponse.ok
          ? "Account created. If verification is required, an email will arrive shortly."
          : `Account created, but ${emailResult.error ?? "the verification email could not be sent."}`,
      );
    } catch {
      setStatusType("error");
      setStatus("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function signUpWithGoogle() {
    setStatus("");
    setSubmitting(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      if (result?.error) {
        setStatusType("error");
        setStatus(getAuthErrorMessage(result.error.message));
        setSubmitting(false);
      }
    } catch {
      setStatusType("error");
      setStatus("Google sign-in could not be started. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf0] px-4 py-4 text-stone-900 sm:px-6 sm:py-6 lg:grid lg:place-items-center lg:px-10 lg:py-10">
      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-[0_24px_80px_-34px_rgba(120,53,15,0.20)] lg:min-h-[680px] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative isolate min-h-[235px] overflow-hidden bg-[#f8f0df] px-7 py-8 sm:min-h-[275px] sm:p-10 lg:min-h-0 lg:p-14">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(90deg,rgba(146,64,14,.06)_1px,transparent_1px),linear-gradient(rgba(146,64,14,.06)_1px,transparent_1px)] [background-size:32px_32px]" />
          <p className="relative text-xs font-bold tracking-[0.28em] text-amber-900">NexaMart</p>
          <div className="relative mx-auto mt-7 h-32 w-52 sm:mt-9 sm:h-40 sm:w-64 lg:mt-28">
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 animate-[orbit_14s_linear_infinite] rounded-full border border-amber-700/30 sm:h-36 sm:w-36" />
            <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-[orbit_9s_linear_infinite_reverse] rounded-full border border-amber-700/25 sm:h-28 sm:w-28" />
            <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-amber-800 shadow-[0_10px_30px_rgba(120,53,15,0.22)]" />
            <div className="absolute left-[18%] top-[47%] h-4 w-4 animate-[soft-pulse_3s_ease-in-out_infinite] rounded-full bg-amber-500" />
            <div className="absolute right-[17%] top-[25%] h-2.5 w-2.5 animate-[soft-pulse_3s_ease-in-out_infinite_1s] rounded-full bg-stone-900" />
          </div>
        </section>

        <section className="flex items-center px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Create account</h1>

            <button
              className="mt-7 cursor-pointer flex w-full items-center justify-center gap-3 rounded-sm border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
              onClick={signUpWithGoogle}
              type="button"
            >
              <GoogleIcon /> Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3 text-[11px] font-medium tracking-[0.16em] text-stone-400">
              <span className="h-px flex-1 bg-stone-200" />
              OR
              <span className="h-px flex-1 bg-stone-200" />
            </div>

            <form className="space-y-4" onSubmit={register}>
              <Field label="Name" icon={<UserRound />}>
                <input
                  autoComplete="name"
                  className={fieldClassName}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  required
                  value={name}
                />
              </Field>
              <Field label="Mobile number" icon={<Phone />} optional>
                <input
                  autoComplete="tel"
                  className={fieldClassName}
                  inputMode="tel"
                  onChange={(event) => setMobileNumber(event.target.value)}
                  placeholder="e.g. +880 1XXX-XXXXXX"
                  type="tel"
                  value={mobileNumber}
                />
              </Field>
              <Field label="Email" icon={<Mail />}>
                <input
                  autoComplete="email"
                  className={fieldClassName}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </Field>
              <Field label="Password" icon={<LockKeyhole />}>
                <PasswordInput
                  onChange={setPassword}
                  show={showPassword}
                  toggle={() => setShowPassword(!showPassword)}
                  value={password}
                />
              </Field>
              <Field label="Confirm password" icon={<LockKeyhole />}>
                <PasswordInput
                  onChange={setConfirmPassword}
                  show={showConfirmPassword}
                  toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  value={confirmPassword}
                />
              </Field>

              <button
                className="group cursor-pointer mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Creating your account…" : "Create account"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
            {status && (
              <p
                className={`mt-4 rounded-sm px-3 py-2.5 text-sm ${statusType === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
                role="status"
                aria-live="polite"
              >
                {status}
              </p>
            )}
            <p className="mt-6 text-center text-sm text-stone-500">
              Already registered?{" "}
              <Link className="font-semibold text-amber-800 hover:underline" href="/login">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function getAuthErrorMessage(message?: string) {
  const normalizedMessage = message?.toLowerCase() ?? "";

  if (
    normalizedMessage.includes("already") ||
    normalizedMessage.includes("exist") ||
    normalizedMessage.includes("duplicate")
  ) {
    return "An account with this email already exists. Please sign in instead.";
  }

  return message ?? "We could not create your account. Please try again.";
}

function Field({
  children,
  icon,
  label,
  optional = false,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  label: string;
  optional?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      <span className="mb-1.5 flex items-center gap-1">
        {label}
        {optional && <span className="text-xs font-normal text-stone-400">(optional)</span>}
      </span>
      <span className="relative block">
        {children}
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>
      </span>
    </label>
  );
}

function PasswordInput({
  onChange,
  show,
  toggle,
  value,
}: {
  onChange: (value: string) => void;
  show: boolean;
  toggle: () => void;
  value: string;
}) {
  return (
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
      <button
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-700"
        onClick={toggle}
        type="button"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </span>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M21.35 12.23c0-.71-.06-1.22-.2-1.75H12v3.45h5.37a4.6 4.6 0 0 1-1.99 3.02l2.96 2.3c1.77-1.64 3.01-4.07 3.01-7.02Z"
        fill="#4285F4"
      />
      <path
        d="M12 21.7c2.63 0 4.84-.86 6.45-2.45l-2.96-2.3c-.82.55-1.88.88-3.49.88-2.53 0-4.68-1.71-5.45-4.01l-3.06 2.36A9.74 9.74 0 0 0 12 21.7Z"
        fill="#34A853"
      />
      <path
        d="M6.55 13.82A5.86 5.86 0 0 1 6.25 12c0-.63.11-1.24.3-1.82L3.49 7.82A9.7 9.7 0 0 0 2.3 12c0 1.51.36 2.94 1.19 4.18l3.06-2.36Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.17c1.76 0 3.33.61 4.57 1.8l3.42-3.42C16.83 1.61 14.63.3 12 .3a9.74 9.74 0 0 0-8.51 5.52l3.06 2.36C7.32 7.88 9.47 6.17 12 6.17Z"
        fill="#EA4335"
      />
    </svg>
  );
}
