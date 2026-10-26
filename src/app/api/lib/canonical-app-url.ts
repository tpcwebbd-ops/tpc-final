/*
|-----------------------------------------
| setting up canonical-app-url.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 29 September 2026
|-----------------------------------------
*/

const localDevelopmentUrl = "http://localhost:3000";

function isProductionBuildPhase() {
  return process.env.NODE_ENV === "production" && process.env.NEXT_PHASE === "phase-production-build";
}

function rejectOrUseBuildPlaceholder(message: string) {
  // Next.js imports API route modules during `next build` to collect route
  // configuration. This placeholder is only used in that non-serving process;
  // the production server evaluates this module again and rejects bad config.
  if (isProductionBuildPhase()) return new URL(localDevelopmentUrl);
  throw new Error(message);
}

export function getCanonicalAppUrl() {
  const configuredUrl = process.env.BETTER_AUTH_URL?.trim();
  if (!configuredUrl) {
    if (process.env.NODE_ENV === "production")
      return rejectOrUseBuildPlaceholder("BETTER_AUTH_URL must be configured as the canonical HTTPS application URL.");
    return new URL(localDevelopmentUrl);
  }

  let url: URL;
  try {
    url = new URL(configuredUrl);
  } catch {
    return rejectOrUseBuildPlaceholder("BETTER_AUTH_URL must be a valid absolute application URL.");
  }

  if (
    !new Set(["http:", "https:"]).has(url.protocol) ||
    !url.hostname ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    return rejectOrUseBuildPlaceholder("BETTER_AUTH_URL must contain only the canonical application origin.");

  if (process.env.NODE_ENV === "production" && url.protocol !== "https:")
    return rejectOrUseBuildPlaceholder("BETTER_AUTH_URL must use HTTPS in production.");

  return new URL(url.origin);
}
