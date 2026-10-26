/*
|-----------------------------------------
| setting up auth.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import { randomUUID } from "crypto";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import nodemailer from "nodemailer";

import { getCanonicalAppUrl } from "@/app/api/lib/canonical-app-url";
import { invalidateDashboardCache, redisKeys } from "@/app/api/lib/redis";
import { mongoClient } from "@/lib/db";
import { accessesCollection, rolesCollection } from "@/lib/models/auth";

// Compatibility export for framework configuration and legacy call sites.
// New server code must import a resource model instead of this client.
export const client = mongoClient;

export const auth = betterAuth({
  baseURL: getCanonicalAppUrl().origin,
  basePath: "/api/auth/v1",
  trustedOrigins: (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? process.env.BETTER_AUTH_URL ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  database: mongodbAdapter(client.db(), { client }),
  account: {
    accountLinking: {
      enabled: true,
      // Google validates ownership of the Google account before returning to us.
      // This lets an existing local user sign in with the same Google email.
      trustedProviders: ["google"],
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const email = user.email.trim().toLowerCase();
          if (await accessesCollection().findOne({ email }, { projection: { id: 1 } })) return;
          const existingRole = await rolesCollection<{ id: string; name: string }>().findOne({ name: /^user$/i });
          const role = existingRole ?? { id: randomUUID(), name: "user" };
          if (!existingRole) {
            const now = new Date();
            await rolesCollection().insertOne({
              ...role,
              responsible: "Default blocked role",
              icon: "ShieldOff",
              position: -1,
              permissions: {},
              createdAt: now,
              updatedAt: now,
            });
          }
          const now = new Date();
          await accessesCollection().insertOne({
            id: randomUUID(),
            email,
            roleId: role.id,
            roleName: role.name,
            blocked: false,
            createdAt: now,
            updatedAt: now,
          });
          await invalidateDashboardCache(redisKeys.roles, redisKeys.access);
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const gmailUser = process.env.GMAIL_USER;
      const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

      if (!gmailUser || !gmailAppPassword) {
        throw new Error("Password reset email is not configured.");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailAppPassword },
      });

      await transporter.sendMail({
        from: `<${gmailUser}>`,
        to: user.email,
        subject: "Reset your password",
        text: `Reset your password: ${url}`,
        html: `<p>Use the link below to reset your password.</p><p><a href="${url}">Reset password</a></p>`,
      });
    },
  },
  emailVerification: {
    // Delivery is handled by /api/auth/resend-verification/v1 so SMTP errors reach the user interface.
    sendOnSignUp: false,
    expiresIn: 60 * 60,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const gmailUser = process.env.GMAIL_USER;
      const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

      if (!gmailUser || !gmailAppPassword) {
        throw new Error("Verification email is not configured.");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailAppPassword },
      });

      await transporter.sendMail({
        from: `<${gmailUser}>`,
        to: user.email,
        subject: "Verify your email address",
        text: `Verify your email address by opening this link within 1 hour:\n\n${url}\n\nIf you did not create an account, you can ignore this email.`,
        html: `<p>Confirm your email address by opening the verification link within 1 hour.</p><p><a href="${url}">Verify email address</a></p><p>If you did not create an account, you can safely ignore this email.</p>`,
      });
    },
  },
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),
  user: {
    additionalFields: {
      mobileNumber: {
        type: "string",
        required: false,
        input: true,
      },
      address: {
        type: "string",
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
      profilePicture: {
        type: "string",
        required: false,
        input: true,
      },
      gender: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});
