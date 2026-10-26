/*
|-----------------------------------------
| setting up login-panel.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { authClient } from "@/app/api/lib/auth-client";

const fieldClassName =
  "w-full rounded-sm border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-4 focus:ring-amber-500/10";

export function LoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"error" | "success">("error");
  const [showVerificationLink, setShowVerificationLink] = useState(false);
  const [resendUntil, setResendUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!resendUntil || resendUntil <= Date.now()) return;
    const timer = window.setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);
      if (currentTime >= resendUntil) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendUntil]);

  const resendRemaining = Math.max(0, Math.ceil((resendUntil - now) / 1000));

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setShowVerificationLink(false);
    setSubmitting(true);

    try {
      const result = await authClient.signIn.email({ email, password, callbackURL: "/dashboard" });
      if (result.error) {
        setStatusType("error");
        setShowVerificationLink(isEmailVerificationError(result.error.message));
        setStatus(getSignInErrorMessage(result.error.message));
      }
    } catch {
      setStatusType("error");
      setShowVerificationLink(false);
      setStatus("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function signInWithGoogle() {
    setStatus("");
    setShowVerificationLink(false);
    setSubmitting(true);

    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" });
      if (result?.error) {
        setStatusType("error");
        setShowVerificationLink(isEmailVerificationError(result.error.message));
        setStatus(getSignInErrorMessage(result.error.message));
        setSubmitting(false);
      }
    } catch {
      setStatusType("error");
      setShowVerificationLink(false);
      setStatus("Google sign-in could not be started. Please try again.");
      setSubmitting(false);
    }
  }

  async function resendVerification() {
    setStatus("");
    setShowVerificationLink(false);
    if (!email.trim()) {
      setStatusType("error");
      setStatus("Enter your email address first.");
      return;
    }
    try {
      const response = await fetch("/api/auth/resend-verification/v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as { error?: string; retryAfter?: number };
      if (result.retryAfter) setResendUntil(Date.now() + result.retryAfter * 1000);
      setStatusType(response.ok ? "success" : "error");
      setStatus(
        response.ok
          ? "If this address can receive verification, an email will arrive shortly."
          : (result.error ?? "Verification email could not be sent."),
      );
    } catch {
      setStatusType("error");
      setStatus("Verification email could not be sent. Please try again.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf0] px-4 py-4 text-stone-900 sm:px-6 sm:py-6 lg:grid lg:place-items-center lg:px-10 lg:py-10">
      <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden rounded-sm border border-[#eadfca] bg-white shadow-[0_24px_80px_-34px_rgba(120,53,15,0.20)] lg:min-h-[650px] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative isolate min-h-[235px] overflow-hidden bg-[#f8f0df] px-7 py-8 sm:min-h-[275px] sm:p-10 lg:min-h-0 lg:p-14">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(90deg,rgba(146,64,14,.06)_1px,transparent_1px),linear-gradient(rgba(146,64,14,.06)_1px,transparent_1px)] [background-size:32px_32px]" />
          <p className="relative text-xs font-bold tracking-[0.28em] text-amber-900">NexaMart</p>
          <div className="relative mx-auto mt-7 h-32 w-52 sm:mt-9 sm:h-40 sm:w-64 lg:mt-28">
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 animate-[orbit_14s_linear_infinite] rounded-full border border-amber-700/30 sm:h-36 sm:w-36" />
            <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-[orbit_9s_linear_infinite_reverse] rounded-full border border-amber-700/25 sm:h-28 sm:w-28" />
            <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-sm bg-amber-800 text-xl text-[#f8f0df] shadow-[0_10px_30px_rgba(120,53,15,0.22)]">
              →
            </div>
            <div className="absolute left-[18%] top-[47%] h-4 w-4 animate-[soft-pulse_3s_ease-in-out_infinite] rounded-full bg-amber-500" />
            <div className="absolute right-[17%] top-[25%] h-2.5 w-2.5 animate-[soft-pulse_3s_ease-in-out_infinite_1s] rounded-full bg-stone-900" />
          </div>
        </section>

        <section className="flex items-center px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Sign in</h1>
            <button
              className="mt-7 cursor-pointer flex w-full items-center justify-center gap-3 rounded-sm border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
              onClick={signInWithGoogle}
              type="button"
            >
              <GoogleIcon /> Continue with Google
            </button>
            <div className="my-6 flex items-center gap-3 text-[11px] font-medium tracking-[0.16em] text-stone-400">
              <span className="h-px flex-1 bg-stone-200" />
              OR
              <span className="h-px flex-1 bg-stone-200" />
            </div>

            <form className="space-y-4" onSubmit={signIn}>
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
              <label className="block text-sm font-medium text-stone-700">
                <span className="mb-1.5 flex items-center justify-between gap-3">
                  <span>Password</span>
                  <Link
                    className="text-xs font-semibold text-amber-800 transition hover:text-amber-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"
                    href="/forgot-password"
                  >
                    Forgot password?
                  </Link>
                </span>
                <span className="relative block">
                  <input
                    autoComplete="current-password"
                    className={fieldClassName}
                    minLength={8}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Your password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-stone-700"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>
              <button
                className="group mt-2 cursor-pointer flex w-full items-center justify-center gap-2 rounded-sm bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Signing in…" : "Sign in"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
            {status && (
              <p
                className={`mt-4 rounded-sm px-3 py-2.5 text-sm ${statusType === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                role="status"
                aria-live="polite"
              >
                {status}
                {resendRemaining > 0 &&
                  status.includes("You can resend the verification email") &&
                  ` (${formatCountdown(resendRemaining)})`}
                {showVerificationLink && (
                  <>
                    {" "}
                    <a
                      className="font-bold text-amber-900 underline decoration-2 underline-offset-2 transition hover:text-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"
                      href="#verify-email"
                      onClick={(event) => {
                        event.preventDefault();
                        void resendVerification();
                      }}
                    >
                      verify email
                    </a>
                  </>
                )}
              </p>
            )}
            <p className="mt-6 text-center text-sm text-stone-500">
              New here?{" "}
              <Link className="font-semibold text-amber-800 hover:underline" href="/registration">
                Create account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function getSignInErrorMessage(message?: string) {
  const normalizedMessage = message?.toLowerCase() ?? "";
  if (isEmailVerificationError(message)) return "Your email address has not been verified.";
  if (
    normalizedMessage.includes("not found") ||
    normalizedMessage.includes("invalid") ||
    normalizedMessage.includes("credential")
  )
    return "No account was found with this email and password.";
  return message ?? "We could not sign you in. Please try again.";
}

function isEmailVerificationError(message?: string) {
  const normalizedMessage = message?.toLowerCase() ?? "";
  return (
    normalizedMessage.includes("not verified") ||
    normalizedMessage.includes("email_not_verified") ||
    normalizedMessage.includes("email verification")
  );
}

function formatCountdown(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
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
